"use client";
import { logEvent, setUserId } from "firebase/analytics";
import { analytics } from "./firebase";

const loggedEvents = new Set<string>();

export const isLocal = () => {
  return window.location.hostname.includes("localhost");
};

export const setAnalyticsUserId = (userId: string) => {
  if (!analytics || isLocal()) return;
  setUserId(analytics, userId);
};

export const unsetAnalyticsUserId = () => {
  if (!analytics || isLocal()) return;
  setUserId(analytics, null);
};

export const logAnalyticsEvent = (
  name: string,
  params?: Record<string, any>
) => {
  if (!analytics || isLocal()) return;
  logEvent(analytics, name, params);
};
