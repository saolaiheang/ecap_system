"use client";

import { useEffect, useState } from "react";
import Header from "@/components/header";
import { Calendar, MapPin, Medal } from "lucide-react";
import Footer from "@/components/footer";
import FetchCompetitionLayout from "@/components/fetchcompetitionlayout";

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
  image: string | null;
  description: string;
};

type Team = {
  id: string;
  name: string;
  division: string;
  contact_info?: string;
  image?: string | null;
};

type ScheduleItem = {
  sportType: Sport;
  coach_id: Coach;
  team: Team;
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
      } catch (err) {
        console.error("Failed to fetch schedule:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const times = Array.from(new Set(schedule.map((item) => item.time))).sort();

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
    <Header/>
      <div className="min-h-screen text-pink-400">
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-center mb-8 mt-[100px] bg-gradient-to-r from-pink-500 to-purple-700 text-transparent bg-clip-text">
            Weekly Sports Schedule
          </h1>

          {loading && <p className="text-center text-pink-300">Loading...</p>}
          {error && <p className="text-center text-red-400">Error: {error}</p>}

          {/* Desktop Table */}
          {!loading && !error && (
            <div className="hidden sm:block overflow-x-auto rounded-lg shadow-2xl">
              <table className="min-w-full bg-white/90 text-pink-800 rounded-2xl overflow-hidden border border-pink-300">
                <thead>
                  <tr className="bg-gradient-to-r from-pink-500 to-purple-700 text-white text-sm uppercase tracking-wider text-center">
                    <th className="px-4 py-3">Time</th>
                    {days.map((day) => (
                      <th key={day} className="px-4 py-3">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm text-center divide-y divide-pink-100">
                  {times.map((time) => (
                    <tr key={time} className="hover:bg-pink-50 transition">
                      <td className="px-4 py-4 font-semibold text-pink-800 bg-pink-100">{time}</td>
                      {days.map((day) => {
                        const entry = scheduleMap[time][day];
                        return (
                          <td key={day} className="px-2 py-3">
                            {entry ? (
                              <div className="bg-pink-50 border border-pink-300 rounded-xl px-3 py-2 shadow hover:shadow-pink-300 transition duration-200 space-y-1 text-left">
                                <div className="font-bold text-pink-700 flex items-center gap-1">
                                  <Medal className="w-4 h-4 text-pink-500" /> {entry.sportType.name}
                                </div>
                                <div className="text-xs text-pink-600 flex items-center gap-1">
                                  <MapPin className="w-4 h-4" /> {entry.location}
                                </div>
                                <div className="text-xs text-pink-500 flex items-center gap-1">
                                  <Calendar className="w-4 h-4" /> Division: {entry.team.division}
                                </div>
                              </div>
                            ) : (
                              <span className="text-pink-300">-</span>
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

          {/* Mobile Layout */}
          {!loading && !error && (
            <div className="block sm:hidden space-y-4 mt-6">
              {schedule.map((entry, index) => (
                <div
                  key={index}
                  className="bg-white/90 border border-pink-300 rounded-xl p-4 shadow hover:shadow-pink-300 transition"
                >
                  <div className="text-sm text-pink-600 font-medium">{entry.date} • {entry.time}</div>
                  <div className="font-bold text-pink-700 text-lg flex items-center gap-2 mt-1">
                    <Medal className="w-4 h-4 text-pink-500" /> {entry.sportType.name}
                  </div>
                  <div className="text-xs text-pink-600 flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" /> {entry.location}
                  </div>
                  <div className="text-xs text-pink-500 flex items-center gap-1 mt-1">
                    <Calendar className="w-4 h-4" /> Division: {entry.team.division}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* <Footer /> */}
    </>
  );
}
