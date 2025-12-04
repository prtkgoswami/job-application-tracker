"use client";
import React, { useEffect, useState } from "react";
import "./style.css";
import { useAuth } from "@/app/components/AuthProvider";
import useJobs from "@/app/hooks/useJobs";
import JobDetailsModal from "@/app/components/JobDetailsModal";
import { Job } from "@/app/types/job";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const STATUS_COLOR_MAP = {
  applied: "bg-blue-300",
  interviewing: "bg-amber-300",
  rejected: "bg-red-300",
  offer: "bg-green-300",
};

type JobTitleProps = {
  userId: string;
  showRejected: boolean;
}

const ApplicationTable = ({ userId, showRejected }: JobTitleProps) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const { jobs, error, isLoading, refetch } = useJobs(userId);

  let jobList = jobs;

  if (!showRejected) {
    jobList = jobList.filter(job => job.status !== "rejected")
  }

  useEffect(() => {
    toast.error(error?.message)
  }, [error])

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
                className={`cursor-pointer}`}
                onClick={() => setSelectedJob(job)}
              >
                <td
                  className={`px-2 py-2 text-center border border-gray-100/80 ${i%2===0 ? "bg-gray-100/10" : ""}`}
                >
                  {i + 1}
                </td>
                <td
                  className={`px-2 py-2 text-center border border-gray-100/80 ${i%2===0 ? "bg-gray-100/10" : ""}`}
                >
                  {job.title}
                </td>
                <td
                  className={`px-2 py-2 text-center border border-gray-100/80 ${i%2===0 ? "bg-gray-100/10" : ""}`}
                >
                  {job.company}
                </td>
                <td
                  className={`px-2 py-2 text-center border border-gray-100/80 ${i%2===0 ? "bg-gray-100/10" : ""} capitalize`}
                >
                  {job.location}
                </td>
                <td
                  className={`px-2 py-2 text-center border border-gray-100/80 ${i%2===0 ? "bg-gray-100/10" : ""} capitalize`}
                >
                  {job.jobType}
                </td>
                <td
                  className={`px-1 py-1 text-center border border-gray-100/80 ${i%2===0 ? "bg-gray-100/10" : ""}`}
                >
                  <div className={`w-full h-full ${STATUS_COLOR_MAP[job.status]} text-gray-800 text-sm px-1 py-1 rounded-md capitalize`}>{job.status}</div>
                </td>
                <td
                  className={`px-2 py-2 text-center border border-gray-100/80 ${i%2===0 ? "bg-gray-100/10" : ""}`}
                >
                  {job.createDate}
                </td>
                <td
                  className={`px-2 py-2 text-center border border-gray-100/80 ${i%2===0 ? "bg-gray-100/10" : ""}`}
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
  const [showRejected, setShowRejected] = useState(false);
  const user = useAuth();

  return (
    <main className="md:p-5">
      <div className="w-full py-2 px-4 bg-amber-400">
        <button
          className="cursor-pointer text-gray-800 px-4 py-2 border border-gray-800 hover:bg-amber-500 transition-colors duration-200 ease-in-out rounded-lg"
          onClick={() => setShowRejected(prev => !prev)}
        >
          <FontAwesomeIcon icon={showRejected ? faEye : faEyeSlash} size="sm" className="mr-1" />{showRejected ? "Hide Rejected" : "Show Rejected"}
        </button>
      </div>
      <ApplicationTable userId={user?.uid ?? ""} showRejected={showRejected} />
    </main>
  );
};

export default JobsDashboardPage;
