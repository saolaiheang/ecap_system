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
   <>
   <button className="bg-red-600 p-2" onClick={handleLogout}>Logout</button>
   </>
  );
}
