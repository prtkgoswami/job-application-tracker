"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import useJobs from "@hooks/useJobs";
import { useApplicationsRefetch } from "@contexts/ApplicationContext";
import useUser from "@hooks/useUser";
import QuickStatusChangeModal from "./QuickStatusChangeModal";
import ApplicationTable from "./ApplicationTable";
import { useSearchParams } from "next/navigation";
import Switch from "@/components/Switch";

const JobsDashboardPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusQuickChangeId, setStatusQuickChangeId] = useState("");
  const [showAllJobs, setShowAllJobs] = useState<boolean>(false);

  const user = useAuth();
  const { refetchKey } = useApplicationsRefetch();
  const searchParams = useSearchParams();
  const defaultStatus = searchParams.get("status");

  const {
    jobs,
    counts,
    isLoading: isLoadingJobs,
    error: jobsError,
    refetch,
  } = useJobs(user?.uid, refetchKey);

  const {
    data: profile,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useUser();

  const archivedApplicationIDs = profile
    ? jobs
        .filter((job) => {
          const jobUpdateDate = new Date(job.lastUpdateDate);
          const archiveDate = new Date(profile?.archiveDate);
          return jobUpdateDate < archiveDate;
        })
        .map((job) => job.id)
    : [];

  const handleStatusClick = (id: string) => {
    setStatusQuickChangeId(id);
  };

  useEffect(() => {
    if (defaultStatus) {
      setSearchQuery(defaultStatus);
    }
  }, [defaultStatus]);

  return (
    <main className="md:p-5 h-full flex flex-col">
      <div className="w-full flex justify-between items-center px-2 md:px-0 py-2 mb-4 gap-6">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-max">
          <input
            type="text"
            name="query"
            placeholder="Search using Title, Company, Location, Type, Status"
            className="w-full md:w-150 px-3 py-2 border-b border-accent-1 focus-within:outline-none focus-within:border-accent-3 text-sm md:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Switch
            checked={showAllJobs}
            onChange={setShowAllJobs}
            labelRight="Show All Jobs"
          />
        </div>

        <div className="hidden md:flex flex-col items-end">
          <p className="text-accent-1 text-sm">
            Active Applications: {counts?.active}
          </p>
          <p className="text-accent-1 text-xs">
            Total Applications: {counts?.total}
          </p>
        </div>
      </div>

      <ApplicationTable
        userId={user?.uid ?? ""}
        searchQuery={searchQuery}
        showAllJobs={showAllJobs}
        archivedApplicationIDs={new Set(archivedApplicationIDs)}
        jobs={jobs}
        isLoading={isLoadingJobs && isLoadingProfile}
        error={jobsError ?? profileError}
        onStatusClick={handleStatusClick}
      />

      <QuickStatusChangeModal
        activeApplicationId={statusQuickChangeId}
        activeApplication={
          jobs.filter(({ id }) => id === statusQuickChangeId)[0]
        }
        refetch={refetch}
        onClose={() => setStatusQuickChangeId("")}
      />
    </main>
  );
};

export default JobsDashboardPage;
