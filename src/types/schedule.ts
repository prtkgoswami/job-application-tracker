export type ScheduledEvent = {
  id: string;
  title: string;
  description?: string;
  dateTime: number;
  relatedJobId: string;
  createdDate: number;
  isDone: boolean;
};

export type Schedule = ScheduledEvent[];
