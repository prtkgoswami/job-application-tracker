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
  const [showNotesSection, setShowNotesSection] = useState(false);
  const [showCloseWarning, setShowCloseWarning] = useState(false);
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
      modalClasses="md:w-2/3 h-full md:h-[97%] shadow-lg shadow-gray-900"
      bodyClasses="px-5 flex justify-center"
      theme="dark"
      header={header}
    >
      <div className="flex justify-center grow h-max pt-2 pb-5">
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
          onClose();
        }}
        message="Are you sure you want to Close this Application?"
        description="Looks like you have some unsaved data"
      />
    </Modal>
  );
};

export default NewApplicationModal;
