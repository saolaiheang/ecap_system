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
    const confirmDelete = confirm(
      "Are you sure you want to delete this activity?"
    );
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

      await fetchActivityD();
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
    <div className="px-8 py-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">
        Activities by Sport
      </h2>

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <label className="text-sm font-medium">Select a Sport:</label>
          <select
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Create New Activity
        </button>
      </div>

      {showCreateForm && (
        <form
          onSubmit={handleSubmitActivity}
          className="mb-6 p-6 border border-gray-300 rounded-xl shadow-md bg-white"
        >
          <h3 className="text-xl font-semibold mb-4">
            {editActivity ? "Update Activity" : "Add New Activity"}
          </h3>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newActivity.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newActivity.description}
              onChange={handleChange}
              required
              rows={4}
            />
          </div>

          {/* Upload Video */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Video
            </label>
            <input
              name="video"
              type="file"
              accept="video/*"
              required={!editActivity}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gray-600 file:text-white hover:file:bg-gray-700"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
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
              className="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Loading activities...</p>
      ) : activities.length === 0 ? (
        <p className="text-red-400">No activities found for this sport.</p>
      ) : (
        <div className="overflow-auto bg-white rounded-2xl shadow-lg border border-gray-200">
          <table className="min-w-full text-base text-left border-collapse border border-gray-300">
            <thead className="bg-blue-900 text-white text-lg text-center">
              <tr>
                <th className="px-6 py-4">No</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Video</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.length > 0 ? (
                activities.map((activity, index) => (
                  <tr
                    key={activity.id}
                    className="text-center hover:bg-blue-50 transition duration-300"
                  >
                    <td className=" px-6 py-4">{index + 1}</td>

                    <td className="px-6 py-4">{activity.title}</td>
                    <td className="px-6 py-4">{activity.description}</td>
                    <td className="px-6 py-4">
                      <a
                        href={activity.video}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        Watch Video
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => handleEditClick(activity)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow text-sm"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDeleteClick(activity.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    No activities available.
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
