"use client";

import { useEffect, useState } from "react";
import Header from "@/components/header";
type Coach = {
  id: string;
  name: string;
  contact_info?: string;
  image?: string;
  sport_id?: string;
};
type Sport = {
  id: string;
  name: string;
  image: string;
  description: string;
};
type ScheduleItem = {
  sportType: Sport;
  coach_id: Coach;
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
      const entry =
        schedule.find((s) => s.date === day && s.time === time) || null;
      scheduleMap[time][day] = entry;
    });
  });

  return (
    <>
      <Header />
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-900 text-center mt-[100px]">
          Weekly Sports Schedule
        </h1>

        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-2xl shadow-md overflow-hidden border border-blue-200">
              <thead>
                <tr className="bg-blue-900 text-white text-sm uppercase text-center tracking-wider">
                  <th className="px-4 py-3">Time</th>
                  {days.map((day) => (
                    <th key={day} className="px-4 py-3">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm text-center text-gray-800 divide-y divide-blue-100">
                {times.map((time) => (
                  <tr key={time} className="hover:bg-blue-50 transition">
                    <td className="px-4 py-4 font-semibold text-blue-900">
                      {time}
                    </td>
                    {days.map((day) => {
                      const entry = scheduleMap[time][day];
                      return (
                        <td key={day} className="px-2 py-3">
                          {entry ? (
                            <div className="bg-blue-100 border border-blue-300 rounded-xl px-3 py-2 shadow-sm hover:shadow-md transition duration-200">
                              <div className="font-bold text-blue-900">
                                {entry.sportType.name}
                              </div>
                              <div className="text-xs text-blue-800">
                                {entry.coach_id.name}
                              </div>
                              <div className="text-xs text-blue-700 italic">
                                {entry.location}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
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
