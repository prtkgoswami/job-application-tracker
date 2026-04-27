import admin from "firebase-admin";
import { db } from "@/lib/firebase-server";
import { Resend } from "resend";
import { FirestoreJob, FirestoreUser } from "@/types/firestore";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_EMAIL_KEY);

type Job = { id: string } & FirestoreJob;
type User = { id: string } & FirestoreUser;
type Email = {
  userId: string;
  name: string;
  email: string;
  jobs: Job[];
};

export async function GET(req: NextRequest) {
  try {
    // 1. Security
    const isVercelCron = req.headers.get("x-vercel-cron") === "true";

    if (!isVercelCron) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    // 2. Fetch all wishlisted jobs
    // Grouping logic: Map<userId, Job[]>
    const jobsByUserId = new Map<string, Job[]>();

    const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
    const threshold = Date.now() - THREE_DAYS_MS;

    const jobSnapshot = await db
      .collection("jobs")
      .where("status", "==", "wishlist")
      .get();

    jobSnapshot.forEach((docSnap) => {
      const job = { id: docSnap.id, ...docSnap.data() } as Job;
      const createDate = job.createDate
        ? job.createDate.toDate().getTime()
        : new Date().getTime();
      const lastNotifiedAt = job.lastNotifiedAt
        ? job.lastNotifiedAt.toDate().getTime()
        : 0;
      if (createDate < threshold && lastNotifiedAt < threshold) {
        const userId = job.userId;
        if (!jobsByUserId.has(userId)) jobsByUserId.set(userId, []);
        jobsByUserId.get(userId)?.push(job);
      }
    });

    // 3. Fetch all Corresponding users
    const usersByUserId = new Map<string, User>();

    const userIds = Array.from(jobsByUserId.keys());
    const userSnapshot = await db
      .collection("users")
      .where(admin.firestore.FieldPath.documentId(), "in", userIds)
      .get();

    userSnapshot.forEach((docSnap) => {
      const userId = docSnap.id;
      const user = { id: userId, ...docSnap.data() } as User;

      usersByUserId.set(userId, user);
    });

    // 4. Create Email Object
    const emails: Email[] = [];

    jobsByUserId.entries().forEach(([userId, jobs]) => {
      const userDetails = usersByUserId.get(userId);
      const obj: Email = {
        userId: userId,
        name: userDetails?.name ?? "",
        email: userDetails?.email ?? "",
        jobs,
      };
      emails.push(obj);
    });

    // 5. Process each user's batch
    const batch = db.batch();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emailPromises: Promise<any>[] = [];

    for (const email of emails) {
      if (!email || !email.email) {
        console.warn(
          `Skipping jobs for ${email.userId}: User details not found.`,
        );
        continue;
      }

      const displayedJobs = email.jobs.slice(0, 5);
      const hasMore = email.jobs.length > 5;
      const extraCount = email.jobs.length - 5;

      // Send Email
      emailPromises.push(
        resend.emails.send({
          from: "JobTrackr <jobtrackr.notifications@pratikgoswami.dev>",
          to: email.email,
          replyTo: "noreply@notifications.pratikgoswami.dev",
          subject: "Time to apply!",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #0a0a0a;">
              <div style="background-color: #fe9a00; margin-bottom: 20px; padding: 12px;"><h2 style="color: #0a0a0a;">JobTrackr</h2></div>
              <h3 style="padding: 6px 18pxl">Pending Wishlist Applications:</h3>
              <ul style="list-style: none">
                ${displayedJobs.map((j) => `<li><a href="https://jobtrack.pratikgoswami.dev/${email.userId}/jobs?status=wishlisted"><button style="width: 400px; border: 1px solid #27272a; background-color: transparent; padding: 12px; margin: 8px;">${j.company} - ${j.title}</button></a></li>`).join("")}
              </ul>
              ${hasMore ? `<p>...and ${extraCount} more jobs in your wishlist.</p>` : ""}
              <footer style="margin-top: 40px; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
                <p>This is an automated notification from JobTracker.</p>
                <p>Please do not reply to this email. For support, contact <a href="mailto:jobtrackrapp@gmail.com" style="color: #6b7280;">jobtrackrapp@gmail.com</a>.</p>
              </footer>
            </div>
          `,
        }),
      );

      // Queue DB updates for ALL jobs (not just the 5 displayed)
      email.jobs.forEach((job) => {
        const jobRef = db.collection("jobs").doc(job.id);
        batch.update(jobRef, {
          lastNotifiedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      });
    }

    // 5. Execute all operations
    await Promise.all(emailPromises);
    await batch.commit();

    return NextResponse.json(
      JSON.stringify({ processedUsers: jobsByUserId.size }),
      {
        status: 200,
      },
    );
  } catch (err) {
    console.error("Error", err);
    return NextResponse.json(
      JSON.stringify({ error: err ?? "Failed to send emails" }),
      {
        status: 500,
      },
    );
  }
}
