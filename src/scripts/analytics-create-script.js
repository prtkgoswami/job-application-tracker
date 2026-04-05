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

            const jobsSnapshot = await db.collection('jobs')
                .where('userId', '==', userId)
                .get();

            const jobs = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const analytics = {
                applicationCounts: {
                    wishlist: 0,
                    applied: 0,
                    interviewing: 0,
                    rejected: 0,
                    offered: 0,
                    cancelled: 0
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

                analytics.applicationCounts[status]++;

                analytics.companies.allApplied.add(job.company);
                if (['applied', 'interviewing'].includes(status)) {
                    analytics.companies.activeList.add(job.company)
                }

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

            // console.log(finalPayload)
            const analyticsRef = db.doc(`users/${userId}/metadata/analytics`);
            const batch = db.batch();

            batch.delete(analyticsRef); // Deletes the old doc if it exists
            batch.set(analyticsRef, finalPayload); // Sets the fresh one

            await batch.commit();
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