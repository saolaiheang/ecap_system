"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface SportType {
  id: string;
  name: string;
  description: string;
  image: string;
}

export default function TypesOfSport() {
  const [sports, setSports] = useState<SportType[]>([]);
  const [showAll, setShowAll] = useState(false);

  const displayedSports = showAll ? sports : sports.slice(0, 4);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const res = await fetch("/api/typeofsport");
        const data = await res.json();
        if (Array.isArray(data.typeOfSport)) {
          setSports(data.typeOfSport);
        } else {
          console.error("Unexpected data format", data);
        }
      } catch (error) {
        console.error("Failed to fetch types of sport:", error);
      }
    };

    fetchSports();
  }, []);

  return (
    <section className="px-[200px] py-6 bg-blue-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-900 tracking-tight">
          Types of Sport
        </h1>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-blue-600 hover:text-blue-800 transition duration-200 font-semibold underline-offset-4 hover:underline"
        >
          {showAll ? "Show less" : "See all"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {displayedSports.map((sport) => (
          <div
            key={sport.id}
            className="relative rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 group"
          >
            <img
              src={sport.image}
              alt={sport.name}
              width={300}
              height={200}
              className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition duration-300"></div>
            <div className="absolute bottom-0 p-4 text-white">
              <h2 className="text-[25px] font-bold">{sport.name}</h2>
              <p className="text-[17px] mt-1 group-hover:text-blue-100 hover:font-bold transition">
                {sport.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
