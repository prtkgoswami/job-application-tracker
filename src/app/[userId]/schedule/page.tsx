"use client";
import Modal from "@/components/Modal";
import { useAuth } from "@/contexts/AuthProvider";
import useJobs from "@/hooks/useJobs";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { User } from "firebase/auth";
import React, { useMemo, useState } from "react";
import NewEventModal from "./NewEventModal";
import { ScheduledEvent, Schedule } from "@/types/schedule";
import { Job } from "@/types/job";
import useSchedule from "@/hooks/useSchedule";
import EventList from "./EventList";
import EventDetailsModal from "./EventDetailsModal";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-toastify";

const ScheduleContent = ({ user }: { user: User }) => {
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [activeEvent, setActiveEvent] = useState<ScheduledEvent | null>(null);
  const { jobs, isLoading: isLoadingJobs } = useJobs(user.uid);
  const {
    events,
    isLoading: isLoadingEvents,
    error,
    refetch,
  } = useSchedule(user.uid);
  const ongoingApplications = jobs.filter(
    (job) => job.status === "interviewing",
  );
  const showEventDetail = !!activeEvent;
  const jobMap: Record<string, Job> = useMemo(
    () =>
      jobs.reduce(
        (map, job) => {
          map[job.id] = job;
          return map;
        },
        {} as Record<string, Job>,
      ),
    [jobs],
  );

  const groupedEvents =
    events?.reduce(
      (acc, event) => {
        const date = new Date(event.dateTime);
        const dateString = date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });

        if (!acc[dateString]) {
          acc[dateString] = [];
        }
        acc[dateString].push(event);
        return acc;
      },
      {} as Record<string, Schedule>,
    ) ?? undefined;

  const handleAddEventsClose = () => {
    setShowAddEventModal(false);
    refetch();
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const docRef = doc(db, "schedule", eventId);
      await deleteDoc(docRef);
      setActiveEvent(null);
      refetch();
      toast("Event deleted successfully", { type: "success" });
    } catch (err) {
      console.error("Error deleting event", err);
      toast("Could not delete event", { type: "error" });
    }
  };

  const handleMarkDoneEvent = async (eventId: string) => {
    try {
      const docRef = doc(db, "schedule", eventId);
      await updateDoc(docRef, { isDone: true });
      setActiveEvent(null);
      refetch();
      toast("Event marked as done", { type: "success" });
    } catch (err) {
      console.error("Error updating event", err);
      toast("Could not update event", { type: "error" });
    }
  };

  return (
    <div className="h-screen flex flex-col w-full">
      <div className="flex justify-between items-center px-3 py-2 md:px-5 md:py-5">
        <h2 className="text-xl md:text-2xl text-amber-400 leading-relaxed">
          Schedule
        </h2>
        <button
          className="cursor-pointer h-10 md:h-12 px-3 py-2 rounded-md text-zinc-900 bg-amber-500 hover:bg-amber-400"
          onClick={() => setShowAddEventModal(true)}
        >
          <FontAwesomeIcon icon={faPlus} /> New Event
        </button>
      </div>

      <div className="grow w-full grid grid-cols-1 md:grid-cols-[1fr_80%_1fr]">
        <div className="md:col-start-2 px-3 py-5 flex flex-col gap-4 w-full">
          <EventList
            eventList={groupedEvents}
            jobMap={jobMap}
            isEmpty={!groupedEvents || Object.keys(groupedEvents).length === 0}
            isLoading={isLoadingJobs || isLoadingEvents}
            error={error}
            onClick={setActiveEvent}
          />
        </div>
      </div>

      <NewEventModal
        userId={user.uid}
        isVisible={showAddEventModal}
        onClose={handleAddEventsClose}
        applicationList={ongoingApplications}
      />

      <EventDetailsModal
        userId={user.uid}
        isVisible={showEventDetail}
        eventDetails={activeEvent}
        jobDetails={activeEvent ? jobMap[activeEvent?.relatedJobId] : null}
        onClose={() => setActiveEvent(null)}
        onDelete={handleDeleteEvent}
        onDone={handleMarkDoneEvent}
      />
    </div>
  );
};

const SchedulePage = () => {
  const user = useAuth();

  if (!user) return <></>;

  return <ScheduleContent user={user} />;
};

export default SchedulePage;
