import { Job } from "@/types/job";
import { ActiveFilters } from "./OptionsModal";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import JobDetailsModal from "./JobDetailsModal";

const STATUS_COLOR_MAP = {
  wishlist:
    "bg-fuchsia-300 hover:bg-fuchsia-400 text-fuchsia-700 border-fuchsia-600",
  applied: "bg-blue-300 hover:bg-blue-400 text-blue-700 border-blue-600",
  interviewing:
    "bg-amber-300 hover:bg-amber-400 text-amber-700 border-amber-600",
  rejected: "bg-red-300 hover:bg-red-400 text-red-700 border-red-600",
  offered: "bg-green-300 hover:bg-green-400 text-green-700 border-green-600",
};

type ApplicationTableProps = {
  userId: string;
  activeFilters: ActiveFilters;
  archivedApplicationIDs: Set<string>;
  jobs: Job[];
  isLoading: boolean;
  error?: Error;
  onStatusClick: (id: string) => void;
  refetch: () => void;
};

const ApplicationTable = ({
  userId,
  activeFilters,
  archivedApplicationIDs,
  jobs,
  isLoading,
  error,
  onStatusClick,
  refetch,
}: ApplicationTableProps) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  let jobList = jobs;

  switch (activeFilters.status) {
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
      jobList = jobList.filter((job) => job.status === "offered");
      break;
    case "rejected":
      jobList = jobList.filter((job) => job.status === "rejected");
      break;
  }

  if (activeFilters.jobType) {
    jobList = jobList.filter(
      (job) => job.jobType.toLowerCase() === activeFilters.jobType
    );
  }

  if (activeFilters.company) {
    jobList = jobList.filter((job) => job.company === activeFilters.company);
  }

  if (activeFilters.location) {
    jobList = jobList.filter((job) => job.location === activeFilters.location);
  }

  if (!activeFilters.showArchived) {
    jobList = jobList.filter((job) => !archivedApplicationIDs.has(job.id));
  }

  const handleStatusClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onStatusClick(id)
  }

  useEffect(() => {
    toast.error(error?.message);
  }, [error]);

  return (
    <div className="grow w-full flex md:justify-center items-start overflow-x-auto mt-4 px-4 pb-8 md:pb-0 md:px-0">
      <table className="w-full p-5 table-auto border-collapse border border-gray-800/50">
        <thead>
          <tr>
            <th className="px-2 py-2 text-center font-semibold border border-gray-100/80">
              #
            </th>
            <th className="px-2 py-2 text-center font-semibold border border-gray-100/80">
              Title
            </th>
            <th className="px-2 py-2 text-center font-semibold border border-gray-100/80">
              Company
            </th>
            <th className="px-2 py-2 text-center font-semibold border border-gray-100/80">
              Location
            </th>
            <th className="px-2 py-2 text-center font-semibold border border-gray-100/80">
              Type
            </th>
            <th className="px-2 py-2 text-center font-semibold border border-gray-100/80">
              Status
            </th>
            <th className="px-2 py-2 text-center font-semibold border border-gray-100/80">
              Apply Date
            </th>
            <th className="px-2 py-2 text-center font-semibold border border-gray-100/80">
              Last Updated
            </th>
          </tr>
        </thead>
        <tbody className="text-sm leading-relaxed md:text-base">
          {!isLoading &&
            jobList.map((job, i) => (
              <tr key={job.id} onClick={() => setSelectedJob(job)}>
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
                  {job.location || <span className="text-gray-400">--</span>}
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
                  <button
                    type="button"
                    className={`w-full h-full border ${
                      STATUS_COLOR_MAP[job.status]
                    } text-sm px-4 py-1 rounded-md capitalize cursor-pointer`}
                    onClick={(e) => handleStatusClick(e, job.id)}
                  >
                    {job.status}
                  </button>
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

export default ApplicationTable;