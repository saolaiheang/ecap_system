"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HeaderAdminPage from "@/components/headerAdmin";
import FootballProfile from "@/components/footballProfile";
import FootballSchedule from "@/components/footballSchedule";
import FootballMatch from "@/components/footballMatch";
import {
  FaUser,
  FaChevronDown,
  FaCalendarAlt,
  FaUsers,
  FaNewspaper,
  FaHistory,
  FaChartLine,
} from "react-icons/fa";
import FootballNews from "@/components/footballNews";
import FootballActivity from "@/components/footballActivity";
import BasketballProfile from "@/components/basketballProfile";
import VolleyballProfile from "@/components/volleyballProfile";
import RugbyProfile from "@/components/rugbyProfile";
import HockeyProfile from "@/components/hockeyProfile";
import VolleyballSchedule from "@/components/volleyballShedule";
import BasketballSchedule from "@/components/basketballShedule";
import RugbySchedule from "@/components/rugbyShedule";
import VolleyballMatch from "@/components/volleyballMatch";
import BasketballMatch from "@/components/basketballMatch";
import RugbyMatch from "@/components/rugbyMatch";
import HockeyMatch from "@/components/hockeyMatch";
import HockeyActivity from "@/components/hockeyAcitvity";
import RugbyActivity from "@/components/rugbyActivity";
import BasketballActivity from "@/components/basketballActitivity";
import VolleyballActivity from "@/components/volleyballActivity";
import HockeyNews from "@/components/hockeyNews";
import RugbyNews from "@/components/rugbyNews";
import BasketballNews from "@/components/basketballNews";
import VolleyballNews from "@/components/volleyballNews";

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
    profile: false,
    schedule: false,
    match: false,
    news: false,
    history: false,
    activity: false,
  });

  const [selectedContent, setSelectedContent] = useState("dashboard");

  const toggleMenu = (key: string) => {
    setOpenMenus({ ...openMenus, [key]: !openMenus[key] });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <HeaderAdminPage />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-[#2C357C] text-white flex flex-col py-4 px-2 shadow-lg">
          {[
            { label: "History", icon: <FaHistory />, key: "history" },
            { label: "Profile", icon: <FaUser />, key: "profile" },
            { label: "Schedule", icon: <FaCalendarAlt />, key: "schedule" },
            { label: "Match", icon: <FaUsers />, key: "match" },
            { label: "News", icon: <FaNewspaper />, key: "news" },
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
                  <p
                    className="py-1 cursor-pointer hover:underline"
                    onClick={() => setSelectedContent(`${item.key}-football`)}
                  >
                    Football
                  </p>
                  <p
                    className="py-1 cursor-pointer hover:underline"
                    onClick={() => setSelectedContent(`${item.key}-volleyball`)}
                  >
                  Volleyball
                  </p>
                  <p
                    className="py-1 cursor-pointer hover:underline"
                    onClick={() => setSelectedContent(`${item.key}-basketball`)}
                  >
                    Basketball
                  </p>
                  <p
                    className="py-1 cursor-pointer hover:underline"
                    onClick={() => setSelectedContent(`${item.key}-rugby`)}
                  >
                    Rugby
                  </p>
                  <p
                    className="py-1 cursor-pointer hover:underline"
                    onClick={() => setSelectedContent(`${item.key}-hockey`)}
                  >
                    Hockey
                  </p>
                </div>
              )}
            </div>
          ))}
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 bg-white">
          {/* {selectedContent === "dashboard" && (
            <>
              <h2 className="text-2xl font-semibold text-[#1D276C]">
                Welcome to Dashboard
              </h2>
              <p className="text-gray-600 mt-2">This is your content area.</p>
            </>
          )} */}

          {selectedContent === "profile-football" && <FootballProfile/>}
          {selectedContent === "profile-volleyball" && <VolleyballProfile />}
          {selectedContent === "profile-basketball" && <BasketballProfile />}
          {selectedContent === "profile-rugby" && <RugbyProfile />}
          {selectedContent === "profile-hockey" && <HockeyProfile />}

          {selectedContent === "schedule-football" && <FootballSchedule />}
          {selectedContent === "schedule-volleyball" && <VolleyballSchedule />}
          {selectedContent === "schedule-basketball" && <BasketballSchedule />}
          {selectedContent === "schedule-rugby" && <RugbySchedule />}
          {selectedContent === "schedule-hockey" && <RugbySchedule />}

          {selectedContent === "match-football" && <FootballMatch />}
          {selectedContent === "match-volleyball" && <VolleyballMatch />}
          {selectedContent === "match-basketball" && <BasketballMatch />}
          {selectedContent === "match-rugby" && <RugbyMatch />}
          {selectedContent === "match-hockey" && <HockeyMatch />}

          {selectedContent === "activity-football" && <FootballActivity />}
          {selectedContent === "activity-volleyball" && <VolleyballActivity />}
          {selectedContent === "activity-basketball" && <BasketballActivity />}
          {selectedContent === "activity-rugby" && <RugbyActivity />}
          {selectedContent === "activity-hockey" && <HockeyActivity />}

          {selectedContent === "news-football" && <FootballNews />}
          {selectedContent === "news-volleyball" && <VolleyballNews />}
          {selectedContent === "news-basketball" && <BasketballNews />}
          {selectedContent === "news-rugby" && <RugbyNews />}
          {selectedContent === "news-hockey" && <HockeyNews />}





{/* 
          {selectedContent !== "dashboard" &&
            selectedContent !== "profile-football" && (
              <>
                <h2 className="text-2xl font-semibold text-[#1D276C] capitalize">
                  {selectedContent.replaceAll("-", " ")}
                </h2>
                <p className="text-gray-600 mt-2">
                  This is the <strong>{selectedContent}</strong> section.
                </p>
              </>
            )} */}

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition mt-4"
          >
            Logout
          </button>
        </main>
      </div>
    </div>
  );
}
