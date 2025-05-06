"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";


const coachData = [
    {
        name: "Sorn Monika",
        gender: "Female",
        sport: "Football",
        image: "/image/b.jpg", 
    },
    {
        name: "Sorn Monika",
        gender: "Female",
        sport: "Football",
        image: "/sports4.jpg", 
    },
    {
        name: "Sorn Monika",
        gender: "Female",
        sport: "Football",
        image: "/sports4.jpg", 
    },
    {
        name: "Sorn Monika",
        gender: "Female",
        sport: "Football",
        image: "/sports4.jpg", 
    },
    {
        name: "Sorn Monika",
        gender: "Female",
        sport: "Football",
        image: "/sports4.jpg", 
    },

  
];

export default function Player() {
    return (
        <section className="px-8 py-6">

      <h2 className="text-3xl font-bold text-orange-500 mb-4">Player</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-[30px] h-[350px]">
        {coachData.map((coach, i) => (
          <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden text-center">
            <Image
              src={coach.image}
              alt={coach.name}
              width={300}
              height={200}
              className="w-full h-50 object-cover"
            />
            <div className="p-5 text-sm text-left">
              <p><strong className="text-xl">Name:</strong> {coach.name}</p>
              <p><strong className="text-xl">Gender:</strong> {coach.gender}</p>
              <p><strong className="text-xl">Sport:</strong> {coach.sport}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
    );
}