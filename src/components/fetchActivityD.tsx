import React, { useEffect, useState } from "react";

interface Props {
  sport: string;
}

interface Activity {
  id: string;
  title: string;
  date: string;
  description: string;
}

export default function FetchActivityD({ sport }: Props) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // const response = await fetch(`/api/activity?sport=${sport}`);
        // const data = await response.json();
        // setActivities(data.activities || []);
      } catch (error) {
        console.error("Error fetching activity data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [sport]);

  if (loading) {
    return <p className="text-gray-500">Loading activities...</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-[#1D276C] capitalize mb-4">
        {sport} Activities
      </h2>
      {activities.length === 0 ? (
        <p className="text-red-400">No activities found for this sport.</p>
      ) : (
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Description</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id} className="text-sm text-gray-700">
                <td className="px-4 py-2 border">{activity.title}</td>
                <td className="px-4 py-2 border">{activity.date}</td>
                <td className="px-4 py-2 border">{activity.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
