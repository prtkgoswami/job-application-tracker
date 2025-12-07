import { useCallback, useEffect, useState } from "react";
import { User as UserType } from "../types/user";
import { useAuth } from "../components/AuthProvider";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { getDateString } from "../lib/date";
import { User } from "firebase/auth";

type UserHookResponse = {
  data?: UserType;
  user: User | null;
  isLoading: boolean;
  error?: Error;
};

type FirestoreUser = {
  name: string;
  email: string;
  password: string;
  archiveDate: Timestamp;
  targetApplicationPerDay: number;
  hasSeenWelcome: boolean;
};

const useUser = (): UserHookResponse => {
  const [data, setData] = useState<UserType | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const user = useAuth();

  const fetchUser = useCallback(async (uid: string) => {
    try {
      setIsLoading(true);

      const docRef = doc(db, "users", uid);
      const userDoc = await getDoc(docRef);
      const userData = userDoc.data() as FirestoreUser;

      setData({
        ...userData,
        uid,
        archiveDate: getDateString(userData?.archiveDate.toDate()),
      });
    } catch (err) {
      console.error("Failed to fetch profile data", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      void fetchUser(user.uid);
    }
  }, [fetchUser, user]);

  return {
    data,
    user,
    isLoading,
    error,
  };
};

export default useUser;
