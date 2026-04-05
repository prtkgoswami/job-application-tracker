import { Timestamp } from "firebase/firestore";
import { JobStatus } from "./job";

export type WeeklyActivity = {
  [weekKey: string]: {
    [dateKey: string]: number;
  };
};

export type Analytics = {
  applicationCounts: Record<JobStatus, number>;
  companies: {
    allApplied: string[];
    activeList: string[];
  };
  weeklyActivity: WeeklyActivity;
  lastUpdated: Timestamp;
};
