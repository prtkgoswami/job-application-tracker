"use client";
import React, { useEffect, useRef, useState } from "react";
import { Job } from "@/app/types/job";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAsterisk,
  faBuilding,
  faCopy,
  faFloppyDisk,
  faLink,
  faLocationDot,
  faPenToSquare,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { toast } from "react-toastify";
import Link from "next/link";
import Modal from "@/app/components/Modal";
import ConfirmDialog from "@/app/components/ConfirmDialog";
import ClickToCopyText from "@/app/components/ClickToCopyText";
import { logAnalyticsEvent } from "@/app/lib/analytics";
import { getDifferenceFromNow } from "@/app/lib/date";

type JobDetailsModalProps = {
  userId: string;
  jobData: Job | null;
  isVisible: boolean;
  onClose: () => void;
  refetchData: () => void;
};

const STATUS_COLOR_MAP = {
  wishlist: { bgColor: "bg-fuchsia-300", textColor: "text-fuchsia-600" },
  applied: { bgColor: "bg-blue-300", textColor: "text-blue-600" },
  interviewing: { bgColor: "bg-amber-300", textColor: "text-amber-600" },
  rejected: { bgColor: "bg-red-300", textColor: "text-red-600" },
  offer: { bgColor: "bg-green-300", textColor: "text-green-600" },
};

const INITIAL_DATA: Omit<Job, "id" | "createDate" | "lastUpdateDate"> = {
  title: "",
  link: "",
  location: "",
  company: "",
  jobType: "onsite",
  responsibilities: "",
  requirements: "",
  notes: "",
  status: "applied",
};

