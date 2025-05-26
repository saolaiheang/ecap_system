"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-600 text-white py-6 px-4  bottom-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-center md:text-left">
           <span className="font-semibold"></span> Extracurricular Activity Program

        </p>

        <div className="flex gap-4 text-sm">
          {/* <a href="#" className="hover:underline hover:text-pink-300 transition duration-200">Privacy Policy</a>
          <a href="#" className="hover:underline hover:text-pink-300 transition duration-200">Terms</a> */}
          {/* <div className="hover:underline hover:text-pink-300 transition duration-200">Contact</div> */}
          <p className="text-sm text-center md:text-left">
           <span className="font-semibold">Develop By:</span> Sao Laiheang & Sorn Monika

        </p>
        </div>
      </div>
    </footer>
  );
}
