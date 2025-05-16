"use client";

import Image from "next/image";
import Logo from "../../public/image/pseLogo.png";
import { useEffect, useState, useCallback } from "react";
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
      <div className="ml-4 rounded-t-[8px]">
        <Image
          src={Logo}
          alt="PSE Logo"
          className="w-[120px] object-contain p-1"
          priority={true}
        />
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </header>
  );
}
