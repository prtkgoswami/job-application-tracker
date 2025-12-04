"use client";
import React, { useEffect, useState } from "react";
import "./style.css";
import { useAuth } from "@/app/components/AuthProvider";
import useJobs, { CountsType } from "@/app/hooks/useJobs";
import JobDetailsModal from "@/app/components/JobDetailsModal";
import { Job } from "@/app/types/job";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useApplicationsRefetch } from "@/app/contexts/ApplicationContext";

const STATUS_COLOR_MAP = {
  wishlist: "bg-fuchsia-300",
  applied: "bg-blue-300",
  interviewing: "bg-amber-300",
  rejected: "bg-red-300",
  offer: "bg-green-300",
};

const JOB_FILTERS = [
  "all",
  "active",
  "applied",
  "wishlisted",
  "interviewing",
  "offered",
  "rejected",
];

type ApplicationTableProps = {
  userId: string;
  activeFilter: (typeof JOB_FILTERS)[number];
  jobs: Job[];
  isLoading: boolean;
  error?: Error;
  refetch: () => void;
};

const ApplicationTable = ({
  userId,
  activeFilter,
  jobs,
  isLoading,
  error,
  refetch
}: ApplicationTableProps) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  let jobList = jobs;

  switch (activeFilter) {
    case "active":
      jobList = jobList.filter(
        (job) => job.status === "applied" || job.status === "interviewing"
      );
      break;
    case "applied":
      jobList = jobList.filter((job) => job.status === "applied");
      break;
    case "wishlisted":
      jobList = jobList.filter((job) => job.status === "wishlist");
      break;
    case "interviewing":
      jobList = jobList.filter((job) => job.status === "interviewing");
      break;
    case "offered":
      jobList = jobList.filter((job) => job.status === "offer");
      break;
    case "rejected":
      jobList = jobList.filter((job) => job.status === "rejected");
      break;
  }

  useEffect(() => {
    toast.error(error?.message);
  }, [error]);


  return (
    <div className="grow w-full flex justify-center items-start overflow-x-auto mt-4">
      <table className="w-full p-5 table-auto border-collapse border border-gray-800/50">
        <thead>
          <tr>
            <th className="px-2 py-2 text-center border border-gray-100/80">
              #
            </th>
            <th className="px-2 py-2 text-center border border-gray-100/80">
              Title
            </th>
            <th className="px-2 py-2 text-center border border-gray-100/80">
              Company
            </th>
            <th className="px-2 py-2 text-center border border-gray-100/80">
              Location
            </th>
            <th className="px-2 py-2 text-center border border-gray-100/80">
              Type
            </th>
            <th className="px-2 py-2 text-center border border-gray-100/80">
              Status
            </th>
            <th className="px-2 py-2 text-center border border-gray-100/80">
              Apply Date
            </th>
            <th className="px-2 py-2 text-center border border-gray-100/80">
              Last Updated
            </th>
          </tr>
        </thead>
        <tbody>
          {!isLoading &&
            jobList.map((job, i) => (
              <tr
                key={job.id}
                onClick={() => setSelectedJob(job)}
              >
                <td
                  className={`px-2 py-2 text-center border cursor-pointer border-gray-100/80 ${
                    i % 2 === 0 ? "bg-gray-100/10" : ""
                  }`}
                >
                  {i + 1}
                </td>
                <td
                  className={`px-2 py-2 text-center border cursor-pointer border-gray-100/80 ${
                    i % 2 === 0 ? "bg-gray-100/10" : ""
                  }`}
                >
                  {job.title}
                </td>
                <td
                  className={`px-2 py-2 text-center border cursor-pointer border-gray-100/80 ${
                    i % 2 === 0 ? "bg-gray-100/10" : ""
                  }`}
                >
                  {job.company}
                </td>
                <td
                  className={`px-2 py-2 text-center border cursor-pointer border-gray-100/80 ${
                    i % 2 === 0 ? "bg-gray-100/10" : ""
                  } capitalize`}
                >
                  {job.location}
                </td>
                <td
                  className={`px-2 py-2 text-center border cursor-pointer border-gray-100/80 ${
                    i % 2 === 0 ? "bg-gray-100/10" : ""
                  } capitalize`}
                >
                  {job.jobType}
                </td>
                <td
                  className={`px-1 py-1 text-center border cursor-pointer border-gray-100/80 ${
                    i % 2 === 0 ? "bg-gray-100/10" : ""
                  }`}
                >
                  <div
                    className={`w-full h-full ${
                      STATUS_COLOR_MAP[job.status]
                    } text-gray-800 text-sm px-1 py-1 rounded-md capitalize`}
                  >
                    {job.status}
                  </div>
                </td>
                <td
                  className={`px-2 py-2 text-center border cursor-pointer border-gray-100/80 ${
                    i % 2 === 0 ? "bg-gray-100/10" : ""
                  }`}
                >
                  {job.createDate}
                </td>
                <td
                  className={`px-2 py-2 text-center border cursor-pointer border-gray-100/80 ${
                    i % 2 === 0 ? "bg-gray-100/10" : ""
                  }`}
                >
                  {job.lastUpdateDate}
                </td>
              </tr>
            ))}
          {isLoading && (
            <tr>
              <td
                colSpan={8}
                className="py-10 border border-gray-100/80 text-center text-xl"
              >
                <FontAwesomeIcon icon={faSpinner} size="2xl" spin /> Fetching
                Job List...
              </td>
            </tr>
          )}
          {!isLoading && jobList.length === 0 && (
            <tr>
              <td
                colSpan={8}
                className="py-10 border border-gray-100/80 text-center text-md text-gray-100/50"
              >
                You Don&apos;t have any applications. Try adding a new Entry.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <JobDetailsModal
        userId={userId}
        jobData={selectedJob}
        isVisible={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        refetchData={refetch}
      />
    </div>
  );
};

const JobsDashboardPage = () => {
  const [activeJobFilter, setActiveJobFilter] =
    useState<(typeof JOB_FILTERS)[number]>("active");
  const user = useAuth();
  const {refetchKey} = useApplicationsRefetch();
  const { jobs, counts, error, isLoading, refetch } = useJobs(user?.uid, refetchKey);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveJobFilter(e.currentTarget.value);
  };

  return (
    <main className="md:p-5">
      <div className="w-full flex justify-between items-center py-2 px-4 bg-amber-400">
        <div className="flex items-center gap-2">
          <label className="text-gray-800 text-lg">Filter:</label>
        <select
          name="status"
          value={activeJobFilter}
          onChange={handleFilterChange}
          className="w-max border bg-gray-100 border-gray-800 rounded-md text-gray-800 capitalize px-4 py-2 cursor-pointer"
        >
          {JOB_FILTERS.map((filter) => (
            <option key={filter} value={filter} className="capitalize">
              {filter}
            </option>
          ))}
        </select>
        </div>

        <div className="flex flex-col items-end">
        <p className="text-gray-800 text-sm">
          Total Active Applications: {counts?.active}
        </p>
        <p className="text-gray-900 text-xs">
          Total Applications: {counts?.total}
        </p>
        </div>
      </div>
      <ApplicationTable
        userId={user?.uid ?? ""}
        activeFilter={activeJobFilter}
        jobs={jobs}
        isLoading={isLoading}
        error={error}
        refetch={refetch}
      />
    </main>
  );
};

export default JobsDashboardPage;
