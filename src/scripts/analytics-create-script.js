import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(readFileSync('./job-tracker-serviceAccountKey.json', 'utf8'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

async function migrateAnalytics() {
    try {
        const usersSnapshot = await db.collection('users').get();

        for (const userDoc of usersSnapshot.docs) {
            const userId = userDoc.id;

            if (userId === "fpSYEVNzyKdC8a87HkkiTIsLFL73")
                continue

            const jobsSnapshot = await db.collection('jobs')
                .where('userId', '==', userId)
                .get();

            const jobs = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const analytics = {
                applicationCounts: {
                    total: jobs.length,
                    wishlisted: 0,
                    active: 0,
                    rejected: 0,
                    offered: 0,
                    pending: 0
                },
                companies: {
                    allApplied: new Set(),
                    activeList: new Set()
                },
                weeklyActivity: {},
                lastUpdated: admin.firestore.FieldValue.serverTimestamp()
            };

            jobs.forEach(job => {
                const status = job.status;

                if (status === "wishlist") analytics.applicationCounts.wishlisted++;
                else if (status === "offered") analytics.applicationCounts.offered++;
                else if (status === "rejected") analytics.applicationCounts.rejected++;
                else if (['applied', 'interviewing'].includes(status)) {
                    analytics.applicationCounts.active++;
                    if (status === "applied") analytics.applicationCounts.pending++;
                    analytics.companies.activeList.add(job.company)
                }

                analytics.companies.allApplied.add(job.company);

                const date = job.createDate.toDate().toISOString().split('T')[0];
                const weekKey = `W-${getWeekNumber(new Date(date))}`;

                if (!analytics.weeklyActivity[weekKey]) analytics.weeklyActivity[weekKey] = {};
                analytics.weeklyActivity[weekKey][date] = (analytics.weeklyActivity[weekKey][date] || 0) + 1;
            })

            const finalPayload = {
                ...analytics,
                companies: {
                    allApplied: Array.from(analytics.companies.allApplied),
                    activeList: Array.from(analytics.companies.activeList)
                },
            };

            await db.doc(`users/${userId}/metadata/analytics`).set(finalPayload, { merge: true });
            console.log(`Successfully updated analytics for ${userId}`);

        }
    } catch (err) {
        console.error(err)
    }
}

function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

migrateAnalytics();