import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { toast } from "react-toastify";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

type EntryModalProps = {
  showModal: boolean;
  userId: string;
  onClose: () => void;
};

const EntryModal = ({ showModal, userId, onClose }: EntryModalProps) => {
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
      status: "applied",
    };

    try {
      const col = collection(db, "jobs");
      await addDoc(col, {
        userId,
        ...payload,
      });
      toast("New Job Added", { type: "success" });
      onClose();
    } catch (err) {
      console.error("Could not add Job", (err as Error).message);
      toast("Could not add Job", { type: "error" });
    }
  };

  if (!showModal) {
    return <></>;
  }

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-gray-900/40 flex justify-center items-center md:py-8">
      <div className="w-full md:w-2/3 bg-gray-100 h-full rounded-lg p-5 flex flex-col overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-medium text-gray-800">New Entry</h3>
          <button
            onClick={onClose}
            className="text-gray-800 cursor-pointer w-10 aspect-square rounded-full flex justify-center items-center hover:bg-amber-400 transition-colors duration-200 ease-in-out"
          >
            <FontAwesomeIcon icon={faClose} size="lg" />
          </button>
        </div>

        <div className="flex justify-center grow">
          <form
            className="w-full md:w-4/5 flex flex-col items-center gap-5"
            onSubmit={handleSubmit}
          >
            <div className="w-full">
              <label className="text-amber-500 uppercase font-semibold">
                Job Title
              </label>
              <input
                type="text"
                name="job-title"
                placeholder="Type here..."
                className="w-full border border-gray-800 px-4 py-2 text-gray-800 focus-visible:outline-none"
                required
              />
            </div>
            <div className="w-full grid grid-cols-2 gap-5">
              <div className="w-full">
                <label className="text-amber-500 uppercase font-semibold">
                  Job Link
                </label>
                <input
                  type="text"
                  name="job-link"
                  placeholder="Paste here..."
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
                  placeholder="Type here..."
                  className="w-full border border-gray-800 px-4 py-2 text-gray-800 focus-visible:outline-none"
                  required
                />
              </div>
            </div>
            <div className="w-full grid grid-cols-2 gap-5">
              <div className="w-full">
                <label className="text-amber-500 uppercase font-semibold">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="Type here..."
                  className="w-full border border-gray-800 px-4 py-2 text-gray-800 focus-visible:outline-none"
                  required
                />
              </div>
              <div className="w-full">
                <label className="text-amber-500 uppercase font-semibold">
                  Job Type
                </label>
                <select
                  name="job-type"
                  className="capitalize w-full border border-gray-800 px-4 py-[11px] text-gray-800"
                  required
                  defaultValue="onsite"
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
                name="job-responsibilities"
                placeholder="Paste here..."
                className="w-full border border-gray-800 px-4 py-2 text-gray-800 focus-visible:outline-none resize-none h-80 overflow-y-auto"
              />
            </div>
            <div className="w-full">
              <label className="text-amber-500 uppercase font-semibold">
                Requirements
              </label>
              <textarea
                name="job-requirements"
                placeholder="Paste here..."
                className="w-full border border-gray-800 px-4 py-2 text-gray-800 focus-visible:outline-none resize-none h-80 overflow-y-auto"
              />
            </div>
            <div className="pb-5 w-full">
              <label className="text-amber-500 uppercase font-semibold">
                Notes
              </label>
              <textarea
                name="job-notes"
                placeholder="Paste here..."
                className="w-full border border-gray-800 px-4 py-2 text-gray-800 focus-visible:outline-none resize-none h-80 overflow-y-auto"
              />
            </div>
            <button
              type="submit"
              className="cursor-pointer bg-amber-400 text-gray-800 hover:bg-amber-500 px-8 py-5 md:py-2 rounded-md w-full md:w-1/2"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EntryModal;
