"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "@/components/header";

interface SportType {
  id: string;
  name: string;
  description: string;
  image: string;
}
interface Activities {
  id: string;
  title: string;
  description: string;
  video: string;
}

export default function DetailTypeOfSport() {
  const params = useParams();
  const id = params?.id as string;

  const [sport, setSport] = useState<SportType | null>(null);
  const [activities, setActivities] = useState<Activities[]>([]);
  const [loadingSport, setLoadingSport] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [errorSport, setErrorSport] = useState<string | null>(null);
  const [errorActivities, setErrorActivities] = useState<string | null>(null);

  // Fetch sport detail
  useEffect(() => {
    if (!id) return;

    const fetchSportDetail = async () => {
      setLoadingSport(true);
      setErrorSport(null);
      try {
        const res = await fetch(`/api/typeofsport/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch sport detail");
        }
        const data = await res.json();
        setSport(data.typeOfSport);
      } catch {
        setErrorSport("Failed to load sport detail.");
      } finally {
        setLoadingSport(false);
      }
    };

    fetchSportDetail();
  }, [id]);

  // Fetch activities function (can be called on mount or button click)
  const fetchActivities = async () => {
    if (!id) return;
    setLoadingActivities(true);
    setErrorActivities(null);
    try {
      const res = await fetch(`/api/activities/by-sport/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch activities");
      }
      const data = await res.json();
      setActivities(data);
    } catch {
      setErrorActivities("Failed to load activities.");
      setActivities([]);
    } finally {
      setLoadingActivities(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [id]);

  if (loadingSport) {
    return (
      <div className="p-10 text-center text-gray-500 semibold">Loading sport details...</div>
    );
  }

  if (errorSport || !sport) {
    return (
      <div className="p-10 text-center text-red-500 font-semibold">
        {errorSport || "Sport not found."}
      </div>
    );
  }

  return (
    <>
      <Header />

      <main className="px-6 sm:px-10 md:px-[100px] py-10 max-w-5xl mx-auto text-black font-sans">
        <div className="relative w-full h-64 sm:h-96 mb-6 rounded-xl overflow-hidden">
          <Image
            src={sport.image || "/placeholder.jpg"}
            alt={sport.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          <h1 className="absolute bottom-4 left-4 text-white text-2xl sm:text-4xl font-bold drop-shadow-lg">
            {sport.name}
          </h1>
        </div>

        <p className="text-base sm:text-lg text-gray-800 leading-relaxed whitespace-pre-line">
          {sport.description}
        </p>
      </main>

      <section className="px-6 sm:px-10 md:px-[100px] py-8 max-w-5xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
          Related Activities
        </h2>

        <button
          onClick={fetchActivities}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={loadingActivities}
        >
          {loadingActivities ? "Refreshing..." : "Refresh Activities"}
        </button>

        {loadingActivities ? (
          <p className="text-gray-500 text-center">Loading activities...</p>
        ) : errorActivities ? (
          <p className="text-red-500 text-center">{errorActivities}</p>
        ) : activities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200"
              >
                <div className="aspect-video bg-black">
                  <video
                    controls
                    className="w-full h-full object-cover"
                    src={activity.video}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">
                    {activity.title}
                  </h3>
                  <p className="text-gray-700 text-sm">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-base italic text-center">No activities available.</p>
        )}
      </section>
    </>
  );
}
