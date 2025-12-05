import React, { useEffect, useRef, useState } from "react";
import { Job } from "../types/job";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faClose,
  faFloppyDisk,
  faLink,
  faLocationDot,
  faPenToSquare,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { toast } from "react-toastify";
import Link from "next/link";

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

  const handleIDClick = async () => {
    try {
      await navigator.clipboard.writeText(jobData.id);
      toast.success("ID Copied to Clipboard");
    } catch (err) {
      console.error(`Could Not copy ID(${jobData.id}) to clipboard`);
    }
  };

  const handleUpdate = () => {
    if (!formRef.current) return;

    formRef.current.requestSubmit();
  };

  return (
    <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center bg-gray-800/40">
      <div className="w-full md:w-2/3 bg-gray-100 h-full md:h-170 rounded-lg relative">
        <div className="w-full absolute bottom-0 left-0 bg-amber-400 px-5 py-4 border-t border-gray-800 flex justify-center items-center">
          <div className="hidden md:grid grid-cols-4 gap-8 w-4/5">
            <button
              type="button"
              className="cursor-pointer border-2 border-amber-600 text-gray-800 hover:bg-red-600/60 transition-colors duration-200 ease-in-out px-8 py-2 rounded-md"
              onClick={handleDelete}
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

        <div className="h-full w-full overflow-y-auto p-5 flex flex-col ">
          <div className="flex justify-end">
            <button
              className="w-10 h-10 cursor-pointer flex justify-center items-center rounded-full text-gray-800 hover:bg-amber-400/60"
              onClick={() => {
                onClose();
                setIsInEditMode(false);
              }}
            >
              <FontAwesomeIcon icon={faClose} size="lg" />
            </button>
          </div>

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
                <p
                  className="text-right text-xs text-amber-600 w-full select-none cursor-pointer"
                  onClick={handleIDClick}
                >
                  JOB ID: {jobData.id}
                </p>

                <div className="w-full">
                  <label className="text-amber-500 uppercase font-semibold">
                    Job Title
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
                  <label className="text-amber-500 uppercase font-semibold">
                    Company
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
                      required
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
                      required
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
              <div className="flex flex-col gap-5 pb-18 text-gray-800">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl md:text-3xl">
                    {jobData.title}{" "}
                    <Link href={jobData.link} target="_blank">
                      <FontAwesomeIcon
                        icon={faLink}
                        className="text-blue-500 text-2xl"
                      />
                    </Link>
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
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-amber-600 text-xl font-light uppercase border-b border-amber-700 p-2">
                    Responsibilities
                  </h4>
                  <p className="px-4 whitespace-pre-wrap text-sm md:text-base">
                    {jobData.responsibilities}
                  </p>
                </div>
                <div
                  className={`flex flex-col gap-2 ${
                    !jobData.notes && "pb-5 md:pb-0"
                  }`}
                >
                  <h4 className="text-amber-600 text-xl font-light uppercase border-b border-amber-700 p-2">
                    Requirements
                  </h4>
                  <p className="px-4 whitespace-pre-wrap text-sm md:text-base">
                    {jobData.requirements}
                  </p>
                </div>
                {jobData.notes && (
                  <div className="flex flex-col gap-2 pb-5 md:pb-0">
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
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;
