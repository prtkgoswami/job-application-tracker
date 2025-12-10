"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { logAnalyticsEvent, setAnalyticsUserId } from "./analytics"; // if you have this
import { getDifferenceFromNow } from "./date";

const provider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  provider.setCustomParameters({
    prompt: "select_account",
  });

  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Create / update user profile doc
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  // Tie Analytics userId to this uid if you're using it
  await setAnalyticsUserId?.(user.uid);

  if (!snap.exists()) {
    await setDoc(userRef, {
      email: user.email,
      name: user.displayName,
      targetApplicationPerDay: 0,
      archiveDate: serverTimestamp(),
      hasSeenWelcome: false,
    });
    // Analytics: new account
    await logAnalyticsEvent?.("account_created", {
      signup_method: "google",
      timestamp: serverTimestamp(),
    });
  } else {
    // Analytics: returning user
    await logAnalyticsEvent?.("user_returned", {
      login_method: "google",
      days_since_last_visit: user.metadata.lastSignInTime
        ? Math.floor(
            getDifferenceFromNow(new Date(user.metadata.lastSignInTime)) /
              (1000 * 3600 * 24)
          )
        : "unknown",
      timestamp: serverTimestamp(),
    });
  }


  return user;
}
