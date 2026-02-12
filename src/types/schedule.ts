export type ScheduledEvent = {
  id: string;
  title: string;
  description?: string;
  dateTime: number;
  duration: number;
  relatedJobId: string;
  relatedPeople?: string;
  relatedLink?: string;
  createdDate: number;
  isDone: boolean;
};

export type Schedule = ScheduledEvent[];
