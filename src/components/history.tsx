"use client";

export default function HistorySection() {
  const items = [
    {
      year: "2019",
      text: "The mission of sport is to promote physical health, mental strength, and social development among individuals of all ages. Sport encourages fair play, respect, and teamwork.",
      image: "/image-placeholder.png",
    },
    {
      year: "2020",
      text: "Sports initiatives expanded across the country, focusing on youth engagement and gender inclusion through school-based programs and community events.",
      image: "/image-placeholder.png",
    },
    {
      year: "2021",
      text: "A new national program for sports leadership and coaching was launched, empowering young people to lead teams and build character through football and volleyball.",
      image: "/image-placeholder.png",
    },
  ];

  return (
    <section className="bg-white px-6 md:px-20 py-16">
      <h2 className="text-4xl text-orange-500 font-bold text-center mb-16">
        Our Journey
      </h2>

      <div className="relative border-l-4 border-orange-500 pl-6">
        {items.map((item, i) => (
          <div key={i} className="mb-16 relative">
            {/* Year */}
            <div className="absolute -left-10 top-0 bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md">
              {item.year.slice(-2)}
            </div>

            {/* Content block */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md md:flex md:items-center gap-6">
              <img
                src={item.image}
                alt={`History ${item.year}`}
                className="w-full md:w-[220px] h-[140px] object-cover rounded"
              />

              <div className="mt-4 md:mt-0">
                <h3 className="text-2xl font-semibold text-orange-500 mb-2">
                  {item.year}
                </h3>
                <p className="text-gray-700 leading-relaxed">{item.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
