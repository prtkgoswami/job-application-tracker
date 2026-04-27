import { JobStatus, JobType } from "@/types/job";
import { Timestamp } from "firebase/firestore";

export type FirestoreJob = {
  title: string;
  link: string;
  location?: string;
  company: string;
  jobType: JobType;
  responsibilities: string;
  requirements: string;
  notes?: string;
  status: JobStatus;
  createDate?: Timestamp;
  lastUpdateDate?: Timestamp;
  userId: string;
  lastNotifiedAt?: Timestamp | null;
};

export type FirestoreUser = {
  name: string;
  email: string;
  password: string;
  archiveDate: Timestamp;
  targetApplicationPerDay: number;
  hasSeenWelcome: boolean;
};

export type FirestoreEvent = {
  title: string;
  description?: string;
  dateTime: number;
  durationMins: number;
  relatedJobId: string;
  relatedPeople?: string;
  relatedLink?: string;
  createdDate: Timestamp;
  userId: string;
  isDone: boolean;
};
