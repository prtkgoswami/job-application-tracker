import { useCallback, useEffect, useState } from "react";
import { Job, JobStatus } from "../types/job";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { getDateString } from "../lib/date";

export type CountsType = {
  total: number;
  wishlisted: number;
  active: number;
  rejected: number;
  offered: number;
}

type JobsHookResponse = {
  jobs: Job[];
  counts: CountsType;
  isLoading: boolean;
  error?: Error;
  refetch: () => void;
};

type FirestoreJob = {
  title: string;
  link: string;
  location?: string;
  company: string;
  jobType: "onsite" | "hybrid" | "remote";
  responsibilities: string;
  requirements: string;
  notes?: string;
  status: JobStatus;
  createDate?: Timestamp;
  lastUpdateDate?: Timestamp;
  userId: string;
};

const useJobs = (userId: string | null | undefined, refetchKey?: number): JobsHookResponse => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();

  const fetchJobs = useCallback(async () => {
    if (!userId) {
      setJobs([]);
      return;
    }

    setError(undefined);

    try {
      setIsLoading(true);
      const jobsRef = collection(db, "jobs");
      const q = query(
        jobsRef,
        where("userId", "==", userId),
        orderBy("lastUpdateDate", "desc")
      );
      const snapshot = await getDocs(q);

      const nextJobs: Job[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as FirestoreJob;

        const createDate = data.createDate
          ? getDateString(data.createDate.toDate())
          : getDateString(new Date());

        const lastUpdateDate = data.lastUpdateDate
          ? getDateString(data.lastUpdateDate.toDate())
          : createDate;

        return {
          id: docSnap.id,
          title: data.title,
          link: data.link,
          location: data.location,
          company: data.company,
          jobType: data.jobType,
          responsibilities: data.responsibilities,
          requirements: data.requirements,
          notes: data.notes,
          status: data.status ?? "applied",
          createDate,
          lastUpdateDate,
        };
      });
      setJobs(nextJobs);
    } catch (err: unknown) {
      console.error("Application Fetch Error", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void fetchJobs();
  }, [fetchJobs, refetchKey]);

  const counts: CountsType = {
    total: jobs.length,
    wishlisted: jobs.filter(jobs => jobs.status === "wishlist").length,
    active: jobs.filter(job => (job.status === 'applied' || job.status === "interviewing")).length,
    rejected: jobs.filter(job => job.status === "rejected").length,
    offered: jobs.filter(job => job.status === "offer").length
  }

  return {
    jobs,
    counts,
    isLoading,
    error,
    refetch: fetchJobs,
  };
};

export default useJobs;
