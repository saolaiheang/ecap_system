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
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8 border border-gray-300 rounded p-4 bg-gray-50">
        <h3 className="font-semibold mb-4">
          {formData.id ? "Update Schedule" : "Add New Schedule"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select
            name="sport_type_id"
            value={formData.sport_type_id}
            onChange={handleChange}
            className="border p-3 rounded text-base"
          >
            <option value="">Select Sport</option>
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
            className="border p-3 rounded text-base"
          >
            <option value="">Select Coach</option>
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
            className="border p-3 rounded text-base"
          >
            <option value="">Select Team</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.division})
              </option>
            ))}
          </select>

          <input
            type="text"
            name="date"
            placeholder="Date training"

            value={formData.date}
            onChange={handleChange}
            className="border p-3 rounded text-base"
          />
          <input
            type="time"
            name="time"
            placeholder="Time training"

            value={formData.time}
            onChange={handleChange}
            className="border p-3 rounded text-base"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="border p-3 rounded text-base"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="bg-[#1D276C] hover:bg-[#152057] text-white font-semibold px-6 py-2 rounded"
        >
          {formData.id ? "Update Schedule" : "Add Schedule"}
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-gray-600">Loading schedules...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Time</th>
                <th className="border px-4 py-2">Location</th>
                <th className="border px-4 py-2">Coach</th>
                <th className="border px-4 py-2">Sport</th>
                <th className="border px-4 py-2">Team</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((s, i) => (
                <tr key={s.id}>
                  <td className="border px-4 py-2 text-center">{i + 1}</td>
                  <td className="border px-4 py-2 text-center">{s.date}</td>
                  <td className="border px-4 py-2 text-center">{s.time}</td>
                  <td className="border px-4 py-2">{s.location}</td>
                  <td className="border px-4 py-2 text-center">{s.coach.name}</td>
                  <td className="border px-4 py-2 text-center">{s.sportType.name}</td>
                  <td className="border px-4 py-2 text-center">
                    {s.team.name} ({s.team.division})
                  </td>
                  <td className="border px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(s)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {schedules.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center p-4 text-gray-500">
                    No schedules found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
