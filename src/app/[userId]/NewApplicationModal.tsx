"use client";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  increment,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "@lib/firebase";
import { useApplicationsRefetch } from "@contexts/ApplicationContext";
import Modal from "@components/Modal";
import { logAnalyticsEvent } from "@lib/analytics";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronRight,
  faCloudUploadAlt,
} from "@fortawesome/free-solid-svg-icons";
import ConfirmDialog from "@/components/ConfirmDialog";
import Link from "next/link";
import JsonImportModal from "./JsonImportModal";
import { JobType } from "@/types/job";
import { getWeekNumber } from "@/lib/date";

type NewApplicationModalProps = {
  showModal: boolean;
  userId: string;
  onClose: () => void;
};

export type FormDataType = {
  "job-title": string;
  "job-link": string;
  company: string;
  location: string;
  "job-type": JobType;
  "job-responsibilities": string;
  "job-requirements": string;
  "job-notes": string;
};

const EMPTY_DATA: FormDataType = {
  "job-title": "",
  "job-link": "",
  company: "",
  location: "",
  "job-type": "onsite",
  "job-responsibilities": "",
  "job-requirements": "",
  "job-notes": "",
};

const NewApplicationModal = ({
  showModal,
  userId,
  onClose,
}: NewApplicationModalProps) => {
  const [showJsonImport, setShowJsonImport] = useState(false);
  const [showNotesSection, setShowNotesSection] = useState(false);
  const [showCloseWarning, setShowCloseWarning] = useState(false);
  const [formData, setFormData] = useState<FormDataType>(EMPTY_DATA);
  const formRef = useRef<HTMLFormElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const entryModeRef = useRef<"applied" | "wishlist">("applied");
  const { triggerRefetch } = useApplicationsRefetch();

  const isFormFilled = () => {
    if (!formRef.current) return false;
    const formData = new FormData(formRef.current);

    let filled = false;
    formData.entries().forEach(([key, val]) => {
      if (key !== "job-type") {
        filled = filled || !!val;
      }
    });
    return filled;
  };

  const handleClose = () => {
    if (isFormFilled()) {
      setShowCloseWarning(true);
    } else {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const title = String(formData["job-title"] ?? "");
    const link = String(formData["job-link"] ?? "");
    const company = String(formData["company"] ?? "");
    const location = String(formData["location"] ?? "");
    const jobType = String(formData["job-type"] ?? "onsite");
    const responsibilities = String(formData["job-responsibilities"] ?? "");
    const requirements = String(formData["job-requirements"] ?? "");
    const notes = String(formData["job-notes"] ?? "");
    const lastUpdateDate = serverTimestamp();
    const createDate = serverTimestamp();
    const now = new Date();
    const dateKey = now.toISOString().split('T')[0]; // e.g., "2026-05-08"
    const weekKey = `W-${getWeekNumber(now)}`;       // e.g., "W-19"

    try {
      const batch = writeBatch(db);

      const jobsCol = collection(db, "jobs");
      const newJobRef = doc(jobsCol);
      const analyticsRef = doc(db, "users", userId, "metadata", "analytics");

      const newJobPayload = {
        userId,
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
      let analyticsPayload;
      
      if (entryModeRef.current === "applied") {
        analyticsPayload = {
          "applicationCounts.applied": increment(1),
          "companies.allApplied": arrayUnion(company),
          "companies.activeList": arrayUnion(company),
          [`weeklyActivity.${weekKey}.${dateKey}`]: increment(1),
          lastUpdated: serverTimestamp(),
        };
      } else {
        analyticsPayload = {
          "applicationCounts.wishlist": increment(1),
          "companies.allApplied": arrayUnion(company),
          "companies.activeList": arrayUnion(company),
          [`weeklyActivity.${weekKey}.${dateKey}`]: increment(1),
          lastUpdated: serverTimestamp(),
        };
      }

      batch.set(newJobRef, newJobPayload);
      batch.update(analyticsRef, analyticsPayload);
      await batch.commit();

      toast("New Job Added", { type: "success" });

      // Analytics
      logAnalyticsEvent("application_entry_created", {
        status: newJobPayload.status,
      });

      triggerRefetch();
      setFormData(EMPTY_DATA);
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

  useEffect(() => {
    if (showNotesSection) {
      notesRef.current?.focus();
    }
  }, [showNotesSection]);

  if (!showModal) {
    return <></>;
  }

  return (
    <Modal
      isVisible={showModal}
      onClose={handleClose}
      theme="dark"
      title="New Application"
      modalClasses="w-full md:w-2/3 lg:w-2/3 h-[95%] md:h-auto md:max-h-[90%] pb-4 shadow-xl shadow-zinc-900 border border-zinc-700 mx-2"
      bodyClasses="px-5 py-4 relative flex flex-col gap-6 overflow-y-auto"
      hasBackdropPadding={true}
    >
      {/* Import Section */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm">
          <p className="text-zinc-300 font-medium">Have a JSON snippet?</p>
          <p className="text-zinc-400 text-xs leading-relaxed mt-1">
            Import from{" "}
            <Link
              href="https://github.com/prtkgoswami/job-parse"
              target="_blank"
              className="text-amber-500 hover:text-amber-400 hover:underline"
            >
              JobParse
            </Link>{" "}
            to autofill.
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-900 text-zinc-200 px-4 py-2 rounded-md transition-colors text-sm font-medium border border-amber-500 cursor-pointer"
          onClick={() => setShowJsonImport(true)}
        >
          <FontAwesomeIcon icon={faCloudUploadAlt} />
          Import JSON
        </button>
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
      >
        {/* Core Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-zinc-400 text-sm font-medium">
              Job Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="job-title"
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg transition-all"
              required
              value={formData["job-title"]}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  "job-title": e.target.value,
                }))
              }
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-zinc-400 text-sm font-medium">
              Company <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="company"
              placeholder="e.g. Acme Corp"
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg transition-all"
              required
              value={formData["company"]}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, company: e.target.value }))
              }
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-400 text-sm font-medium">
              Location
            </label>
            <input
              type="text"
              name="location"
              placeholder="e.g. New York, NY"
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg transition-all"
              value={formData["location"]}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-400 text-sm font-medium">
              Job Type
            </label>
            <div className="relative">
              <select
                name="job-type"
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg transition-all appearance-none capitalize"
                value={formData["job-type"]}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    "job-type": e.target.value as JobType,
                  }))
                }
              >
                <option value="onsite">On-site</option>
                <option value="hybrid">Hybrid</option>
                <option value="remote">Remote</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-zinc-400 text-sm font-medium">
              Job Link
            </label>
            <input
              type="text"
              name="job-link"
              placeholder="https://..."
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg transition-all"
              value={formData["job-link"]}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, "job-link": e.target.value }))
              }
            />
          </div>
        </div>

        {/* Details Textareas */}
        <div className="grid grid-cols-1 gap-5 h-128">
          <div className="flex flex-col gap-1.5 h-full">
            <label className="text-zinc-400 text-sm font-medium">
              Responsibilities
            </label>
            <textarea
              name="job-responsibilities"
              placeholder="Key responsibilities..."
              className="w-full flex-1 px-4 py-3 bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg transition-all resize-none"
              value={formData["job-responsibilities"]}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  "job-responsibilities": e.target.value,
                }))
              }
            />
          </div>
          <div className="flex flex-col gap-1.5 h-full">
            <label className="text-zinc-400 text-sm font-medium">
              Requirements
            </label>
            <textarea
              name="job-requirements"
              placeholder="Key requirements..."
              className="w-full flex-1 px-4 py-3 bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg transition-all resize-none"
              value={formData["job-requirements"]}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  "job-requirements": e.target.value,
                }))
              }
            />
          </div>
        </div>

        {/* Notes Toggle */}
        <div className="border border-zinc-800 rounded-lg overflow-hidden">
          <button
            type="button"
            className="w-full flex items-center justify-between p-4 bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors text-left cursor-pointer"
            onClick={() => setShowNotesSection((prev) => !prev)}
          >
            <span className="text-zinc-300 font-medium text-sm flex items-center gap-2">
              Your Notes
              {formData["job-notes"] && (
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              )}
            </span>
            <FontAwesomeIcon
              icon={showNotesSection ? faChevronDown : faChevronRight}
              className="text-zinc-500"
            />
          </button>
          <div
            className={`transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden ${
              showNotesSection ? "max-h-84 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <textarea
              ref={notesRef}
              name="job-notes"
              placeholder="Add personal notes, salary range, referrals..."
              className="w-full h-64 px-4 py-3 bg-zinc-900 text-zinc-300 placeholder-zinc-600 focus:outline-none resize-none border-t border-zinc-800"
              value={formData["job-notes"]}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  "job-notes": e.target.value,
                }))
              }
            />
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4 mt-2">
          <button
            type="button"
            className="cursor-pointer py-3.5 rounded-lg font-bold border border-zinc-300 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all"
            onClick={handleWishlistClick}
          >
            Save to Wishlist
          </button>
          <button
            type="button"
            className="cursor-pointer py-3.5 rounded-lg font-bold bg-amber-500 text-zinc-900 hover:bg-amber-400 shadow-lg shadow-amber-900/20 active:scale-[0.99] transition-all"
            onClick={handleAppliedClick}
          >
            Mark as Applied
          </button>
        </div>
      </form>

      <ConfirmDialog
        isVisible={showCloseWarning}
        onClose={() => setShowCloseWarning(false)}
        onConfirm={() => {
          setShowCloseWarning(false);
          setFormData(EMPTY_DATA);
          onClose();
        }}
        message="Discard unsaved changes?"
        description="You have entered data that will be lost."
      />

      <JsonImportModal
        isVisible={showJsonImport}
        onClose={() => setShowJsonImport(false)}
        setJson={setFormData}
      />
    </Modal>
  );
};

export default NewApplicationModal;
