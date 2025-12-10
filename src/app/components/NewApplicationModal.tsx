"use client";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useApplicationsRefetch } from "../contexts/ApplicationContext";
import Modal from "./Modal";
import { logAnalyticsEvent } from "../lib/analytics";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAsterisk,
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

type NewApplicationModalProps = {
  showModal: boolean;
  userId: string;
  onClose: () => void;
};

const NewApplicationModal = ({
  showModal,
  userId,
  onClose,
}: NewApplicationModalProps) => {
  const [showNotesSecton, setShowNotesSection] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const entryModeRef = useRef<"applied" | "wishlist">("applied");
  const { triggerRefetch } = useApplicationsRefetch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const title = String(formData.get("job-title") ?? "");
    const link = String(formData.get("job-link") ?? "");
    const company = String(formData.get("company") ?? "");
    const location = String(formData.get("location") ?? "");
    const jobType = String(formData.get("job-type") ?? "");
    const responsibilities = String(formData.get("job-responsibilities") ?? "");
    const requirements = String(formData.get("job-requirements") ?? "");
    const notes = String(formData.get("job-notes") ?? "");
    const lastUpdateDate = serverTimestamp();
    const createDate = serverTimestamp();

    const payload = {
      title,
      link,
      company,
      location,
      jobType,
      responsibilities,
      requirements,
      notes,
      lastUpdateDate,
      createDate,
      status: entryModeRef.current,
    };

    try {
      const col = collection(db, "jobs");
      await addDoc(col, {
        userId,
        ...payload,
      });
      toast("New Job Added", { type: "success" });

      // Analytics
      logAnalyticsEvent("application_entry_created", {
        status: payload.status,
      });

      triggerRefetch();
      onClose();
    } catch (err) {
      console.error("Could not add Job", (err as Error).message);
      toast("Could not add Job", { type: "error" });
    }
  };

  const handleAppliedClick = () => {
    if (!formRef.current) {
      return;
    }
    entryModeRef.current = "applied";
    formRef.current.requestSubmit();
  };

  const handleWishlistClick = () => {
    if (!formRef.current) {
      return;
    }
    entryModeRef.current = "wishlist";
    formRef.current.requestSubmit();
  };

  useEffect(() => {
    if (showModal) {
      setShowNotesSection(false);
    }
  }, [showModal]);

  if (!showModal) {
    return <></>;
  }

  return (
    <Modal
      isVisible={showModal}
      title="New Application"
      onClose={onClose}
      modalClasses="md:w-2/3 h-full md:h-[97%] shadow-lg shadow-gray-900"
      bodyClasses="px-5 flex justify-center"
      theme="dark"
    >
      <div className="flex justify-center grow h-max py-5">
        <form
          className="w-full md:w-4/5 flex flex-col items-center gap-5"
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <div className="w-full">
            <div className="py-2">
              <label className="text-amber-500 uppercase font-semibold flex items-start gap-1">
                Job Title{" "}
                <FontAwesomeIcon
                  icon={faAsterisk}
                  size="xs"
                  className="text-rose-700"
                />
              </label>
            </div>
            <input
              type="text"
              name="job-title"
              placeholder="Type here..."
              className="w-full border bg-gray-300 placeholder:text-gray-500 px-4 py-2 text-gray-900 focus-visible:outline-none"
              required
            />
          </div>
          <div className="w-full grid grid-cols-2 gap-5">
            <div className="w-full">
              <div className="py-2">
                <label className="text-amber-500 uppercase font-semibold">
                  Job Link
                </label>
              </div>
              <input
                type="text"
                name="job-link"
                placeholder="Paste here..."
                className="w-full border bg-gray-300 placeholder:text-gray-500 px-4 py-2 text-gray-900 focus-visible:outline-none"
              />
            </div>
            <div className="w-full">
              <div className="py-2">
                <label className="text-amber-500 uppercase font-semibold flex items-start gap-1">
                  Company{" "}
                  <FontAwesomeIcon
                    icon={faAsterisk}
                    size="xs"
                    className="text-rose-700"
                  />
                </label>
              </div>
              <input
                type="text"
                name="company"
                placeholder="Type here..."
                className="w-full border bg-gray-300 placeholder:text-gray-500 px-4 py-2 text-gray-900 focus-visible:outline-none"
                required
              />
            </div>
          </div>
          <div className="w-full grid grid-cols-2 gap-5">
            <div className="w-full">
              <div className="py-2">
                <label className="text-amber-500 uppercase font-semibold">
                  Location
                </label>
              </div>
              <input
                type="text"
                name="location"
                placeholder="Type here..."
                className="w-full border bg-gray-300 placeholder:text-gray-500 px-4 py-2 text-gray-900 focus-visible:outline-none"
              />
            </div>
            <div className="w-full">
              <div className="py-2">
                <label className="text-amber-500 uppercase font-semibold">
                  Job Type
                </label>
              </div>
              <select
                name="job-type"
                className="capitalize w-full border bg-gray-200 px-4 py-[11px] text-gray-800"
                defaultValue="onsite"
              >
                <option value="onsite" className="bg-gray-100 text-gray-800">
                  onsite
                </option>
                <option value="hybrid" className="bg-gray-100 text-gray-800">
                  hybrid
                </option>
                <option value="remote" className="bg-gray-100 text-gray-800">
                  remote
                </option>
              </select>
            </div>
          </div>
          <div className="w-full">
            <div className="py-2">
              <label className="text-amber-500 uppercase font-semibold">
                Responsibilities
              </label>
            </div>
            <textarea
              name="job-responsibilities"
              placeholder="Paste here..."
              className="w-full border bg-gray-300 placeholder:text-gray-500 px-4 py-2 text-gray-900 focus-visible:outline-none resize-none h-80 overflow-y-auto"
            />
          </div>
          <div className="w-full">
            <div className="py-2">
              <label className="text-amber-500 uppercase font-semibold">
                Requirements
              </label>
            </div>
            <textarea
              name="job-requirements"
              placeholder="Paste here..."
              className="w-full border bg-gray-300 placeholder:text-gray-500 px-4 py-2 text-gray-900 focus-visible:outline-none resize-none h-80 overflow-y-auto"
            />
          </div>
          <div className="pb-5 w-full">
            <div
              className="flex gap-2 items-center py-2 cursor-pointer"
              onClick={() => setShowNotesSection((prev) => !prev)}
            >
              <FontAwesomeIcon
                icon={showNotesSecton ? faChevronDown : faChevronRight}
              />
              <label className="text-amber-500 uppercase font-semibold">
                Notes
              </label>
            </div>
            <div
              className={`overflow-hidden transition-[max-height,opacity] duration-200 ease-in-out ${
                showNotesSecton ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <textarea
                name="job-notes"
                placeholder="Paste here..."
                className={`w-full h-80 border bg-gray-300 placeholder:text-gray-500 px-4 py-2 text-gray-900 focus-visible:outline-none resize-none overflow-y-auto`}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 w-full">
            <button
              type="button"
              className="cursor-pointer bg-amber-400 text-gray-800 hover:bg-amber-500 px-8 py-5 md:py-3 rounded-md w-full"
              onClick={handleWishlistClick}
            >
              Wishlist
            </button>
            <button
              type="button"
              className="cursor-pointer bg-amber-400 text-gray-800 hover:bg-amber-500 px-8 py-5 md:py-3 rounded-md w-full"
              onClick={handleAppliedClick}
            >
              Applied
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default NewApplicationModal;
