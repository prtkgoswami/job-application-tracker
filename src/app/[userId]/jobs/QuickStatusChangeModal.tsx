import Modal from "@components/Modal";
import { db } from "@lib/firebase";
import { Job, JobStatus } from "@/types/job";
import {
  doc,
  increment,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { logAnalyticsEvent } from "@/lib/analytics";
import { useAuth } from "@/contexts/AuthProvider";

type Props = {
  activeApplicationId: string;
  activeApplication: Job;
  onClose: () => void;
  refetch: () => void;
};

const STATUS_LIST = [
  "applied",
  "interviewing",
  "rejected",
  "offered",
  "cancelled",
];

const QuickStatusChangeModal = ({
  activeApplicationId,
  activeApplication,
  onClose,
  refetch,
}: Props) => {
  const [activeStatus, setActiveStatus] = useState("");
  const user = useAuth();

  const handleSubmitClick = async () => {
    if (!activeApplicationId || !user) return;

    const oldStatus = activeApplication.status;
    const newStatus = activeStatus as JobStatus;

    try {
      const jobDocRef = doc(db, "jobs", activeApplicationId);
      const analyticsRef = doc(db, "users", user.uid, "metadata", "analytics");

      await runTransaction(db, async (transaction) => {
        const analyticsDoc = await transaction.get(analyticsRef);
        if (!analyticsDoc.exists()) {
          throw new Error("Analytics document does not exist!");
        }

        const currentCounts = analyticsDoc.data().applicationCounts || {};

        const currentOldCount = currentCounts[oldStatus] || 0;
        const currentNewCount = currentCounts[newStatus] || 0;

        const updatedOldCount = Math.max(0, currentOldCount - 1);
        const updatedNewCount = currentNewCount + 1;

        transaction.update(jobDocRef, {
          status: newStatus,
          lastUpdateDate: serverTimestamp(),
        });

        transaction.update(analyticsRef, {
          [`applicationCounts.${oldStatus}`]: updatedOldCount,
          [`applicationCounts.${newStatus}`]: updatedNewCount,
          lastUpdated: serverTimestamp(),
        });
      });

      toast.success("Application Status Changed");

      logAnalyticsEvent("application_quick_status_change", {
        job_id: activeApplicationId,
        old_status: activeApplication.status,
        new_status: activeStatus,
      });

      onClose();
      refetch();
    } catch (err) {
      console.error("Job Status Change Failed", err);
      toast.error("Failed to Update Application Status");
    }
  };

  useEffect(() => {
    if (activeApplicationId && activeApplication) {
      setActiveStatus(activeApplication.status);
      logAnalyticsEvent("application_quick_status_change_show", {
        job_id: activeApplicationId,
      });
    }
  }, [activeApplicationId, activeApplication]);

  if (!activeApplication) return <></>;

  return (
    <Modal
      isVisible={!!activeApplicationId}
      onClose={onClose}
      theme="dark"
      title="Change Status"
      modalClasses="w-full md:w-1/3 lg:w-1/4 pb-4 shadow-xl shadow-zinc-900 border border-zinc-700 mx-2"
      bodyClasses="px-6 py-6 relative flex flex-col gap-4"
      hasBackdropPadding={true}
    >
      <div className="flex flex-col gap-3">
        {STATUS_LIST.map((status) => (
          <button
            key={`status-change-button-${status}`}
            className={`w-full border-2 transition-all duration-200 ease-in-out px-5 py-3.5 text-base rounded-lg capitalize font-semibold cursor-pointer ${
              activeStatus === status
                ? "border-amber-500 bg-amber-500/10 text-amber-400 shadow-lg shadow-amber-900/20"
                : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600"
            }`}
            onClick={() => setActiveStatus(status)}
          >
            {status}
          </button>
        ))}
        <button
          className="text-base font-bold cursor-pointer disabled:cursor-not-allowed border border-amber-600 disabled:border-zinc-600 bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-600 hover:bg-amber-400 disabled:hover:bg-zinc-800 text-zinc-900 px-5 py-4 rounded-lg mt-4 transition-all active:scale-[0.99]"
          onClick={handleSubmitClick}
          disabled={activeApplication.status === activeStatus || !activeStatus}
        >
          Update Status
        </button>
      </div>
    </Modal>
  );
};

export default QuickStatusChangeModal;
