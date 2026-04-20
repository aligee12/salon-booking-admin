"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid/index.js";
import { FileClock, Loader2 } from "lucide-react";

export default function AvailabilityPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/bookings")
      .then((res) => res.json())
      .then((data) => {
        const fetchedEvents = data
          .filter((b: any) => b.status.toUpperCase() !== "CANCELLED")
          .map((b: any) => {
            const upStatus = b.status.toUpperCase();
            return {
              id: b.id,
              title: `${b.service?.name || "Service"} - ${b.staff?.name || "Staff"}`,
              start: b.startTime,
              end: b.endTime,
              backgroundColor: upStatus === "COMPLETED" ? "#3C50E0" : (upStatus === "CONFIRMED" ? "#10B981" : "#F59E0B"),
              borderColor: "transparent"
            };
          });
        setEvents(fetchedEvents);
      })
      .catch((err) => console.error("Failed to load availability:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-bold text-dark dark:text-white">Availability Matrix</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-dark-5">
            <span className="w-3 h-3 rounded-full bg-[#10B981]"></span> Confirmed
          </div>
          <div className="flex items-center gap-2 text-sm text-dark-5">
            <span className="w-3 h-3 rounded-full bg-[#F59E0B]"></span> Pending
          </div>
          <div className="flex items-center gap-2 text-sm text-dark-5">
            <span className="w-3 h-3 rounded-full bg-[#3C50E0]"></span> Completed
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-transparent px-4 py-2 font-medium hover:bg-gray-2 dark:border-dark-3 dark:hover:bg-dark-2 text-dark dark:text-white">
            <FileClock size={18} />
            Block Time
          </button>
        </div>
      </div>

      <div className="rounded-[10px] border border-primary-faint bg-white p-4 shadow-1 dark:bg-[#251F31] dark:shadow-card">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[600px] text-dark-5">
            <Loader2 size={32} className="animate-spin text-primary mb-2" />
            <span className="text-sm">Loading availability...</span>
          </div>
        ) : (
          <div className="min-h-[600px]">
            <FullCalendar
              plugins={[timeGridPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "timeGridWeek,timeGridDay"
              }}
              events={events}
              slotMinTime="08:00:00"
              slotMaxTime="22:00:00"
              allDaySlot={false}
              height="auto"
              eventTextColor="#ffffff"
            />
          </div>
        )}
      </div>
    </div>
  );
}
