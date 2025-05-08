
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import HeaderAdminPage from "@/components/headerAdmin";

import { useState } from "react";
import {
  FaUser,
  FaChevronDown,
  FaCalendarAlt,
  FaUsers,
  FaNewspaper,
  FaHistory,
  FaChartLine,
} from "react-icons/fa";

export default function DashboardLayout() {

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/pages/login");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/pages/login");
  };

  const [openMenus, setOpenMenus] = useState({
    schedule: false,
    match: false,
    news: false,
    history: false,
    activity: false,
  });

  const toggleMenu = (key: string) => {
    setOpenMenus({ ...openMenus, [key]: !openMenus[key] });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <HeaderAdminPage/>
     
      {/* <div className="flex justify-between items-center h-16 bg-[#1D276C] text-white px-6 shadow-md">
        <img src="/image/pseLogo.png" alt="PSE Logo" className="h-12" />
        <div className="flex items-center gap-2">
          <img
            src="/image/avatar.png"
            alt="Admin Avatar"
            className="w-10 h-10 rounded-full border border-white"
          />
          <span>Admin</span>
        </div>
      </div> */}

      <div className="flex flex-1">

        <aside className="w-64 bg-[#2C357C] text-white flex flex-col py-4 px-2 shadow-lg">

          <div className="flex items-center px-3 py-3 mb-2 hover:bg-[#1e2560] rounded cursor-pointer">
            <FaUser className="mr-3" />
            <span className="text-sm">Profile</span>
            <FaChevronDown className="ml-auto" />
          </div>

          {[
            { label: "Schedule", icon: <FaCalendarAlt />, key: "schedule" },
            { label: "Match", icon: <FaUsers />, key: "match" },
            { label: "News", icon: <FaNewspaper />, key: "news" },
            { label: "History", icon: <FaHistory />, key: "history" },
            { label: "Activity", icon: <FaChartLine />, key: "activity" },
          ].map((item) => (
            <div key={item.key}>
              <button
                onClick={() => toggleMenu(item.key)}
                className="flex items-center w-full px-3 py-3 text-sm hover:bg-[#e66dbd] rounded transition"
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
                <FaChevronDown
                  className={`ml-auto transition-transform ${
                    openMenus[item.key] ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openMenus[item.key] && (
                <div className="bg-[#3b478f] ml-10 mt-1 text-xs p-2 rounded">
                  <p className="py-1">Sub Item 1</p>
                  <p className="py-1">Sub Item 2</p>
                </div>
              )}
            </div>
          ))}
        </aside>

        <main className="flex-1 p-6 bg-white">
          <h2 className="text-2xl font-semibold text-[#1D276C]">
            Welcome to Dashboard
          </h2>
          <p className="text-gray-600 mt-2">This is your content area.</p>
          <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
        </main>
      </div>
    </div>
  );
}
