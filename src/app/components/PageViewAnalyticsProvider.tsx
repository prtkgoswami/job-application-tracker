// app/components/AnalyticsProvider.tsx
"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { logAnalyticsEvent } from "@/app/lib/analytics";
import { useAuth } from "./AuthProvider";

const PageViewAnalyticsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const user = useAuth();
  const lastPathRef = useRef<string>("");

  useEffect(() => {
    const pageParts = pathname.split("/");
    const pageName = pageParts[pageParts.length - 1];

    // Only log if path actually changed
    if (pathname !== lastPathRef.current) {
      lastPathRef.current = pathname;

      // Log page view with consistent parameters
      logAnalyticsEvent("page_view", {
        page_path: pathname,
        page_title: pageName ?? document.title,
        is_logged_in: !!user,
      });
    }
  }, [pathname, user]);

  return <>{children}</>;
};

export default PageViewAnalyticsProvider;
