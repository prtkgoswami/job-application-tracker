"use client";
import { faExternalLinkAlt, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useParams } from "next/navigation";
import useJobDetails from "@/hooks/useJobDetails";
import { useAuth } from "@/contexts/AuthProvider";
import { useState } from "react";
import EditModal from "./EditModal";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@lib/firebase";
import { toast } from "react-toastify";
import { logAnalyticsEvent } from "@/lib/analytics";
import { getDifferenceFromNow } from "@/lib/date";

const JobDetailPage = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const params = useParams();
  const userId = params?.userId as string;
  const jobId = params?.jobId as string;
  const user = useAuth();

  const { job, events, isLoading, error, refetchData } = useJobDetails(
    user?.uid ?? undefined,
    jobId,
  );

  const handleDelete = async () => {
    if (!job) return;
    try {
      const ref = doc(db, "jobs", job.id);
      await deleteDoc(ref);
      toast.success("Successfully deleted Application");

      // Analytics
      logAnalyticsEvent("application_entry_deleted", {
        old_status: job.status,
        time_in_previous_stage: Math.floor(
          getDifferenceFromNow(new Date(job.lastUpdateDate)) /
            (1000 * 3600 * 24),
        ),
        time_since_created: Math.floor(
          getDifferenceFromNow(new Date(job.createDate)) / (1000 * 3600 * 24),
        ),
      });

      refetchData();
    } catch (err) {
      console.error("Application Delete Error", err);
      toast.error("Could not delete Application");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500">
        Loading details...
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="text-red-500 text-xl">{error}</div>
        <Link
          href={`/${userId}/dashboard`}
          className="text-accent-1 hover:underline"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-2 md:p-6 h-full overflow-y-auto">
      <div className="border-b border-foreground/15 pb-4 flex flex-col md:flex-row gap-y-4 justify-between">
        <div className="w-max">
          <h1 className="text-2xl md:text-3xl font-bold text-accent-1 mb-2">{job.title}</h1>
          <div className="flex gap-2 md:gap-4 text-foreground/60 text-xs md:text-sm items-center">
            <span className="text-foreground">{job.company}</span>
            <span className="w-1 h-1 rounded-full bg-accent-3"></span>
            <span>{job.location || "Remote"}</span>
            <span className="w-1 h-1 rounded-full bg-accent-3"></span>
            <span className="capitalize">{job.jobType}</span>
            <span className="w-1 h-1 rounded-full bg-accent-3"></span>
            <span className="capitalize px-2 py-0.5 rounded bg-zinc-800 text-foreground border border-foreground/15">
              {job.status}
            </span>
          </div>
        </div>

        <div className="flex flex-row gap-2">
          <button
            className="cursor-pointer py-2 w-25 h-max hidden md:flex justify-center items-center rounded-md border border-accent-1 text-accent-1 hover:bg-accent-1 hover:text-background transition-colors duration-150 ease-in-out"
            onClick={() => setShowEditModal(true)}
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="cursor-pointer py-2 w-25 h-max hidden md:flex justify-center items-center rounded-md border border-red-600 text-red-600 hover:bg-red-600/60 hover:text-foreground transition-colors duration-150 ease-in-out"
          >
            Delete
          </button>
          <button
            className="cursor-pointer py-2 w-20 h-8 flex md:hidden justify-center items-center rounded-md border border-accent-1 text-accent-1 hover:bg-accent-1 hover:text-background transition-colors duration-150 ease-in-out"
            onClick={() => setShowEditModal(true)}
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="cursor-pointer py-2 w-20 h-8 flex md:hidden justify-center items-center rounded-md border border-red-600 text-red-600 hover:bg-red-600/60 hover:text-foreground transition-colors duration-150 ease-in-out"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-background p-3 md:p-6 rounded-sm border border-foreground/10 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-foreground border-b border-foreground/15 pb-2">
              Description & Requirements
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-accent-1 uppercase tracking-wider mb-2">
                  Responsibilities
                </h3>
                <ul className="text-sm md:text-base whitespace-pre-wrap text-foreground/80 leading-relaxed list-disc">
                  {job.responsibilities}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-medium text-accent-1 uppercase tracking-wider mb-2">
                  Requirements
                </h3>
                <p className="text-sm md:text-base whitespace-pre-wrap text-foreground/80 leading-relaxed">
                  {job.requirements}
                </p>
              </div>
            </div>
          </div>

          {job.notes && (
            <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-foreground border-b border-zinc-800 pb-2">
                My Notes
              </h2>
              <p className="whitespace-pre-wrap text-foreground/80 leading-relaxed">
                {job.notes}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-zinc-900/50 p-6 rounded-lg border border-foreground/10 shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b border-foreground/15 pb-2">
              <h2 className="text-xl font-semibold text-foreground">
                Timeline
              </h2>
              <span className="text-xs text-foreground/40">
                {events.length} events
              </span>
            </div>

            {events.length === 0 ? (
              <p className="text-foreground/40 text-center py-8 italic">
                No events scheduled yet.
              </p>
            ) : (
              <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className={`p-3 rounded-md border transition-all ${
                      event.isDone
                        ? "border-green-900/30 bg-green-900/10 hover:bg-green-900/20"
                        : "border-zinc-700 bg-zinc-800 hover:bg-zinc-700"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span
                        className={`font-medium ${event.isDone ? "text-green-400" : "text-zinc-200"}`}
                      >
                        {event.title}
                      </span>
                      {event.isDone && (
                        <span className="text-[10px] uppercase font-bold bg-green-900/50 text-green-400 px-1.5 py-0.5 rounded">
                          Done
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-accent-1/80 mb-2">
                      {new Date(event.dateTime).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                    {event.description && (
                      <p className="text-xs text-foreground/80 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-foreground/15">
              <Link
                href={`/${userId}/schedule`}
                className="block w-full text-center text-sm text-accent-1 hover:text-accent-2"
              >
                Go to Schedule &rarr;
              </Link>
            </div>
          </div>

          <div className="bg-zinc-900/50 p-6 rounded-lg border border-foreground/10 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-zinc-200 pb-2">
              Links
            </h2>
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-accent-1 hover:bg-accent-1/80 text-background font-medium py-3 rounded-md transition-colors shadow-lg shadow-amber-900/20"
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} /> View Original Posting
            </a>
          </div>
        </div>
      </div>

      <EditModal
        userId={userId}
        jobData={job}
        isVisible={showEditModal}
        onClose={() => setShowEditModal(false)}
        refetchData={refetchData}
      />
    </div>
  );
};

export default JobDetailPage;
