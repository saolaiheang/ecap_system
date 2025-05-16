
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import HeaderAdminPage from "@/components/headerAdmin";
import {
  FaUser,
  FaChevronDown,
  FaCalendarAlt,
  FaUsers,
  FaNewspaper,
  FaHistory,
  FaChartLine,
} from "react-icons/fa";
import FetchNews from "@/components/fetchnews";
import FetchActivityD from "@/components/fetchActivityD";
import ProfileDashboard from "@/components/fetchprofileD";
import FetchProfileCoach from "@/components/fetchProfileCoachD";
import { FC } from "react";

interface Sport {
  id: string;
  name: string;
  description?: string;
}

interface CommonProps {
  sport: string;
}

// Unified interface for component props
interface FetchNewsProps extends CommonProps {}
interface FetchActivityDProps extends CommonProps {}
interface ProfileDashboardProps extends CommonProps {}
interface FetchProfileCoachProps extends CommonProps {}

// Wrapper components with proper typing
const FetchNewsWrapper: FC<FetchNewsProps> = ({ sport }) => {
  return <FetchNews sport={sport} />;
};

const FetchActivityDWrapper: FC<FetchActivityDProps> = ({ sport }) => {
  return <FetchActivityD sport={sport} />;
};

const ProfileDashboardWrapper: FC<ProfileDashboardProps> = ({ sport }) => {
  return <ProfileDashboard sport={sport} />;
};


const FetchProfileCoachWrapper: FC<FetchProfileCoachProps> = ({ sport }) => {
  return <FetchProfileCoach sport={sport} />;
};

export default function DashboardLayout() {
  const router = useRouter();

  // Type for menu keys
  type MenuKey = "profile" | "schedule" | "match" | "news" | "history" | "activity" | "types";

  // State management
  const [openMenus, setOpenMenus] = useState<Record<MenuKey, boolean>>({
    profile: false,
    schedule: false,
    match: false,
    news: false,
    history: false,
    activity: false,
    types: false,
  });
  const [selectedContent, setSelectedContent] = useState<string>("dashboard");
  const [sports, setSports] = useState<Sport[]>([]);
  const [loadingSports, setLoadingSports] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/pages/login");
    }
  }, [router]);

  // Fetch sports data
  useEffect(() => {
    const fetchSports = async () => {
      try {
        setLoadingSports(true);
        const response = await fetch("/api/typeofsport");
        if (!response.ok) {
          throw new Error("Failed to fetch sports");
        }
        const data = await response.json();
        const typeOfSport = data?.typeOfSport;
        setSports(Array.isArray(typeOfSport) ? typeOfSport : []);
      } catch (error) {
        console.error("Failed to fetch sports:", error);
        setError("Failed to load sports data");
      } finally {
        setLoadingSports(false);
      }
    };

    fetchSports();
  }, []);

  // Handlers
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    router.push("/pages/login");
  }, [router]);

  const toggleMenu = useCallback((key: MenuKey) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const sidebarSections: { label: string; icon: JSX.Element; key: MenuKey }[] = [
    { label: "History", icon: <FaHistory />, key: "history" },
    { label: "Profile", icon: <FaUser />, key: "profile" },
    { label: "Schedule", icon: <FaCalendarAlt />, key: "schedule" },
    { label: "Match", icon: <FaUsers />, key: "match" },
    { label: "News", icon: <FaNewspaper />, key: "news" },
    { label: "Activity", icon: <FaChartLine />, key: "activity" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <HeaderAdminPage />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-[#2C357C] text-white flex flex-col py-4 px-2 shadow-lg">
          {sidebarSections.map((item) => (
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
                  {item.key === "profile" ? (
                    <>
                      <p
                        className="py-1 cursor-pointer hover:underline"
                        onClick={() => setSelectedContent("profile-player")}
                      >
                        Player
                      </p>
                      <p
                        className="py-1 cursor-pointer hover:underline"
                        onClick={() => setSelectedContent("profile-coach")}
                      >
                        Coach
                      </p>
                    </>
                  ) : error ? (
                    <p className="text-red-300">{error}</p>
                  ) : loadingSports ? (
                    <p className="text-white">Loading...</p>
                  ) : sports.length > 0 ? (
                    sports.map((sport) => (
                      <p
                        key={`${item.key}-${sport.id}`}
                        className="py-1 cursor-pointer hover:underline"
                        onClick={() =>
                          setSelectedContent(`${item.key}-${sport.name.toLowerCase()}`)
                        }
                      >
                        {sport.name}
                      </p>
                    ))
                  ) : (
                    <p className="text-red-300">No sports found</p>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Sport Types Summary View */}
          <div>
            <button
              onClick={() => toggleMenu("types")}
              className="flex items-center w-full px-3 py-3 text-sm hover:bg-[#e66dbd] rounded transition"
            >
              <span className="mr-3">⚽</span>
              Sport Types
              <FaChevronDown
                className={`ml-auto transition-transform ${
                  openMenus.types ? "rotate-180" : ""
                }`}
              />
            </button>

            {openMenus.types && (
              <div className="bg-[#3b478f] ml-10 mt-1 text-xs p-2 rounded">
                {error ? (
                  <p className="text-red-300">{error}</p>
                ) : loadingSports ? (
                  <p className="text-white text-sm">Loading...</p>
                ) : sports.length > 0 ? (
                  sports.map((sport) => (
                    <p
                      key={sport.id}
                      className="py-1 cursor-pointer hover:underline"
                      onClick={() =>
                        setSelectedContent(`type-${sport.name.toLowerCase()}`)
                      }
                    >
                      {sport.name}
                    </p>
                  ))
                ) : (
                  <p className="text-red-300 text-sm">No sports found</p>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-white">
          {error && <p className="text-red-600 mb-4">{error}</p>}
          {selectedContent.startsWith("news-") ? (
            <FetchNewsWrapper sport={selectedContent.replace("news-", "")} />
          ) : selectedContent.startsWith("profile-player") ? (
            <ProfileDashboardWrapper sport="player"/>)
            : selectedContent === "profile-coach" ? (
              <FetchProfileCoachWrapper sport="coach" />
          ) : selectedContent.startsWith("schedule-") ? (
            <h2 className="text-xl font-semibold capitalize text-[#1D276C]">
              Schedule: {selectedContent.replace("schedule-", "")}
            </h2>
          ) : selectedContent.startsWith("match-") ? (
            <h2 className="text-xl font-semibold capitalize text-[#1D276C]">
              Match: {selectedContent.replace("match-", "")}
            </h2>
          ) : selectedContent.startsWith("activity-") ? (
            <FetchActivityDWrapper sport={selectedContent.replace("activity-", "")} />
          ) : selectedContent.startsWith("history-") ? (
            <h2 className="text-xl font-semibold capitalize text-[#1D276C]">
              History: {selectedContent.replace("history-", "")}
            </h2>
          ) : selectedContent.startsWith("type-") ? (
            <div>
              <h2 className="text-xl font-semibold capitalize text-[#1D276C]">
                {selectedContent.replace("type-", "")} Type of Sport
              </h2>
              <p className="text-gray-600 mt-2">
                You selected: <strong>{selectedContent.replace("type-", "")}</strong>
              </p>
            </div>
          ) : (
            <h2 className="text-xl font-semibold text-[#1D276C]">Dashboard</h2>
          )}

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