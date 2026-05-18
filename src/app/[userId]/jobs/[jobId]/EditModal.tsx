"use client";
import React, { useEffect, useRef, useState } from "react";
import { Job } from "@/types/job";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAsterisk,
  faCopy,
  faFloppyDisk,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@lib/firebase";
import { toast } from "react-toastify";
import Modal from "@components/Modal";
import ClickToCopyText from "@components/ClickToCopyText";
import { logAnalyticsEvent } from "@lib/analytics";

type EditModalProps = {
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
  offered: { bgColor: "bg-green-300", textColor: "text-green-600" },
  cancelled: { bgColor: "bg-gray-300", textColor: "text-gray-600" },
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

const EditModal = ({
  userId,
  jobData,
  isVisible,
  refetchData,
  onClose,
}: EditModalProps) => {
  const [formData, setFormData] =
    useState<Omit<Job, "id" | "createDate" | "lastUpdateDate">>(INITIAL_DATA);
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
    >,
  ) => {
    const { name, value } = e.target;
    if (!name || !value) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const jobRef = doc(db, "jobs", jobData?.id);
      const analyticsRef = doc(db, "users", userId, "metadata", "analytics");

      await runTransaction(db, async (transaction) => {
        let updatedAnalytics = null;

        if (jobData.status !== formData.status) {
          const analyticsDoc = await transaction.get(analyticsRef);

          if (analyticsDoc.exists()) {
            const currentCounts = analyticsDoc.data().applicationCounts || {};

            const oldStatusCount = currentCounts[jobData.status] || 0;
            const newStatusCount = currentCounts[formData.status] || 0;

            updatedAnalytics = {
              [`applicationCounts.${jobData.status}`]: Math.max(
                0,
                oldStatusCount - 1,
              ),
              [`applicationCounts.${formData.status}`]: newStatusCount + 1,
              lastUpdated: serverTimestamp(),
            };
          }
        }

        const jobPayload = {
          ...formData,
          createDate: new Date(jobData.createDate),
          lastUpdateDate: serverTimestamp(),
        };
        transaction.update(jobRef, jobPayload);

        if (updatedAnalytics) {
          transaction.update(analyticsRef, updatedAnalytics);

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
      });

      toast.success("Successfully updated Application");
      refetchData();
      onClose();
    } catch (err) {
      console.error("Application Update Error", err);
      toast.error("Could not updated Application");
    }
  };

  const handleUpdate = () => {
    if (!formRef.current) return;

    formRef.current.requestSubmit();
  };

  const renderFooter = () => {
    return (
      <div className="flex justify-center items-center">
        <div className="hidden md:flex justify-between gap-8 w-4/5">
          <button
            type="button"
            className="cursor-pointer border-2 border-foreground/80 text-foreground/80 hover:border-foreground hover:text-foreground transition-colors duration-200 ease-in-out px-8 py-2 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="cursor-pointer border-2 border-accent-1 text-accent-1 hover:bg-accent-1 hover:text-background transition-colors duration-200 ease-in-out px-8 py-2 rounded-md"
            onClick={handleUpdate}
          >
            Save Changes
          </button>
        </div>
        <div className="grid md:hidden grid-cols-4 gap-8 w-4/5">
          <>
            <button
              type="button"
              className="col-start-3 cursor-pointer border-2 border-amber-600 text-gray-800 aspect-square text-2xl rounded-md"
              style={{ height: "60px" }}
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
        </div>
      </div>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      modalClasses="md:w-2/3 h-full md:h-[96%]"
      bodyClasses="px-5 flex justify-center w-full"
      theme="dark"
      onClose={() => {
        onClose();
      }}
      title="Edit Job Details"
      footer={renderFooter()}
      footerClasses="bg-transparent border-foreground/15!"
    >
      <div className="h-full w-full flex flex-col ">
        <div className={`flex justify-center grow`}>
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
              <p className="text-right text-xs font-semibold text-accent-1 w-full select-none cursor-pointer">
                JOB ID: {jobData.id} <FontAwesomeIcon icon={faCopy} size="lg" />
              </p>
            </ClickToCopyText>

            <div className="w-full">
              <label className="text-accent-1 uppercase font-semibold flex items-start gap-1">
                Job Title{" "}
                <FontAwesomeIcon
                  icon={faAsterisk}
                  size="xs"
                  className="text-rose-500"
                />
              </label>
              <input
                type="text"
                name="title"
                value={formData?.title}
                onChange={handleChange}
                placeholder="Type here..."
                className="w-full border border-foreground/20 focus-visible:border-accent-3 px-4 py-2 text-foreground focus-visible:outline-none"
                required
              />
            </div>

            <div className="w-full grid md:grid-cols-2 gap-5">
              <div className="w-full">
                <label className="text-accent-1 uppercase font-semibold flex items-start gap-1">
                  Company{" "}
                  <FontAwesomeIcon
                    icon={faAsterisk}
                    size="xs"
                    className="text-rose-500"
                  />
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData?.company}
                  onChange={handleChange}
                  placeholder="Paste here..."
                  className="w-full border border-foreground/20 focus-visible:border-accent-3 px-4 py-2 text-foreground focus-visible:outline-none"
                  required
                />
              </div>

              <div className="w-full">
                <label className="text-accent-1 uppercase font-semibold">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData?.location}
                  onChange={handleChange}
                  placeholder="Paste here..."
                  className="w-full border border-foreground/20 focus-visible:border-accent-3 px-4 py-2 text-foreground focus-visible:outline-none"
                />
              </div>
            </div>

            <div className="w-full">
              <label className="text-accent-1 uppercase font-semibold">
                Job Link
              </label>
              <input
                type="text"
                name="link"
                value={formData?.link}
                onChange={handleChange}
                placeholder="Paste here..."
                className="w-full border border-foreground/20 focus-visible:border-accent-3 px-4 py-2 text-foreground focus-visible:outline-none"
              />
            </div>

            <div className="w-full grid md:grid-cols-2 gap-5">
              <div className="w-full">
                <label className="text-accent-1 uppercase font-semibold">
                  Application Status
                </label>
                <select
                  name="status"
                  value={formData?.status}
                  onChange={handleChange}
                  className="w-full border border-foreground/20 focus-visible:border-accent-3 text-base text-foreground capitalize px-4 py-[11px]"
                >
                  <option value="wishlist">wishlist</option>
                  <option value="applied">applied</option>
                  <option value="interviewing">interviewing</option>
                  <option value="rejected">rejected</option>
                  <option value="offered">offered</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </div>
              <div className="w-full">
                <label className="text-accent-1 uppercase font-semibold">
                  Job Type
                </label>
                <select
                  name="jobType"
                  value={formData?.jobType}
                  onChange={handleChange}
                  className="w-full border border-foreground/20 focus-visible:border-accent-3 text-base text-foreground capitalize px-4 py-[11px]"
                >
                  <option value="onsite">onsite</option>
                  <option value="hybrid">hybrid</option>
                  <option value="remote">remote</option>
                </select>
              </div>
            </div>
            <div className="w-full">
              <label className="text-accent-1 uppercase font-semibold">
                Responsibilities
              </label>
              <textarea
                name="responsibilities"
                value={formData?.responsibilities}
                onChange={handleChange}
                placeholder="Paste here..."
                className="w-full border border-foreground/20 focus-visible:border-accent-3 px-4 py-2 text-foreground focus-visible:outline-none resize-none h-60 overflow-y-auto"
              />
            </div>
            <div className="w-full">
              <label className="text-accent-1 uppercase font-semibold">
                Requirements
              </label>
              <textarea
                name="requirements"
                value={formData?.requirements}
                onChange={handleChange}
                placeholder="Paste here..."
                className="w-full border border-foreground/20 focus-visible:border-accent-3 px-4 py-2 text-foreground focus-visible:outline-none resize-none h-60 overflow-y-auto"
              />
            </div>
            <div className="grow pb-5 w-full">
              <label className="text-accent-1 uppercase font-semibold">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData?.notes}
                onChange={handleChange}
                placeholder="Paste here..."
                className="w-full border border-foreground/20 focus-visible:border-accent-3 px-4 py-2 text-foreground focus-visible:outline-none resize-none h-60 overflow-y-auto"
              />
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default EditModal;
