"use client";
import { useAuth } from "@/contexts/AuthProvider";
import useJobs from "@/hooks/useJobs";
import { User } from "firebase/auth";
import React from "react";
import AnalyticsCard from "./AnalyticsCard";

const AnalyticsContent = ({ user }: { user: User }) => {
  const { companyList, counts, jobs } = useJobs(user.uid);

  const getLocationCount = () => {
    const result: Record<string, number> = {};
    const filteredJobs = jobs.filter(
      (job) => job.status !== "wishlist" && job.status !== "rejected",
    );

    filteredJobs.forEach((job) => {
      let location;
      location = job.location ?? "remote";
      if (job.jobType === "remote") location = "remote";
      result[location] = (result[location] ?? 0) + 1;
    });

    return Object.entries(result)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .reduce(
        (acc, [key, val]) => {
          acc[key.trim()] = (acc[key.trim()] ?? 0) + val;
          return acc;
        },
        {} as Record<string, number>,
      );
  };

  const sortedCompanyList = companyList.sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase()),
  );

  return (
    <div className="w-full grow grid grid-cols-2 lg:grid-cols-3 gap-4 px-5 py-8">
      <AnalyticsCard title="Companies" showCount count={companyList.length}>
        <ul className="max-h-120 overflow-auto list-none p-2">
          {companyList.map((company) => (
            <li key={company}>{company}</li>
          ))}
        </ul>
      </AnalyticsCard>

      <AnalyticsCard title="Stats">
        {Object.entries(counts).map(([key, value]) => (
          <div
            key={`stat-${key}`}
            className="flex justify-between items-center"
          >
            <p className="capitalize">{key}</p>
            <p>{value}</p>
          </div>
        ))}
        <div className="flex justify-between items-center">
          <p className="capitalize">Applied (Waiting)</p>
          <p>{jobs.filter((job) => job.status === "applied").length}</p>
        </div>
        <div className="flex justify-between items-center text-green-500">
          <p className="capitalize">Success Rate</p>
          <p className="blur-xs hover:blur-none">
            {Number(
              ((counts.rejected / counts.total) * 100).toFixed(2),
            ).toString()}
            %
          </p>
        </div>
        <div className="flex justify-between items-center text-red-600">
          <p className="capitalize">Rejection Rate</p>
          <p className="blur-xs hover:blur-none">
            {Number(
              (((counts.total - counts.rejected) / counts.total) * 100).toFixed(
                2,
              ),
            ).toString()}
            %
          </p>
        </div>
      </AnalyticsCard>

      <AnalyticsCard
        title="Locations"
        showCount
        count={Object.keys(getLocationCount()).length}
      >
        {Object.entries(getLocationCount()).map(([key, value]) => (
          <div
            key={`stat-${key}`}
            className="flex justify-between items-center"
          >
            <p className="capitalize">{key}</p>
            <p>{value}</p>
          </div>
        ))}
      </AnalyticsCard>
    </div>
  );
};

const AnalyticsPage = () => {
  const user = useAuth();
  if (!user) return <></>;

  return <AnalyticsContent user={user} />;
};

export default AnalyticsPage;
