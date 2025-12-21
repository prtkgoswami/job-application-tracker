export type JobStatus = "wishlist" | "applied" | "interviewing" | "rejected" | "offered" | "cancelled";

export type JobType = "onsite" | "hybrid" | "remote";

export type Job = {
  id: string;
  title: string;
  link: string;
  location?: string;
  company: string;
  jobType: JobType;
  responsibilities: string;
  requirements: string;
  notes?: string;
  status: JobStatus;
  createDate: string; // ISO string for UI
  lastUpdateDate: string; // ISO string for UI
};
