import Modal from "@/components/Modal";
import { logAnalyticsEvent } from "@/lib/analytics";
import { db } from "@/lib/firebase";
import { Job } from "@/types/job";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  userId: string;
  isVisible: boolean;
  applicationList: Job[];
  onClose: () => void;
};

type FormDataType = {
  title: string;
  description: string;
  "related-job": string;
  "datetime-date": string;
  "datetime-time": string;
};

const getEmptyData = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return {
    title: "",
    description: "",
    "related-job": "",
    "datetime-date": `${year}-${month}-${day}`,
    "datetime-time": `${hours}:${minutes}`,
  };
};

const NewAgendaModal = ({
  userId,
  isVisible,
  onClose,
  applicationList,
}: Props) => {
  const [formData, setFormData] = useState<FormDataType>(getEmptyData());

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
    const newEventPayload = {
      title: formData.title,
      description: formData.description,
      relatedJobId: formData["related-job"],
      dateTime: new Date(
        `${formData["datetime-date"]} ${formData["datetime-time"]}`,
      ).getTime(),
      createdDate: serverTimestamp(),
      isDone: false,
    };
    console.log("Creating new Event", newEventPayload);

    try {
      const col = collection(db, "schedule");
      await addDoc(col, {
        userId,
        ...newEventPayload,
      });
      toast("New Event Added", { type: "success" });

      // Analytics
      logAnalyticsEvent("event_created");
      setFormData(getEmptyData());
      onClose();
    } catch (err) {
      console.error("Could not create Event", (err as Error).message);
      toast("Could not create Event", { type: "error" });
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      theme="dark"
      title="New Event"
      modalClasses="w-full md:w-2/3 lg:w-1/2 pb-4 shadow-xl shadow-slate-900 border border-slate-700 h-max mx-2"
      bodyClasses="px-4 py-4 relative flex flex-col items-stretch"
      hasBackdropPadding={true}
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5 basic-full">
          <label
            htmlFor="event-form-title"
            className="text-zinc-400 text-sm font-medium"
          >
            Event Title
          </label>
          <input
            name="title"
            type="text"
            id="event-form-title"
            placeholder="e.g. Technical Interview"
            value={formData["title"]}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg transition-all"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="event-form-date"
              className="text-zinc-400 text-sm font-medium"
            >
              Date
            </label>
            <input
              type="date"
              name="datetime-date"
              id="event-form-date"
              value={formData["datetime-date"]}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg transition-all"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="event-form-time"
              className="text-zinc-400 text-sm font-medium"
            >
              Time
            </label>
            <input
              type="time"
              name="datetime-time"
              id="event-form-time"
              value={formData["datetime-time"]}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg transition-all"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="event-form-related-job"
            className="text-zinc-400 text-sm font-medium"
          >
            Related Job
          </label>
          <div className="relative">
            <select
              name="related-job"
              id="event-form-related-job"
              value={formData["related-job"]}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg transition-all appearance-none"
              required
            >
              <option value="" disabled>
                Select a job application...
              </option>
              {applicationList.map((app) => (
                <option
                  key={app.id}
                  value={app.id}
                  className="bg-zinc-900"
                >{`${app.title} • ${app.company}`}</option>
              ))}
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

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="event-form-desc"
            className="text-zinc-400 text-sm font-medium"
          >
            Description (Optional)
          </label>
          <textarea
            name="description"
            id="event-form-desc"
            placeholder="Add notes, meeting links, or other details..."
            value={formData["description"]}
            onChange={handleChange}
            className="w-full px-4 py-3 h-32 bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          className="cursor-pointer w-full py-3.5 mt-2 rounded-lg text-zinc-950 font-bold bg-amber-500 hover:bg-amber-400 active:scale-[0.99] transition-all shadow-lg shadow-amber-900/20"
        >
          Add to Schedule
        </button>
      </form>
    </Modal>
  );
};

export default NewAgendaModal;
