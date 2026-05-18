"use client";
import { useAuth } from "@/contexts/AuthProvider";
import React from "react";
import useAnalytics from "@/hooks/useAnalytics";
import { getWeekNumber } from "@/lib/date";
import WeeklyGraph from "./WeeklyGraph";
import ApplicationBreakdown from "./ApplicationBreakdown";
import CompaniesTab from "./CompaniesTab";

const AnalyticsContent = () => {
  const { data, isLoading, error } = useAnalytics();
  const today = new Date().toISOString();
  const todayDate = today.split("T")[0];
  const weekNum = getWeekNumber(new Date(todayDate));
  const weekStreak = data?.weeklyActivity[`W-${weekNum}`];

  return (
    <div>
      <div className="flex justify-between items-center px-3 py-2 md:px-5 pt-5">
        <h2 className="text-xl md:text-2xl text-accent-1 leading-relaxed">
          Analytics Dashboard
        </h2>
      </div>
      <div className="w-full grow grid grid-cols-12 gap-x-5 gap-y-5 px-5 py-8">
        <div className="md:col-start-2 col-span-12 md:col-span-10 bg-gray-100/5 rounded-lg py-8 px-5 h-max">
          <h2 className="text-2xl font-light text-amber-500 text-center mb-5">
            Weekly Streak
          </h2>
          <WeeklyGraph weeklyStreak={weekStreak ?? {}} />
        </div>

        <div className="md:col-start-2 col-span-12 md:col-span-4 bg-gray-100/5 rounded-lg py-8 px-5 h-max">
          <h2 className="text-2xl font-light text-amber-500 text-center mb-5">
            Application Stats
          </h2>
          <ApplicationBreakdown counts={data?.applicationCounts} />
        </div>

        <div className="md:col-start-6 col-span-12 md:col-span-6 bg-gray-100/5 rounded-lg py-8 px-5 h-max">
          <h2 className="text-2xl font-light text-amber-500 text-center mb-5">
            Companies
          </h2>
          <CompaniesTab
            listData={{
              all: data?.companies.allApplied ?? [],
              active: data?.companies.activeList ?? [],
            }}
          />
        </div>
      </div>
    </div>
  );
};

const AnalyticsPage = () => {
  const user = useAuth();
  if (!user) return <></>;

  return <AnalyticsContent />;
};

export default AnalyticsPage;
