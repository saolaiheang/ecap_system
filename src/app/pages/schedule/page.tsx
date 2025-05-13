"use client";

import Header from "@/components/header";

export default function SchedulePage() {
  const schedule = [
    { day: "Monday", sport: "Football", time: "08:00 - 10:00Am", coach: "Coach Monika" },
    { day: "Monday", sport: "Swimming", time: "14:00 - 15:30", coach: "Coach Dara" },
    { day: "Tuesday", sport: "Basketball", time: "09:00 - 10:30", coach: "Coach Lina" },
    { day: "Tuesday", sport: "Running", time: "16:00 - 17:00", coach: "Coach Vuthy" },
    { day: "Wednesday", sport: "Boxing", time: "10:00 - 11:30", coach: "Coach Sophal" },
    { day: "Wednesday", sport: "Yoga", time: "17:00 - 18:30", coach: "Coach Sreyneang" },
    { day: "Thursday", sport: "Tennis", time: "08:00 - 09:30", coach: "Coach Rith" },
    { day: "Thursday", sport: "Volleyball", time: "15:00 - 16:30", coach: "Coach Dany" },
    { day: "Friday", sport: "Badminton", time: "10:00 - 11:00", coach: "Coach Rina" },
    { day: "Friday", sport: "Cycling", time: "17:30 - 19:00", coach: "Coach Chan" },
    { day: "Saturday", sport: "Karate", time: "09:00 - 10:30", coach: "Coach Sovann" },
    { day: "Sunday", sport: "Table Tennis", time: "13:00 - 14:30", coach: "Coach Sitha" },
  ];

  return (
    <>
    <Header/>
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-purple-700 text-center">Weekly Sports Schedule</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow overflow-hidden">
          <thead>
            <tr className="bg-purple-200 text-purple-800 text-left text-sm uppercase tracking-wider">
              <th className="px-6 py-3">Day</th>
              <th className="px-6 py-3">Sport</th>
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3">Coach</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
            {schedule.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium">{item.day}</td>
                <td className="px-6 py-4">{item.sport}</td>
                <td className="px-6 py-4">{item.time}</td>
                <td className="px-6 py-4">{item.coach}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}
