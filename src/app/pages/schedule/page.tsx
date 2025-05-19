"use client";

import { useEffect, useState } from "react";
import Header from "@/components/header";

type ScheduleItem = {
  sport: string;
  coach: string;
  location: string;
  date: string;
  time: string;
};

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch("/api/schedules");
        if (!res.ok) throw new Error("Failed to fetch schedule");
        const data = await res.json();
        setSchedule(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  // Days of week, must match `date` values in data
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Extract unique times from schedule and sort
  const times = Array.from(new Set(schedule.map((item) => item.time))).sort();

  // Build a map of time -> day -> schedule item (or null)
  const scheduleMap: Record<string, Record<string, ScheduleItem | null>> = {};
  times.forEach((time) => {
    scheduleMap[time] = {};
    days.forEach((day) => {
      const entry = schedule.find((s) => s.date === day && s.time === time) || null;
      scheduleMap[time][day] = entry;
    });
  });

  return (
    <>
      <Header />
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-purple-700 text-center">
          Weekly Sports Schedule
        </h1>

        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow overflow-hidden">
              <thead>
                <tr className="bg-purple-200 text-purple-800 text-sm uppercase text-center tracking-wider">
                  <th className="px-4 py-3">Time</th>
                  {days.map((day) => (
                    <th key={day} className="px-4 py-3">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm text-center text-gray-700 divide-y divide-gray-200">
                {times.map((time) => (
                  <tr key={time} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-4 font-medium">{time}</td>
                    {days.map((day) => {
                      const entry = scheduleMap[time][day];
                      return (
                        <td key={day} className="px-4 py-4">
                          {entry ? (
                            <>
                              <div className="font-semibold">{entry.sport}</div>
                              <div className="text-xs text-gray-500">{entry.coach}</div>
                              <div className="text-xs text-gray-400 italic">{entry.sport}</div>
                            </>
                          ) : (
                            "-"
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
