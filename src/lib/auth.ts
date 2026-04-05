import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updateProfile,
  User,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc, writeBatch } from "firebase/firestore";
import { auth, db } from "./firebase";
import { logAnalyticsEvent, setAnalyticsUserId } from "./analytics";
import { toast } from "react-toastify";
import { getDifferenceFromNow } from "./date";
import { Analytics } from "@/types/analytics";

export const loginWithEmailPassword = async (
  email: string,
  password: string,
): Promise<User> => {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    toast.success("User logged in");

    // Analytics
    setAnalyticsUserId(userCred.user.uid);
    logAnalyticsEvent("user_returned", {
      login_method: "email",
      days_since_last_visit: userCred.user.metadata.lastSignInTime
        ? Math.floor(
            getDifferenceFromNow(
              new Date(userCred.user.metadata.lastSignInTime),
            ) /
              (1000 * 3600 * 24),
          )
        : "unknown",
      timestamp: serverTimestamp(),
    });

    return userCred.user;
  } catch (err) {
    throw err;
  }
};

export const registerWithEmailPassword = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): Promise<User> => {
  try {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCred.user;

    await sendEmailVerification(user);

    const displayName = `${firstName} ${lastName}`.trim();
    if (displayName) {
      await updateProfile(user, { displayName });
    }

    const batch = writeBatch(db);

    const userRef = doc(db, "users", user.uid);
    const userPayload = {
      name: displayName,
      email: email,
      targetApplicationPerDay: 0,
      archiveDate: serverTimestamp(),
      hasSeenWelcome: false,
    };
    // await setDoc(userRef, userPayload);

    const analyticsRef = doc(db, "users", user.uid, "metadata", "analytics");
    const initialAnalytics = {
      applicationCounts: {
        wishlist: 0,
        applied: 0,
        interviewing: 0,
        rejected: 0,
        offered: 0,
        cancelled: 0,
      },
      companies: { allApplied: [], activeList: [] },
      weeklyActivity: {},
      lastUpdated: serverTimestamp(),
    };

    batch.set(userRef, userPayload);
    batch.set(analyticsRef, initialAnalytics);

    await batch.commit();

    // Analytics
    setAnalyticsUserId(user.uid);
    logAnalyticsEvent("account_created", {
      signup_method: "email",
      timestamp: serverTimestamp(),
    });

    return user;
  } catch (err) {
    throw err;
  }
};