const JobDetailsModal = ({
  jobData,
  isVisible,
  refetchData,
  onClose,
}: JobDetailsModalProps) => {
  const [formData, setFormData] =
    useState<Omit<Job, "id" | "createDate" | "lastUpdateDate">>(INITIAL_DATA);
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (jobData) {
      setFormData(jobData);
    }
  }, [jobData]);

  if (jobData === null || !isVisible) {
    return <></>;
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (!name || !value) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const ref = doc(db, "jobs", jobData?.id);
      await updateDoc(ref, {
        ...formData,
        createDate: new Date(jobData.createDate),
        lastUpdateDate: serverTimestamp(),
      });
      toast.success("Successfully updated Application");

      // Analytics
      if (jobData.status !== formData.status) {
        logAnalyticsEvent("application_status_updated", {
          job_id: jobData.id,
          old_status: jobData.status,
          new_status: formData.status,
        });
      } else {
        logAnalyticsEvent("application_details_updated", {
          job_id: jobData.id,
          has_link_changed: jobData.link !== formData.link,
          has_title_changed: jobData.title !== formData.title,
          has_location_changed: jobData.location !== formData.location,
          has_company_changed: jobData.company !== formData.company,
          has_job_type_changed: jobData.jobType !== formData.jobType,
          has_responsibilities_changed:
            jobData.responsibilities !== formData.responsibilities,
          has_requirements_changed:
            jobData.requirements !== formData.requirements,
          has_notes_changed: jobData.notes !== formData.notes,
        });
      }

      setIsInEditMode(false);
      refetchData();
      onClose();
    } catch (err) {
      console.error("Application Update Error", err);
      toast.error("Could not updated Application");
    }
  };

  const handleDelete = async () => {
    try {
      const ref = doc(db, "jobs", jobData.id);
      await deleteDoc(ref);
      toast.success("Successfully deleted Application");

      // Analytics
      logAnalyticsEvent("application_entry_deleted", {
        old_status: jobData.status,
        time_in_previous_stage: Math.floor(
          getDifferenceFromNow(new Date(jobData.lastUpdateDate)) /
            (1000 * 3600 * 24)
        ),
        time_since_created: Math.floor(
          getDifferenceFromNow(new Date(jobData.createDate)) /
            (1000 * 3600 * 24)
        ),
      });

      refetchData();
      onClose();
    } catch (err) {
      console.error("Application Delete Error", err);
      toast.error("Could not delete Application");
    }
  };

  const handleAction = () => {
    setIsInEditMode((prev) => !prev);
  };

  const handleUpdate = () => {
    if (!formRef.current) return;

    formRef.current.requestSubmit();
  };

  const renderFooter = () => {
    return (
      <div className="flex justify-center items-center">
        <div className="hidden md:grid grid-cols-4 gap-8 w-4/5">
          <button
            type="button"
            className="cursor-pointer border-2 border-amber-600 text-gray-800 hover:bg-red-600/60 transition-colors duration-200 ease-in-out px-8 py-2 rounded-md"
            onClick={() => setShowConfirmDialog(true)}
          >
            Delete
          </button>
          {isInEditMode ? (
            <>
              <button
                type="button"
                className="col-start-3 cursor-pointer border-2 border-amber-600 text-gray-800 hover:bg-amber-500 transition-colors duration-200 ease-in-out px-8 py-2 rounded-md"
                onClick={handleAction}
              >
                Cancel
              </button>

              <button
                type="button"
                className="cursor-pointer border-2 border-amber-600 text-gray-800 hover:bg-amber-500 transition-colors duration-200 ease-in-out px-8 py-2 rounded-md"
                onClick={handleUpdate}
              >
                Update
              </button>
            </>
          ) : (
            <button
              type="button"
              className="col-start-4 cursor-pointer border-2 border-amber-600 text-gray-800 hover:bg-amber-500 transition-colors duration-200 ease-in-out px-8 py-2 rounded-md"
              onClick={handleAction}
            >
              Edit
            </button>
          )}
        </div>
        <div className="grid md:hidden grid-cols-4 gap-8 w-4/5">
          <button
            type="button"
            className="cursor-pointer border-2 border-amber-600 text-gray-800 aspect-square text-2xl rounded-md"
            style={{ height: "60px" }}
            onClick={handleDelete}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
          {isInEditMode ? (
            <>
              <button
                type="button"
                className="col-start-3 cursor-pointer border-2 border-amber-600 text-gray-800 aspect-square text-2xl rounded-md"
                style={{ height: "60px" }}
                onClick={handleAction}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>

              <button
                type="button"
                className="cursor-pointer border-2 border-amber-600 text-gray-800 aspect-square text-2xl rounded-md"
                style={{ height: "60px" }}
                onClick={handleUpdate}
              >
                <FontAwesomeIcon icon={faFloppyDisk} />
              </button>
            </>
          ) : (
            <button
              type="button"
              className="col-start-4 cursor-pointer border-2 border-amber-600 text-gray-800 aspect-square text-2xl rounded-md"
              style={{ height: "60px" }}
              onClick={handleAction}
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      modalClasses="md:w-2/3 h-full md:h-[96%]"
      bodyClasses="px-5 flex justify-center w-full"
      onClose={() => {
        setIsInEditMode(false);
        onClose();
      }}
      footer={renderFooter()}
    >
      <div className="h-full w-full flex flex-col ">
        <div
          className={`flex ${
            isInEditMode ? "justify-center" : "justify-start"
          } grow`}
        >
          {isInEditMode ? (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="w-full md:w-4/5 flex flex-col items-center gap-5"
            >
              <ClickToCopyText
                textToCopy={jobData.id}
                successToastMsg="ID Copied to Clipboard"
                failureToastMsg={`Could Not copy ID(${jobData.id}) to clipboard`}
              >
                <p className="text-right text-xs font-semibold text-amber-600 w-full select-none cursor-pointer">
                  JOB ID: {jobData.id}{" "}
                  <FontAwesomeIcon icon={faCopy} size="lg" />
                </p>
              </ClickToCopyText>

              <div className="w-full">
                <label className="text-amber-500 uppercase font-semibold flex items-start gap-1">
                  Job Title <FontAwesomeIcon icon={faAsterisk} size="xs" className="text-rose-500" />
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData?.title}
                  onChange={handleChange}
                  placeholder="Type here..."
                  className="w-full border border-gray-800 px-4 py-2 text-gray-800 focus-visible:outline-none"
                  required
                />
              </div>
              <div className="w-full">
                <label className="text-amber-500 uppercase font-semibold flex items-start gap-1">
                  Company <FontAwesomeIcon icon={faAsterisk} size="xs" className="text-rose-500" />
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData?.company}
                  onChange={handleChange}
                  placeholder="Paste here..."
                  className="w-full border border-gray-800 px-4 py-2 text-gray-800 focus-visible:outline-none"
                  required
                />
              </div>

              <div className="w-full grid md:grid-cols-2 gap-5">
                <div className="w-full">
                  <label className="text-amber-500 uppercase font-semibold">
                    Job Link
                  </label>
                  <input
                    type="text"
                    name="link"
                    value={formData?.link}
                    onChange={handleChange}
                    placeholder="Paste here..."
                    className="w-full border border-gray-800 px-4 py-2 text-gray-800 focus-visible:outline-none"
                  />
                </div>
                <div className="w-full">
                  <label className="text-amber-500 uppercase font-semibold">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData?.location}
                    onChange={handleChange}
                    placeholder="Paste here..."
                    className="w-full border border-gray-800 px-4 py-2 text-gray-800 focus-visible:outline-none"
                  />
                </div>
              </div>
              <div className="w-full grid md:grid-cols-2 gap-5">
                <div className="w-full">
                  <label className="text-amber-500 uppercase font-semibold">
                    Application Status
                  </label>
                  <select
                    name="status"
                    value={formData?.status}
                    onChange={handleChange}
                    className="w-full border border-gray-800 text-base text-gray-800 capitalize px-4 py-[11px]"
                  >
                    <option value="wishlist">wishlist</option>
                    <option value="applied">applied</option>
                    <option value="interviewing">interviewing</option>
                    <option value="rejected">rejected</option>
                    <option value="offer">offer</option>
                  </select>
                </div>
                <div className="w-full">
                  <label className="text-amber-500 uppercase font-semibold">
                    Job Type
                  </label>
                  <select
                    name="jobType"
                    value={formData?.jobType}
                    onChange={handleChange}
                    className="w-full border border-gray-800 text-base text-gray-800 capitalize px-4 py-[11px]"
                  >
                    <option value="onsite">onsite</option>
                    <option value="hybrid">hybrid</option>
                    <option value="remote">remote</option>
                  </select>
                </div>
              </div>
              <div className="w-full">
                <label className="text-amber-500 uppercase font-semibold">
                  Responsibilities
                </label>
                <textarea
                  name="responsibilities"
                  value={formData?.responsibilities}
                  onChange={handleChange}
                  placeholder="Paste here..."
                  className="w-full border border-gray-800 px-4 py-2 text-gray-800 focus-visible:outline-none resize-none h-80 overflow-y-auto"
                />
              </div>
              <div className="w-full">
                <label className="text-amber-500 uppercase font-semibold">
                  Requirements
                </label>
                <textarea
                  name="requirements"
                  value={formData?.requirements}
                  onChange={handleChange}
                  placeholder="Paste here..."
                  className="w-full border border-gray-800 px-4 py-2 text-gray-800 focus-visible:outline-none resize-none h-80 overflow-y-auto"
                />
              </div>
              <div className="grow pb-18 w-full">
                <label className="text-amber-500 uppercase font-semibold">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData?.notes}
                  onChange={handleChange}
                  placeholder="Paste here..."
                  className="w-full border border-gray-800 px-4 py-2 text-gray-800 focus-visible:outline-none resize-none h-80 overflow-y-auto"
                />
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-5 pb-5 text-gray-800 w-full">
              <section className="flex flex-col gap-2">
                <h2 className="text-2xl md:text-3xl">
                  {jobData.title}{" "}
                  {jobData.link && jobData.link !== "#" && (
                    <Link href={jobData.link} target="_blank">
                      <FontAwesomeIcon
                        icon={faLink}
                        className="text-blue-500 text-2xl"
                      />
                    </Link>
                  )}
                </h2>

                <div className="flex h-max gap-3 text-base md:text-lg capitalize">
                  <p>
                    <FontAwesomeIcon icon={faBuilding} className="mr-1" />
                    {jobData.company}
                  </p>
                  <div className="h-full border border-gray-300" />
                  <p>
                    <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
                    {jobData.location}
                  </p>
                  <div className="h-full border border-gray-300" />
                  <p>{jobData.jobType}</p>
                </div>

                <div
                  className={`${
                    STATUS_COLOR_MAP[jobData.status].bgColor
                  } py-2 px-4 flex justify-between items-center rounded-md`}
                >
                  <p
                    className={`text-sm md:text-base capitalize ${
                      STATUS_COLOR_MAP[jobData.status].textColor
                    }`}
                  >
                    Application Status:{" "}
                    <span className="font-semibold uppercase">
                      {jobData.status}
                    </span>
                  </p>
                  <p className="text-xs" style={{ textAlign: "right" }}>
                    Last Updated On: {jobData.lastUpdateDate}
                  </p>
                </div>
              </section>
              <section className="flex flex-col gap-2">
                <h4 className="text-amber-600 text-xl font-light uppercase border-b border-amber-700 p-2">
                  Responsibilities
                </h4>
                <p className="px-4 whitespace-pre-wrap text-sm md:text-base">
                  {jobData.responsibilities}
                </p>
              </section>
              <div className={`flex flex-col gap-2`}>
                <h4 className="text-amber-600 text-xl font-light uppercase border-b border-amber-700 p-2">
                  Requirements
                </h4>
                <p className="px-4 whitespace-pre-wrap text-sm md:text-base">
                  {jobData.requirements}
                </p>
              </div>
              {jobData.notes && (
                <div className="flex flex-col gap-2">
                  <h4 className="text-amber-600 text-xl font-light uppercase border-b border-amber-700 p-2">
                    Notes
                  </h4>
                  <p className="px-4 whitespace-pre-wrap text-sm md:text-base">
                    {jobData.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <ConfirmDialog
          isVisible={showConfirmDialog}
          message="Are you sure you want to delete this Application?"
          description="Deleted Applications cannot be Retrived"
          onConfirm={handleDelete}
          onClose={() => setShowConfirmDialog(false)}
        />
      </div>
    </Modal>
  );
};

export default JobDetailsModal;
