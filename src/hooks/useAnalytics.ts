import { useAuth } from "@/contexts/AuthProvider";
import { db } from "@/lib/firebase";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";

export type WeeklyActivity = {
  [weekKey: string]: {
    [dateKey: string]: number;
  };
};

export type Analytics = {
  applicationCounts: {
    total: number;
    wishlisted: number;
    active: number;
    rejected: number;
    offered: number;
    pending: number;
  };
  companies: {
    allApplied: string[];
    activeList: string[];
  };
  weeklyActivity: WeeklyActivity;
  lastUpdated: Timestamp;
};

type HookResponse = {
  data: Analytics | undefined;
  isLoading: boolean;
  error?: Error;
};

const useAnalytics = (): HookResponse => {
  const [data, setData] = useState<Analytics | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const user = useAuth();

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const uid = user?.uid;
      if (!uid) return;
      const analyticsRef = doc(db, "users", uid, "metadata", "analytics");
      const analyticsSnapshot = await getDoc(analyticsRef);

      if (!analyticsSnapshot.exists()) return;

      setData(analyticsSnapshot.data() as Analytics);
    } catch (err) {
      console.error("Failed to fetch User Analytics", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    data,
    isLoading,
    error,
  };
};

export default useAnalytics;
