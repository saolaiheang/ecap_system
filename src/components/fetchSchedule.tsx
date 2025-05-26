"use client";

import { useEffect, useState, ChangeEvent } from "react";

interface Schedule {
  id: string;
  date: string;
  time: string;
  location: string;
  coach: {
    id: string;
    name: string;
    contact_info:string;
    image:string;
  };
  sportType: {
    id: string;
    name: string;
  };
  team: {
    id: string;
    name: string;
    division: string;
  };
}

interface Coach {
  id: string;
  name: string;
  contact_info:string;
    image:string;
}

interface SportType {
  id: string;
  name: string;
}

interface Team {
  id: string;
  name: string;
  division: string;
}
interface Props {
  sport: string;
}

export default function FetchSchedule({sport}:Props) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [sports, setSports] = useState<SportType[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  const [formData, setFormData] = useState({
    id: "",
    date: "",
    time: "",
    location: "",
    coach_id: "",
    sport_type_id: "",
    team_id: "",
  });

  const getSchedules = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/schedules");
      const json = await res.json();
      setSchedules(json.data || []);
    } catch (err) {
      console.error("Failed to fetch schedules", err);
    } finally {
      setLoading(false);
    }
  };

  const getSportTypes = async () => {
    try {
      const res = await fetch("/api/typeofsport");
      const json = await res.json();
      setSports(json.typeOfSport || []);
    } catch (err) {
      console.error("Failed to fetch sport types", err);
    }
  };

  const getCoachesBySport = async (sportId: string) => {
    try {
      const res = await fetch(`/api/coaches/by-sport/${sportId}`);
      console.log(sportId)
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setCoaches(data.coaches);
    } catch (err) {
      console.error("Failed to fetch coaches", err);
    }
  };

  const getTeamsBySport = async (sportId: string) => {
    try {
      const res = await fetch(`/api/team/by-sport/${sportId}`);
      const json = await res.json();
      setTeams(json.data || []);
    } catch (err) {
      console.error("Failed to fetch teams", err);
    }
  };

  // Fetch sport types and schedules on mount
  useEffect(() => {
    getSportTypes();
    getSchedules();
  }, []);

  // When sport_type_id changes, fetch coach and team
  useEffect(() => {
    if (formData.sport_type_id) {
      getCoachesBySport(formData.sport_type_id);
      getTeamsBySport(formData.sport_type_id);
    } else {
      setCoaches([]);
      setTeams([]);
    }
  }, [formData.sport_type_id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { date, time, location, coach_id, sport_type_id, team_id, id } =
      formData;

    if (!date || !time || !location || !coach_id || !sport_type_id || !team_id) {
      alert("Please fill all fields");
      return;
    }

    const payload = { date, time, location, coach_id, sport_type_id, team_id };

    try {
      const res = await fetch(id ? `/api/schedules/${id}` : "/api/schedules", {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save schedule");

      alert(id ? "Schedule updated" : "Schedule added");

      setFormData({
        id: "",
        date: "",
        time: "",
        location: "",
        coach_id: "",
        sport_type_id: "",
        team_id: "",
      });

      getSchedules();
    } catch (err) {
      console.error(err);
      alert("Error saving schedule");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this schedule?")) return;

    try {
      const res = await fetch(`/api/schedules/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");

      alert("Schedule deleted");
      getSchedules();
    } catch (err) {
      console.error(err);
      alert("Error deleting schedule");
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setFormData({
      id: schedule.id,
      date: schedule.date,
      time: schedule.time,
      location: schedule.location,
      coach_id: schedule.coach.id,
      sport_type_id: schedule.sportType.id,
      team_id: schedule.team.id,
    });
  };


  useEffect(() => {
    if (sport) {
      const sportObj = sports.find(s => s.name === sport);
      if (sportObj) {
        setFormData(prev => ({ ...prev, sport_type_id: sportObj.id }));
      }
    }
  }, [sport, sports]);

  
  return (
    <section className="px-8 py-6 bg-gray-50 min-h-screen">
  <h2 className="text-3xl font-bold text-blue-700 mb-6">📅 Schedule Dashboard</h2>

  {/* Schedule Form */}
  <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 border">
    <h3 className="text-xl font-semibold mb-5 text-gray-800">
      {formData.id ? "✏️ Update Schedule" : "➕ Add New Schedule"}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <select
        name="sport_type_id"
        value={formData.sport_type_id}
        onChange={handleChange}
        className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-300"
      >
        <option value="">🏅 Select Sport</option>
        {sports.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <select
        name="coach_id"
        value={formData.coach_id}
        onChange={handleChange}
        className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-300"
      >
        <option value="">🧑‍🏫 Select Coach</option>
        {coaches.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        name="team_id"
        value={formData.team_id}
        onChange={handleChange}
        className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-300"
      >
        <option value="">👥 Select Team</option>
        {teams.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name} ({t.division})
          </option>
        ))}
      </select>

      <input
        type="text"
        name="date"
        placeholder="📆 Date training"
        value={formData.date}
        onChange={handleChange}
        className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-300"
      />
      <input
        type="time"
        name="time"
        placeholder="⏰ Time training"
        value={formData.time}
        onChange={handleChange}
        className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-300"
      />
      <input
        type="text"
        name="location"
        placeholder="📍 Location"
        value={formData.location}
        onChange={handleChange}
        className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-300"
      />
    </div>
    <div className="mt-6 text-right">
      <button
        onClick={handleSubmit}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-[5px] transition"
      >
        {formData.id ? "Update Schedule" : "Add Schedule"}
      </button>
    </div>
  </div>

  {/* Schedule Table */}
  <div className="overflow-auto bg-white rounded-2xl shadow-lg border border-gray-200">
    {loading ? (
      <p className="text-gray-600 p-4">Loading schedules...</p>
    ) : (
      <table className="min-w-full text-base text-left">
        <thead className="bg-blue-900 text-white text-lg text-center">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Coach</th>
            <th className="px-4 py-3">Sport</th>
            <th className="px-4 py-3">Team</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {schedules.length > 0 ? (
            schedules.map((s, i) => (
              <tr
                key={s.id}
                className="hover:bg-blue-50 transition duration-300 text-center"
              >
                <td className="px-4 py-3 border-t">{i + 1}</td>
                <td className="px-4 py-3 border-t">{s.date}</td>
                <td className="px-4 py-3 border-t">{s.time}</td>
                <td className="px-4 py-3 border-t">{s.location}</td>
                <td className="px-4 py-3 border-t">{s.coach.name}</td>
                <td className="px-4 py-3 border-t">{s.sportType.name}</td>
                <td className="px-4 py-3 border-t">
                  {s.team.name} ({s.team.division})
                </td>
                <td className="px-4 py-3 border-t space-x-2">
                  <button
                    onClick={() => handleEdit(s)}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg shadow"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg shadow"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={8}
                className="text-center p-4 text-gray-500 border-t"
              >
                No schedules found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    )}
  </div>
</section>

  );
}
