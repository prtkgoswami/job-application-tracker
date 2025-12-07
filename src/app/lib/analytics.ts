"use client"
import { logEvent, setUserId } from "firebase/analytics";
import { analytics } from "./firebase";

const loggedEvents = new Set<string>();

export const setAnalyticsUserId = (userId: string) => {
  if (!analytics) return;
  setUserId(analytics, userId);
};

export const unsetAnalyticsUserId = () => {
  if (!analytics) return;
  setUserId(analytics, null);
};

export const logAnalyticsEvent = (
  name: string,
  params?: Record<string, any>
) => {
  if (!analytics) return;

  logEvent(analytics, name, params);
};
