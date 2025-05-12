// src/app/pages/adminpage/page.tsx
'use client';

import { useEffect, useState } from 'react';

interface Sport {
  id: number;
  name: string;
}

export default function AdminPage() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await fetch('/api/typeofsport');
        const data = await response.json();
        setSports(data);
      } catch (error) {
        console.error('Failed to fetch sports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSports();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Types of Sport</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="list-disc ml-5">
          {sports.map((sport) => (
            <li key={sport.id}>{sport.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
