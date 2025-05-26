"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function HeaderAdminPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/pages/login");
    }
  }, [router]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    router.push("/pages/login");
  }, [router]);

  return (
    <header className="flex justify-between items-center bg-[#1D276C] shadow-md px-3 py-2">
      

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </header>
  );
}
