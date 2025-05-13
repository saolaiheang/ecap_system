"use client";

import { useState, useEffect } from "react";
import { Button } from "./button";



interface Competition {
  id: string;
  name: string;
  date: string;
  location: string;
  type: string;
}

export default function CompetitionD() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fake data fetch (replace with actual API later)
  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        // Simulate API delay
        await new Promise((r) => setTimeout(r, 500));

        const data: Competition[] = [
          {
            id: "1",
            name: "Youth League",
            date: "2025-07-01",
            location: "Phnom Penh",
            type: "Football",
          },
          {
            id: "2",
            name: "National Cup",
            date: "2025-09-15",
            location: "Siem Reap",
            type: "Football",
          },
        ];

        setCompetitions(data);
      } catch (err) {
        setError("Failed to load competitions.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  if (loading) return <p className="px-8 py-6">Loading competitions...</p>;
  if (error) return <p className="px-8 py-6 text-red-500">{error}</p>;

  return (
    <section className="px-8 py-6">
      <h2 className="text-3xl font-bold text-blue-600 mb-4">Competition Dashboard</h2>

      <div className="flex justify-end mb-4">
        <Button className="bg-blue-500 text-white hover:bg-blue-600">
          + Add Competition
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full text-sm bg-white border border-gray-200">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Date</th>
              <th className="px-4 py-2 border-b">Location</th>
              <th className="px-4 py-2 border-b">Type</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {competitions.map((comp) => (
              <tr key={comp.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{comp.name}</td>
                <td className="px-4 py-2 border-b">{comp.date}</td>
                <td className="px-4 py-2 border-b">{comp.location}</td>
                <td className="px-4 py-2 border-b">{comp.type}</td>
                <td className="px-4 py-2 border-b">
                  <Button className="bg-yellow-500 text-xs text-white mr-2 hover:bg-yellow-600">
                    Edit
                  </Button>
                  <Button className="bg-red-500 text-xs text-white hover:bg-red-600">
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
