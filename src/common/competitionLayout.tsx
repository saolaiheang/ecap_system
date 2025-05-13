"use client";

import Image from "next/image";
import { Button } from "@/components/button";
export default function CompetitionLayout() {
  const competitions = [
    {
      title: "National Football Cup 2025",
      description:
        "Join the biggest football event of the year! Teams from all over the country will compete for the championship.",
      date: "June 15, 2025",
      location: "Phnom Penh National Stadium",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/d/d7/Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_%28cropped%29.jpg",
      link: "/competitions/national-cup",
    },
    {
      title: "Youth League Championship",
      description:
        "An exciting opportunity for young players under 14 to showcase their talent in a competitive environment.",
      date: "July 1, 2025",
      location: "Siem Reap Sports Center",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUHcjqBOyh-1f-k7ArZYB1-_n5Yhlrlor69A&s",
      link: "/competitions/youth-league",
    },
  ];

  return (
    <section className="px-8 py-6">
      <h2 className="text-3xl font-bold text-orange-500 mb-6">
        🏆 Competition Announcements
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {competitions.map((comp, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
          >
            <img
              src={comp.image}
              alt={comp.title}
              width={800}
              height={400}
              className="w-full h-56 object-cover"
            />
            <div className="p-5 space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">
                {comp.title}
              </h3>
              <p className="text-gray-600">{comp.description}</p>
              <p className="text-sm text-gray-500">
                📅 {comp.date} | 📍 {comp.location}
              </p>
              <Button
                variant="primary"
                onClick={() => window.location.href = comp.link}
              >
                Learn More
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
