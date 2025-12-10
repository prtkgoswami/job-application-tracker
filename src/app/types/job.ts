// types/job.ts (optional)
export type JobStatus = "wishlist" | "applied" | "interviewing" | "rejected" | "offered";

export type Job = {
  id: string;
  title: string;
  link: string;
  location?: string;
  company: string;
  jobType: "onsite" | "hybrid" | "remote";
  responsibilities: string;
  requirements: string;
  notes?: string;
  status: JobStatus;
  createDate: string; // ISO string for UI
  lastUpdateDate: string; // ISO string for UI
};
