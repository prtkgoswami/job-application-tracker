import { Job } from "@/types/job";
import { ScheduledEvent } from "@/types/schedule";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type Props = {
  eventList: Record<string, ScheduledEvent[]>;
  jobMap: Record<string, Job>;
  isEmpty: boolean;
  isLoading: boolean;
  error?: Error;
  onClick: (event: ScheduledEvent) => void;
};

const EventList = ({
  eventList,
  jobMap,
  isEmpty,
  isLoading,
  error,
  onClick,
}: Props) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-zinc-500 animate-pulse">
        <FontAwesomeIcon icon={faClock} size="2x" className="mb-4 opacity-50" />
        <h2 className="text-lg font-medium">Loading Schedule...</h2>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-zinc-800 rounded-xl bg-zinc-900/30 text-zinc-500">
        <h2 className="text-xl font-medium mb-2">Nothing Scheduled</h2>
        <p className="text-sm">Your upcoming schedule is clear.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(eventList).map(([date, schedule]) => (
        <div key={`group-${date}`} className="relative">
          <div className="sticky top-0 z-10 bg-zinc-950/90 backdrop-blur pb-4 pt-2 border-b border-zinc-800 mb-4 flex items-baseline justify-between">
            <h3 className="text-xl font-bold text-zinc-100">{date}</h3>
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
              {schedule.length} {schedule.length === 1 ? "Event" : "Events"}
            </span>
          </div>

          <div className="grid gap-3">
            {schedule.map((event) => {
              const job = jobMap[event.relatedJobId];
              const eventDate = new Date(event.dateTime);

              return (
                <div
                  key={event.id}
                  onClick={() => onClick(event)}
                  className={`group relative flex overflow-hidden rounded-lg border transition-all duration-200 cursor-pointer
                    ${
                      event.isDone
                        ? "bg-zinc-900/30 border-zinc-800 opacity-60 hover:opacity-100"
                        : "bg-zinc-900 border-zinc-800 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5"
                    }
                  `}
                >
                  {/* Time Column */}
                  <div
                    className={`flex flex-col items-center justify-center min-w-[80px] p-4 text-center border-r border-zinc-800/50 
                    ${event.isDone ? "bg-zinc-900/50 text-zinc-500" : "bg-zinc-800/30 text-zinc-300 group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-colors"}
                  `}
                  >
                    <span className="text-xl font-bold leading-none">
                      {
                        eventDate
                          .toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: false,
                          })
                          .split(" ")[0]
                      }
                    </span>
                    <span className="text-sm font-semibold capitalize mt-3 opacity-70">
                      {event.duration} mins
                    </span>
                  </div>

                  {/* Content Column */}
                  <div className="flex-1 p-4 flex flex-col justify-center min-w-0">
                    <div className="flex justify-between items-start gap-4 mb-1">
                      <h4
                        className={`text-base font-semibold truncate pr-2 ${event.isDone ? "text-zinc-500 line-through decoration-zinc-600" : "text-zinc-100 group-hover:text-amber-400 transition-colors"}`}
                      >
                        {event.title}
                      </h4>
                      {event.isDone && (
                        <span className="shrink-0 text-green-500/80 bg-green-500/10 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border border-green-500/20">
                          Done
                        </span>
                      )}
                    </div>

                    {job && (
                      <div className="flex items-center gap-2 text-sm truncate text-zinc-400">
                        <span className="font-medium text-zinc-300">
                          {job.title}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                        <span className="truncate">{job.company}</span>
                      </div>
                    )}
                  </div>

                  {/* Hover Indicator */}
                  {!event.isDone && (
                    <div className="absolute inset-y-0 right-0 w-1 bg-amber-500/0 group-hover:bg-amber-500 transition-colors duration-200" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;
