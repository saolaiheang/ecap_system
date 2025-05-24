"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface CoachInput {
  id: string;
  name: string;
  contact_info: string;
  image: string;
  sport: {
    name: string;
    image: string | null;
  };
  team: {
    name: string;
    division: string;
    image: string | null;
  };
}

export default function Coach() {
  const [coaches, setCoaches] = useState<CoachInput[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const res = await fetch("/api/coaches");
        if (!res.ok) throw new Error("Failed to fetch coaches");

        const data = await res.json();
        let coachList: CoachInput[] = [];

        if (Array.isArray(data)) {
          coachList = data;
        } else if (Array.isArray(data?.data)) {
          coachList = data.data;
        } else if (
          typeof data === "object" &&
          data !== null &&
          Object.keys(data).length &&
          Array.isArray(Object.values(data)[0])
        ) {
          coachList = Object.values(data)[0] as CoachInput[];
        } else {
          console.warn("Unexpected API format:", data);
        }

        setCoaches(coachList);
      } catch (err) {
        console.error("Failed to fetch coach:", err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  // Scroll left and right handlers
  const scrollByAmount = 300;

  const handleScrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: scrollByAmount, behavior: "smooth" });
    }
  };

  if (loading)
    return (
      <p className="px-6 py-6 text-blue-600 text-lg font-medium">
        Loading coaches...
      </p>
    );
  if (error) return <p className="px-6 py-6 text-red-500">{error}</p>;

  return (
    <section className="lg:px-[150px] px-6 sm:px-10 md:px-16 py-12 font-sans">
      <h2 className="lg:text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent drop-shadow-lg mb-10">
        Meet Our Coaches
      </h2>

      {!coaches.length && (
        <p className="text-center text-red-500 text-lg font-medium">
          No coaches to display
        </p>
      )}

      <div className="relative">
        {/* Left Scroll Button */}
        <button
          onClick={handleScrollLeft}
          aria-label="Scroll Left"
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-pink-500 to-purple-700 text-white rounded-full p-3 shadow-lg z-10 hover:bg-white-500 transition"
        >
          ◀
        </button>

        {/* Scrollable container */}
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {coaches.map((coach) => (
            <div
              key={coach.id}
              className="flex-shrink-0 w-72 bg-black/80 rounded-3xl shadow-md border border-gray-100 group hover:shadow-xl transition duration-300 scroll-snap-align-start text-white"
            >
              <div className="relative h-[260px] w-full overflow-hidden rounded-t-3xl">
                <Image
                  src={coach.image || "https://via.placeholder.com/300x300"}
                  alt={coach.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="p-5 space-y-2">
                <p className="text-lg font-semibold">{coach.name}</p>
                <p className="text-sm text-white hover:font-bold font-medium">
                  🏅 Sport: {coach.sport?.name}
                </p>
                <p className="text-sm text-white hover:font-bold">
                  🎯 Division: {coach.team?.division}
                </p>
                <p className="text-sm text-white hover:font-bold">
                  📞 {coach.contact_info || "No contact info"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={handleScrollRight}
          aria-label="Scroll Right"
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-pink-500 to-purple-700 text-white rounded-full p-3 shadow-lg z-10 hover:bg-blue-700 transition"
        >
          ▶
        </button>
      </div>

      <style >{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
