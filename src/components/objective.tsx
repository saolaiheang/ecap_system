"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

export default function Objectives() {
  const [isKhmer, setIsKhmer] = useState(false);

  const toggleLanguage = () => setIsKhmer(!isKhmer);

  const titleStyle =
    "text-xl sm:text-2xl font-semibold text-purple-700 mb-2 flex items-center gap-2";

  const textStyle =
    "text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-line";

  return (
    <section className="px-6 md:px-12 lg:px-24 py-16 font-sans bg-gradient-to-br from-white to-purple-50 transition duration-300 ease-in-out select-none">
      <div
        className="max-w-5xl mx-auto text-center cursor-pointer"
        onClick={toggleLanguage}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent drop-shadow mb-8">
          {isKhmer ? "គោលបំណង" : "Objectives"}
        </h1>
        <p className="text-gray-500 italic text-sm mb-10">(Click to switch language)</p>
      </div>

      <div className="max-w-5xl mx-auto space-y-10">
        {/* General Objective */}
        <div>
          <h2 className={titleStyle}>
            <ChevronRight className="w-5 h-5 text-purple-500" />
            {isKhmer ? "គោលបំណងជាទូទៅ" : "General Objective"}
          </h2>
          <p className={textStyle}>
            {isKhmer
              ? "ជាសាលានៃជីវិតដែលផ្តល់អោយលើផ្នែក កីឡា សិល្បះ និងសកម្មភាពកាយរិទ្ធិ តាមរយ:គុណតម្លៃរបស់ PSE  និងផ្សារផ្ជាប់ជាមួយការអប់រំ និងស្មារតីកីឡា។"
              : "Be a school of life by providing sports, arts, and scout activities through PSE values, education and spirit of sport."}
          </p>
        </div>

        {/* Objective 1 */}
        <div>
          <h2 className={titleStyle}>
            <ChevronRight className="w-5 h-5 text-purple-500" />
            {isKhmer ? "គោលបំណងទី ១" : "Objective 1"}
          </h2>
          <p className={textStyle}>
            {isKhmer
              ? "បង្រៀនកីឡា និងសិល្បៈដល់សិស្សរបស់ PSE ដោយផ្សារភ្ជាប់គុណតម្លៃសង្គម និងការអប់រំ។"
              : "Teach sports and art to PSE’s students by associating social value and education."}
          </p>
        </div>

        {/* Objective 2 */}
        <div>
          <h2 className={titleStyle}>
            <ChevronRight className="w-5 h-5 text-purple-500" />
            {isKhmer ? "គោលបំណងទី ២" : "Objective 2"}
          </h2>
          <p className={textStyle}>
            {isKhmer
              ? "ផ្សព្វផ្សាយកម្មវិធីក្លឹប និងរៀបចំផែនការ ដើម្បីធ្វើអោយមានការកើនឡើង ការប្រកួតប្រជែងទាំងខាងក្នុង -ខាងក្រៅ និងព្រឹត្តិការណ៏ក្លឹបផងដែរ។"
              : "Promote clubs and plan to increase the competitions outside-inside and also club events."}
          </p>
        </div>

        {/* Objective 3 */}
        <div>
          <h2 className={titleStyle}>
            <ChevronRight className="w-5 h-5 text-purple-500" />
            {isKhmer ? "គោលបំណងទី ៣" : "Objective 3"}
          </h2>
          <p className={textStyle}>
            {isKhmer
              ? "ផ្តល់សកម្មភាពខាងក្រៅ និងភាពជាអ្នកដឹកនាំដល់សិស្ស ដោយប្រើគុណតម្លៃកាយរឹទ្ធិ។"
              : "To provide outdoor activities and leadership to students by using international scout values."}
          </p>
        </div>
      </div>
    </section>
  );
}
