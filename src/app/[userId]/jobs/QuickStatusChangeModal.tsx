import Modal from "@components/Modal";
import { db } from "@lib/firebase";
import { Job } from "@/types/job";
import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  activeApplicationId: string;
  activeApplication: Job;
  onClose: () => void;
  refetch: () => void;
};

const STATUS_LIST = ["applied", "interviewing", "rejected", "offered"];

const QuickStatusChangeModal = ({
  activeApplicationId,
  activeApplication,
  onClose,
  refetch
}: Props) => {
  const [activeStatus, setActiveStatus] = useState("");

  const handleSubmitClick = () => {
    if (!activeApplicationId) return;

    try {
      const docRef = doc(db, "jobs", activeApplicationId);
      updateDoc(docRef, {
        status: activeStatus,
      });

      toast.success("Application Status Changed");
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
    }
  }, [activeApplicationId, activeApplication]);

  if (!activeApplication)
    return <></>

  return (
    <Modal
      isVisible={!!activeApplicationId}
      onClose={onClose}
      title="Quick Change Status"
      modalClasses="md:w-1/4 h-max flex flex-col gap-5 items-center shadow-xl shadow-gray-900"
      bodyClasses="px-3 flex justify-center pb-8"
    >
      <div className="flex flex-col gap-3 justify-center w-2/3">
        {STATUS_LIST.map((status) => (
          <button
            key={`status-change-button-${status}`}
            className={`w-full border-2 border-amber-400 ${
              activeStatus === status
                ? "text-amber-400 bg-gray-800"
                : "text-gray-800 hover:bg-amber-100"
            } transition-colors duration-200 ease-in-out px-4 py-3 text-lg rounded-xl capitalize font-semibold cursor-pointer`}
            onClick={() => setActiveStatus(status)}
          >
            {status}
          </button>
        ))}
        <button
          className="text-xl cursor-pointer disabled:cursor-not-allowed bg-amber-400 disabled:bg-gray-200 hover:bg-amber-500 text-gray-800 px-4 py-4 rounded-xl mt-5"
          onClick={handleSubmitClick}
          disabled={activeApplication.status === activeStatus || !activeStatus}
        >
          Change Status
        </button>
      </div>
    </Modal>
  );
};

export default QuickStatusChangeModal;
