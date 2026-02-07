import { useCallback, useEffect, useState } from "react";
import { ScheduledEvent } from "@/types/schedule";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type ScheduleHookResponse = {
  events: ScheduledEvent[];
  isLoading: boolean;
  error?: Error;
  refetch: () => void;
};

type FirestoreEvent = {
  title: string;
  description?: string;
  dateTime: number;
  relatedJobId: string;
  createdDate: Timestamp;
  userId: string;
  isDone: boolean;
};

const useSchedule = (
  userId: string | null | undefined,
  refetchKey?: number,
): ScheduleHookResponse => {
  const [scheduledEvents, setScheduledEvents] = useState<ScheduledEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();

  const fetchSchedule = useCallback(async () => {
    if (!userId) {
      setScheduledEvents([]);
      return;
    }

    setError(undefined);

    try {
      setIsLoading(true);
      const scheduleRef = collection(db, "schedule");
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const q = query(
        scheduleRef,
        where("userId", "==", userId),
        where("dateTime", ">=", startOfToday.getTime()),
        orderBy("dateTime", "asc"),
      );
      const snapshot = await getDocs(q);

      const nextEvents: ScheduledEvent[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as FirestoreEvent;

        return {
          id: docSnap.id,
          title: data.title,
          description: data.description,
          dateTime: data.dateTime,
          relatedJobId: data.relatedJobId,
          createdDate: data.createdDate?.toMillis() || 0,
          isDone: data.isDone ?? false,
        };
      });

      setScheduledEvents(nextEvents);
    } catch (err: unknown) {
      console.error("Schedule Fetch Error", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void fetchSchedule();
  }, [fetchSchedule, refetchKey]);

  return {
    events: scheduledEvents,
    isLoading,
    error,
    refetch: fetchSchedule,
  };
};

export default useSchedule;
