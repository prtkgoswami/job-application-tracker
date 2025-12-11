"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@app/AuthProvider";
import useJobs from "@hooks/useJobs";
import { useApplicationsRefetch } from "@contexts/ApplicationContext";
import OptionsModal, { ActiveFilters } from "./OptionsModal";
import useUser from "@hooks/useUser";
import QuickStatusChangeModal from "./QuickStatusChangeModal";
import ApplicationTable from "./ApplicationTable";
import "./style.css";
import { useSearchParams } from "next/navigation";

const JobsDashboardPage = () => {
  const [activeJobFilters, setActiveJobFilters] = useState<ActiveFilters>({
    status: "active",
    company: "",
    location: "",
    jobType: "",
    showArchived: false,
  });
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [statusQuickChangeId, setStatusQuickChangeId] = useState("");
  const user = useAuth();
  const { refetchKey } = useApplicationsRefetch();
  const searchParams = useSearchParams();
  const defaultStatus = searchParams.get("status");
  const {
    jobs,
    counts,
    companyList,
    locationList,
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
      console.log("Setting status", defaultStatus)
      setActiveJobFilters((prev) => ({ ...prev, status: defaultStatus }));
    }
  }, [defaultStatus]);

  return (
    <main className="md:p-5">
      <div className="w-full flex justify-between items-center py-2 px-4 bg-amber-500">
        <button
          className="px-5 py-2 rounded-md cursor-pointer border border-gray-800 text-gray-800 hover:bg-amber-400 transition-colors duration-200 ease-in-out"
          onClick={() => setShowOptionsModal(true)}
        >
          View Options
        </button>

        <div className="hidden md:flex flex-col items-end">
          <p className="text-gray-800 text-sm">
            Active Applications: {counts?.active}
          </p>
          <p className="text-gray-900 text-xs">
            Total Applications: {counts?.total}
          </p>
        </div>
      </div>

      <ApplicationTable
        userId={user?.uid ?? ""}
        activeFilters={activeJobFilters}
        archivedApplicationIDs={new Set(archivedApplicationIDs)}
        jobs={jobs}
        isLoading={isLoadingJobs && isLoadingProfile}
        error={jobsError ?? profileError}
        refetch={refetch}
        onStatusClick={handleStatusClick}
      />

      <OptionsModal
        isVisible={showOptionsModal}
        activeFilters={activeJobFilters}
        companyList={companyList}
        locationList={locationList}
        archivedCount={archivedApplicationIDs.length}
        setActiveFilters={setActiveJobFilters}
        onClose={() => setShowOptionsModal(false)}
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
