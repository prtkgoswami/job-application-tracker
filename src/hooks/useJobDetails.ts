import { db } from "@/lib/firebase";
import { FirestoreEvent, FirestoreJob } from "@/types/firestore";
import { Job, JobType } from "@/types/job";
import { ScheduledEvent } from "@/types/schedule";
import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

const getDateString = (date: Date) => {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

type UseJobDetailsResponse = {
  job: Job | null;
  events: ScheduledEvent[];
  isLoading: boolean;
  error: string | null;
};

const useJobDetails = (
  userId: string | undefined,
  jobId: string | undefined,
): UseJobDetailsResponse => {
  const [job, setJob] = useState<Job | null>(null);
  const [events, setEvents] = useState<ScheduledEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!userId || !jobId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      // Fetch Job Details
      const jobsRef = collection(db, "jobs");
      const jobQuery = query(
        jobsRef,
        where(documentId(), "==", jobId),
        where("userId", "==", userId),
      );
      const jobSnap = await getDocs(jobQuery);

      if (jobSnap.empty) {
        setError("Job not found");
        setIsLoading(false);
        return;
      }

      const jobDoc = jobSnap.docs[0];
      const jobData = jobDoc.data() as FirestoreJob;
      const fetchedJob: Job = {
        id: jobDoc.id,
        title: jobData.title,
        link: jobData.link,
        location: jobData.location,
        company: jobData.company,
        jobType: jobData.jobType,
        responsibilities: jobData.responsibilities,
        requirements: jobData.requirements,
        notes: jobData.notes,
        status: jobData.status ?? "applied",
        createDate: jobData.createDate
          ? getDateString(jobData.createDate.toDate())
          : getDateString(new Date()),
        lastUpdateDate: jobData.lastUpdateDate
          ? getDateString(jobData.lastUpdateDate.toDate())
          : getDateString(new Date()),
      };

      setJob(fetchedJob);

      // Fetch Related Events
      const scheduleRef = collection(db, "schedule");
      const q = query(
        scheduleRef,
        where("userId", "==", userId),
        where("relatedJobId", "==", jobId),
        orderBy("dateTime", "desc"),
      );
      const scheduleSnap = await getDocs(q);
      const fetchedEvents: ScheduledEvent[] = scheduleSnap.docs.map(
        (docSnap) => {
          const data = docSnap.data() as FirestoreEvent;
          return {
            id: docSnap.id,
            title: data.title,
            description: data.description,
            dateTime: data.dateTime,
            duration: Number(data.durationMins),
            relatedJobId: data.relatedJobId,
            relatedLink: data.relatedLink ?? "",
            relatedPeople: data.relatedPeople ?? "",
            createdDate: data.createdDate?.toMillis() || 0,
            isDone: data.isDone ?? false,
          };
        },
      );

      setEvents(fetchedEvents);
    } catch (err) {
      console.error("Error fetching details:", err);
      setError("Missing or insufficient permissions.");
    } finally {
      setIsLoading(false);
    }
  }, [userId, jobId]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return { job, events, isLoading, error };
};

export default useJobDetails;
