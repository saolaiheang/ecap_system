import React, { ChangeEvent, useEffect, useState } from "react";

interface Activity {
  id: string;
  title: string;
  description: string;
  video: string;
}

interface Sport {
  id: string;
  name: string;
  description?: string;
  image: string;
}

export default function FetchActivityD() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [sports, setSports] = useState<Sport[] | null>(null);
  const [selectSport, setSelectSport] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editActivity, setEditActivity] = useState<Activity | null>(null);

  const [newActivity, setNewActivity] = useState<{
    title: string;
    description: string;
    video: File | null;
  }>({
    title: "",
    description: "",
    video: null,
  });

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const res = await fetch("/api/typeofsport");
        const data = await res.json();
        if (data && Array.isArray(data.typeOfSport)) {
          setSports(data.typeOfSport);
        } else {
          console.error("Invalid response structure:", data);
          setSports([]);
        }
      } catch (err) {
        console.error("Failed to fetch sports", err);
        setSports([]);
      }
    };
    fetchSports();
  }, []);

  
    const fetchActivityD = async () => {
      if (!selectSport) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/activities/by-sport/${selectSport}`);
        const data = await res.json();
        if (data && Array.isArray(data)) {
          setActivities(data);
        } else {
          setActivities([]);
        }
      } catch (err) {
        console.error("Failed to fetch activities", err);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };
   

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
      const file = e.target.files ? e.target.files[0] : null;
      setNewActivity((prev) => ({ ...prev, video: file }));
    } else {
      setNewActivity((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDeleteClick = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this activity?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/activities/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete activity");

      setActivities((prev) => prev.filter((activity) => activity.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete the activity.");
    }
  };

  const handleSubmitActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectSport) {
      alert("Please select a sport first.");
      return;
    }

    const formData = new FormData();
    formData.append("title", newActivity.title);
    formData.append("description", newActivity.description);
    if (newActivity.video) {
      formData.append("video", newActivity.video);
    }
    formData.append("sport_id", selectSport);

    const isUpdating = !!editActivity;

    try {
      const res = await fetch(
        isUpdating
          ? `/api/activities/${editActivity?.id}`
          : `/api/activities/by-sport/${selectSport}`,
        {
          method: isUpdating ? "PUT" : "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Failed to submit activity");

      const result = await res.json();

      if (isUpdating) {
        setActivities((prev) =>
          prev.map((a) => (a.id === result.id ? result : a))
        );
      

      } else {
        setActivities((prev) => [...prev, result]);
      }

     await fetchActivityD()
    } catch (err) {
      console.error(err);
      alert("Something went wrong while submitting the activity.");
    }
  };

  const handleEditClick = (activity: Activity) => {
    setEditActivity(activity);
    setNewActivity({
      title: activity.title,
      description: activity.description,
      video: null,
    });
    setShowCreateForm(true);
  };

  useEffect(() => {
    fetchActivityD();
  }, [selectSport]);
  

  return (
    <div>
      <h2 className="text-xl font-semibold text-[#1D276C] capitalize mb-4">
        Activities by Sport
      </h2>

      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium">Select a Sport:</label>
        <select
          className="border border-gray-300 rounded px-3 py-2"
          value={selectSport}
          onChange={(e) => setSelectSport(e.target.value)}
        >
          <option value="">-- Choose a sport --</option>
          {sports?.map((sport) => (
            <option key={sport.id} value={sport.id}>
              {sport.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() => {
          setShowCreateForm(true);
          setEditActivity(null);
          setNewActivity({ title: "", description: "", video: null });
        }}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Create New Activity
      </button>

      {showCreateForm && (
        <form
          onSubmit={handleSubmitActivity}
          className="mb-6 p-4 border border-gray-300 rounded shadow"
        >
          <h3 className="text-lg font-semibold mb-2">
            {editActivity ? "Update Activity" : "Add New Activity"}
          </h3>

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              className="w-full border px-3 py-2 rounded"
              value={newActivity.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              className="w-full border px-3 py-2 rounded"
              value={newActivity.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Upload Video</label>
            <input
              name="video"
              className="w-full border px-3 py-2 rounded"
              type="file"
              accept="video/*"
              required={!editActivity}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            {editActivity ? "Update" : "Submit"}
          </button>

          <button
        type="button"
        onClick={() => {
          setShowCreateForm(false);
          setNewActivity({ title: "", description: "", video: null });
          setEditActivity(null);
        }}
        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
      >
        Cancel
      </button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Loading activities...</p>
      ) : activities.length === 0 ? (
        <p className="text-red-400">No activities found for this sport.</p>
      ) : (
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Video</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id} className="text-sm text-gray-700">
                <td className="px-4 py-2 border">{activity.title}</td>
                <td className="px-4 py-2 border">{activity.description}</td>
                <td className="px-4 py-2 border">
                  <a
                    href={activity.video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Watch Video
                  </a>
                </td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleEditClick(activity)}
                    className="text-sm text-white bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteClick(activity.id)}
                    className="text-sm text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
