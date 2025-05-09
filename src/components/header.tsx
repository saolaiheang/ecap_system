"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/image/pseLogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  return (
    <header className="flex justify-between items-center bg-[#1D276C] shadow-md">
      <div className=" ml-[15px]  rounded-t-[10px]">
        <Image
          src={Logo}
          alt="PSE Logo"
          className="w-auto object-contain p-[10px]"
        />
      </div>


        <nav className="hidden md:flex space-x-6 text-white text-2xl gap-20 mr-[200px]">
          <Link href="/pages/home" className="hover:text-blue-500">
            Home
          </Link>
          <Link href="/pages/about" className="hover:text-blue-500">
            About
          </Link>
          <Link href="/pages/news" className="hover:text-blue-500">
            News
          </Link>
          <Link href="/pages/schedule" className="hover:text-blue-500">
            Schedule
          </Link>
        </nav>
    </header>
  );
}
