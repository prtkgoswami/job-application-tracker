"use client";

import {
  faArrowLeft,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useParams } from "next/navigation";
import useJobDetails from "@/hooks/useJobDetails";
import { useAuth } from "@/contexts/AuthProvider";

const JobDetailPage = () => {
  const params = useParams();
  const userId = params?.userId as string;
  const jobId = params?.jobId as string;
  const user = useAuth();

  const { job, events, isLoading, error } = useJobDetails(
    user?.uid ?? undefined,
    jobId,
  );

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
          className="text-amber-500 hover:underline"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 h-full overflow-y-auto">
      <div className="border-b border-zinc-700 pb-4">
        <h1 className="text-3xl font-bold text-amber-500 mb-2">{job.title}</h1>
        <div className="flex gap-4 text-zinc-400 text-sm items-center">
          <span className="text-zinc-100">{job.company}</span>
          <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
          <span>{job.location || "Remote"}</span>
          <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
          <span className="capitalize">{job.jobType}</span>
          <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
          <span className="capitalize px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">
            {job.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-zinc-200 border-b border-zinc-800 pb-2">
              Description & Requirements
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-amber-500 uppercase tracking-wider mb-2">
                  Responsibilities
                </h3>
                <p className="whitespace-pre-wrap text-zinc-400 leading-relaxed">
                  {job.responsibilities}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-amber-500 uppercase tracking-wider mb-2">
                  Requirements
                </h3>
                <p className="whitespace-pre-wrap text-zinc-400 leading-relaxed">
                  {job.requirements}
                </p>
              </div>
            </div>
          </div>

          {job.notes && (
            <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-zinc-200 border-b border-zinc-800 pb-2">
                My Notes
              </h2>
              <p className="whitespace-pre-wrap text-zinc-400 leading-relaxed">
                {job.notes}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
              <h2 className="text-xl font-semibold text-zinc-200">Timeline</h2>
              <span className="text-xs text-zinc-500">
                {events.length} events
              </span>
            </div>

            {events.length === 0 ? (
              <p className="text-zinc-500 text-center py-8 italic">
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
                    <div className="text-xs text-amber-500/80 mb-2">
                      {new Date(event.dateTime).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                    {event.description && (
                      <p className="text-xs text-zinc-400 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-zinc-800">
              <Link
                href={`/${userId}/schedule`}
                className="block w-full text-center text-sm text-amber-500 hover:text-amber-400"
              >
                Go to Schedule &rarr;
              </Link>
            </div>
          </div>

          <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-zinc-200 border-b border-zinc-800 pb-2">
              Links
            </h2>
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-amber-600 hover:bg-amber-500 text-white font-medium py-3 rounded-md transition-colors shadow-lg shadow-amber-900/20"
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} /> View Original Posting
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
