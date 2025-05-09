"use client";

import { useState, ChangeEvent } from "react";

interface Schedule {
  id: number;
  day: string;
  time: string;
  sport: string;
  U: string; // Age category (e.g., U10, U15)
}

export default function RugbySchedule() {
  const [schedules, setSchedules] = useState<Schedule[]>([
    { id: 1, day: "Monday", time: "16:00", sport: "Football", U: "U10" },
  ]);

  const [formData, setFormData] = useState({
    day: "",
    time: "",
    sport: "",
    U: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSchedule = () => {
    if (!formData.day || !formData.time || !formData.sport || !formData.U) return;

    const newSchedule: Schedule = {
      id: schedules.length + 1,
      ...formData,
    };

    setSchedules([...schedules, newSchedule]);
    setFormData({ day: "", time: "", sport: "", U: "" });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-[#1D276C]">Football Schedule</h2>

      {/* Add Schedule Form */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <input
          type="text"
          name="day"
          placeholder="Day (e.g., Monday)"
          value={formData.day}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="sport"
          placeholder="Sport (e.g., Football)"
          value={formData.sport}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="U"
          placeholder="Age Category (e.g., U10)"
          value={formData.U}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <button
          onClick={handleAddSchedule}
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
        >
          Add Schedule
        </button>
      </div>

      {/* Schedule Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">Day</th>
            <th className="border px-4 py-2">Time</th>
            <th className="border px-4 py-2">Sport</th>
            <th className="border px-4 py-2">U</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => (
            <tr key={schedule.id}>
              <td className="border px-4 py-2">{schedule.id}</td>
              <td className="border px-4 py-2">{schedule.day}</td>
              <td className="border px-4 py-2">{schedule.time}</td>
              <td className="border px-4 py-2">{schedule.sport}</td>
              <td className="border px-4 py-2">{schedule.U}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
