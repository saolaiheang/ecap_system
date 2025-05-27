"use client";

import { useState } from "react";

export default function Mission() {
  const [isKhmer, setIsKhmer] = useState(false);

  const toggleLanguage = () => {
    setIsKhmer(!isKhmer);
  };

  return (
    <section className="py-20 px-6 md:px-12 lg:px-24 cursor-pointer select-none" onClick={toggleLanguage}>
      <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent drop-shadow mb-8">
          {isKhmer ? "បេសកកម្ម" : "Mission"}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed transition duration-300 ease-in-out">
          {isKhmer
            ? "ផ្តល់កម្មវិធីកីឡា សិល្បៈ និងកាយរឹទ្ធិដល់សិស្ស PSE ដើម្បីជួយពង្រឹងផ្លូវកាយ អោយរឹងមាំ និងផ្លូវចិត្តអោយកាន់តែប្រសើរឡើង។"
            : "Provide sport, art, and scout to PSE students in order to make the progression of their physical and mentality."}
        </p>
        <p className="mt-4 text-sm text-gray-400 italic">
          (Click to switch language)
        </p>
      </div>
    </section>
  );
}
