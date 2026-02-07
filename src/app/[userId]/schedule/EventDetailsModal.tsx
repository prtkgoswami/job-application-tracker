import Modal from "@/components/Modal";
import { formatDateTime } from "@/lib/date";
import { Job } from "@/types/job";
import { ScheduledEvent } from "@/types/schedule";
import {
  faCaretRight,
  faCheckCircle,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

type Props = {
  userId: string;
  isVisible: boolean;
  eventDetails: ScheduledEvent | null;
  jobDetails: Job | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onDone: (id: string) => void;
};

const EventDetailsModal = ({
  userId,
  isVisible,
  eventDetails,
  jobDetails,
  onClose,
  onDelete,
  onDone,
}: Props) => {
  if (!eventDetails) return <></>;

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      theme="dark"
      title="Event Details"
      modalClasses="w-full md:w-2/3 lg:w-1/2 pb-4 shadow-xl shadow-slate-900 border border-slate-700 h-max mx-2"
      bodyClasses="px-4 py-4 relative flex flex-col gap-5"
      hasBackdropPadding={true}
      hideHeader={true}
    >
      <div className="flex justify-between items-start gap-4">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-amber-500 leading-tight">
          {eventDetails.title}
        </h2>
        {eventDetails.isDone && (
          <span className="text-green-500 shrink-0 mt-1">
            <FontAwesomeIcon icon={faCheckCircle} size="lg" />
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1 text-zinc-400 text-sm md:text-base border-b border-zinc-800 pb-4">
        <p>
          <span className="text-zinc-200 font-medium">{jobDetails?.title}</span>{" "}
          • {jobDetails?.company}
        </p>
        <p className="text-xs md:text-sm text-zinc-500">
          {jobDetails?.location ?? "Location not specified"}
        </p>

        <Link
          href={`/${userId}/jobs/${eventDetails.relatedJobId}`}
          className="text-amber-500 hover:text-amber-400 mt-2 inline-flex items-center gap-2 text-sm max-w-max"
        >
          View Application
          <FontAwesomeIcon icon={faCaretRight} />
        </Link>
      </div>

      <div className="flex items-center gap-2 text-zinc-300 text-base md:text-lg">
        <FontAwesomeIcon icon={faClock} className="text-amber-500" />
        <span className="font-mono">
          {eventDetails.dateTime
            ? formatDateTime(new Date(eventDetails.dateTime))
            : "No time set"}
        </span>
      </div>

      <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
        <p className="h-40 overflow-y-auto leading-relaxed text-sm md:text-base text-zinc-300 whitespace-pre-wrap">
          {eventDetails.description || (
            <span className="text-zinc-600 italic">
              No description provided.
            </span>
          )}
        </p>
      </div>

      <div className="flex flex-col-reverse md:flex-row justify-between gap-3 pt-2">
        <button
          className="cursor-pointer py-3 md:py-2 px-4 bg-red-900/20 text-red-500 hover:bg-red-900/40 border border-red-900/50 rounded-md transition-colors font-medium w-full md:w-auto"
          onClick={() => onDelete(eventDetails.id)}
        >
          Delete Event
        </button>
        <button
          className={`cursor-pointer py-3 md:py-2 px-6 rounded-md transition-all font-medium flex items-center justify-center gap-2 w-full md:w-auto shadow-lg
            ${
              eventDetails.isDone
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
                : "bg-green-600 text-white hover:bg-green-500 shadow-green-900/20"
            }
          `}
          onClick={() => onDone(eventDetails.id)}
          disabled={eventDetails.isDone}
        >
          {eventDetails.isDone ? (
            <>
              <FontAwesomeIcon icon={faCheckCircle} />
              Completed
            </>
          ) : (
            "Mark as Done"
          )}
        </button>
      </div>
    </Modal>
  );
};

export default EventDetailsModal;
