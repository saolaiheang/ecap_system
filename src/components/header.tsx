"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/image/pseLogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="bg-[#1D276C] shadow-md sticky top-0 z-50 px-[200px]">
      <div className="max-w-7xl flex justify-between items-center px-6 py-4 md:py-4">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src={Logo}
            alt="PSE Logo"
            width={100}
            height={100}
            className="object-contain"
          />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-10 text-white text-lg font-medium">
          <Link href="/pages/home" className="hover:text-blue-400 transition duration-300">Home</Link>
          <Link href="/pages/about" className="hover:text-blue-400 transition duration-300">About</Link>
          <Link href="/pages/news" className="hover:text-blue-400 transition duration-300">News</Link>
          <Link href="/pages/match" className="hover:text-blue-400 transition duration-300">Match</Link>
          <Link href="/pages/schedule" className="hover:text-blue-400 transition duration-300">Schedule</Link>
          <Link href="/pages/coach" className="hover:text-blue-400 transition duration-300">Coach</Link>
          <Link href="/pages/player" className="hover:text-blue-400 transition duration-300">Player</Link>
        </nav>

        {/* Mobile Hamburger */}
        <button onClick={toggleMenu} className="md:hidden text-white text-2xl focus:outline-none">
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-[#1D276C] text-white px-4 py-4 space-y-4 text-lg">
          <Link href="/pages/home" onClick={toggleMenu} className="block hover:text-blue-400">Home</Link>
          <Link href="/pages/about" onClick={toggleMenu} className="block hover:text-blue-400">About</Link>
          <Link href="/pages/news" onClick={toggleMenu} className="block hover:text-blue-400">News</Link>
          <Link href="/pages/match" onClick={toggleMenu} className="block hover:text-blue-400">Match</Link>
          <Link href="/pages/schedule" onClick={toggleMenu} className="block hover:text-blue-400">Schedule</Link>
          <Link href="/pages/coach" onClick={toggleMenu} className="block hover:text-blue-400">Coach</Link>
          <Link href="/pages/player" onClick={toggleMenu} className="block hover:text-blue-400">Player</Link>
        </div>
      )}
    </header>
  );
}
