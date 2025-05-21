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
    <header className="bg-gradient-to-r from-[#1D276C] to-[#23338F] shadow-xl sticky top-0 z-50 font-sans border-b border-blue-500">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between rounded-xl backdrop-blur-sm bg-opacity-80">
        {/* Logo */}
        <Link href="/pages/home">
          <div className="flex items-center cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95">
            <Image
              src={Logo}
              alt="PSE Logo"
              width={150}
              height={90}
              className="object-contain drop-shadow-lg"
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-10 text-white text-[17px] font-medium">
          {[
            ["Home", "/pages/home"],
            ["About", "/pages/about"],
            ["News", "/pages/news"],
            ["Match", "/pages/match"],
            ["Schedule", "/pages/schedule"],
            ["Coach", "/pages/coach"],
            ["Player", "/pages/player"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="relative group transition duration-300"
            >
              <span className="group-hover:text-blue-300">{label}</span>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-300 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-white text-2xl focus:outline-none bg-blue-500 rounded-md p-2 shadow-md hover:bg-blue-600 transition"
        >
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-[#1D276C] text-white px-6 py-4 space-y-4 text-lg font-medium rounded-b-xl shadow-inner">
          {[
            ["Home", "/pages/home"],
            ["About", "/pages/about"],
            ["News", "/pages/news"],
            ["Match", "/pages/match"],
            ["Schedule", "/pages/schedule"],
            ["Coach", "/pages/coach"],
            ["Player", "/pages/player"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              onClick={toggleMenu}
              className="block hover:text-blue-300 transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
