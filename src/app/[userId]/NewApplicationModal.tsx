"use client";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@lib/firebase";
import { useApplicationsRefetch } from "@contexts/ApplicationContext";
import Modal from "@components/Modal";
import { logAnalyticsEvent } from "@lib/analytics";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAsterisk,
  faChevronDown,
  faChevronRight,
  faFloppyDisk,
  faHeart,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Tooltip from "@/components/Tooltip";
import ConfirmDialog from "@/components/ConfirmDialog";
import Link from "next/link";
import JsonImportModal from "./JsonImportModal";
import { JobType } from "@/types/job";

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

  const header = (
    <div className="w-full flex justify-between items-center p-5 pb-3">
      <h3 className={`text-2xl text-gray-100`}>
        New <span className="hidden md:inline-block">Application</span>
      </h3>
      <div className="flex gap-3">
        <Tooltip content="Apply" position="bottom">
          <button
            className={`w-10 h-10 cursor-pointer flex justify-center items-center rounded-full text-gray-800 bg-amber-400 hover:bg-amber-500`}
            onClick={handleAppliedClick}
          >
            <FontAwesomeIcon icon={faFloppyDisk} size="lg" />
          </button>
        </Tooltip>
        <Tooltip content="Wishlist" position="bottom">
          <button
            className={`w-10 h-10 cursor-pointer flex justify-center items-center rounded-full text-gray-800 bg-amber-400 hover:bg-amber-500`}
            onClick={handleWishlistClick}
          >
            <FontAwesomeIcon icon={faHeart} size="lg" />
          </button>
        </Tooltip>
        <Tooltip content="Close" position="bottom">
          <button
            className={`w-10 h-10 cursor-pointer flex justify-center items-center rounded-full text-gray-800 bg-amber-400 hover:bg-amber-500`}
            onClick={handleClose}
          >
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </button>
        </Tooltip>
      </div>
    </div>
  );

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
      modalClasses="md:w-2/3 h-full md:h-[97%] shadow-lg shadow-gray-900 border-2 border-slate-700"
      bodyClasses="px-5 flex flex-col items-center"
      theme="dark"
      header={header}
    >
      <div className="flex w-full md:w-4/5 flex-col gap-4 md:gap-2 my-4 border border-gray-200/60 rounded-lg p-3">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
          <p className="text-base md:text-lg text-amber-400 font-semibold">
            Import Fields from JSON
          </p>
          <button
            type="button"
            className="cursor-pointer bg-amber-400 text-gray-800 hover:bg-amber-500 px-10 py-4 md:py-2 rounded-md w-max"
            onClick={() => setShowJsonImport(true)}
          >
            Import JSON
          </button>
        </div>
        <p className="text-center md:text-left text-sm md:text-base">
          Easy import from a JSON object like one from{" "}
          <Link
            href="https://github.com/prtkgoswami/job-parse"
            target="_blank"
            className="pb-0.5 border-b border-amber-400 text-amber-400 hover:text-amber-500"
          >
            JobParse
          </Link>
        </p>
      </div>

      <div className="flex w-full justify-center grow h-max pt-2 pb-5">
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
              value={formData["job-title"]}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  "job-title": e.target.value,
                }))
              }
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
                value={formData["job-link"]}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    "job-link": e.target.value,
                  }))
                }
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
                value={formData["company"]}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, company: e.target.value }))
                }
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
                value={formData["location"]}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
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
                value={formData["job-type"]}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    "job-type": e.target.value as JobType,
                  }))
                }
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
              value={formData["job-responsibilities"]}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  "job-responsibilities": e.target.value,
                }))
              }
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
              value={formData["job-requirements"]}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  "job-requirements": e.target.value,
                }))
              }
            />
          </div>
          <div className="pb-5 w-full">
            <div
              className="flex gap-2 items-center py-2 cursor-pointer"
              onClick={() => setShowNotesSection((prev) => !prev)}
            >
              <FontAwesomeIcon
                icon={showNotesSection ? faChevronDown : faChevronRight}
              />
              <label className="text-amber-500 uppercase font-semibold">
                Notes
              </label>
            </div>
            <div
              className={`overflow-hidden transition-[max-height,opacity] duration-200 ease-in-out ${
                showNotesSection ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <textarea
                ref={notesRef}
                name="job-notes"
                placeholder="Paste here..."
                className={`w-full h-80 border bg-gray-300 placeholder:text-gray-500 px-4 py-2 text-gray-900 focus-visible:outline-none resize-none overflow-y-auto`}
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

      <ConfirmDialog
        isVisible={showCloseWarning}
        onClose={() => setShowCloseWarning(false)}
        onConfirm={() => {
          setShowCloseWarning(false);
          setFormData(EMPTY_DATA);
          onClose();
        }}
        message="Are you sure you want to Close this Application?"
        description="Looks like you have some unsaved data"
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
