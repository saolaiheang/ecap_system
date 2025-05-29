"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react"; // icon library (optional)

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    ["Home", "/pages/home"],
    ["About", "/pages/about"],
    ["News", "/pages/news"],
    ["Match", "/pages/match"],
    ["Schedule", "/pages/schedule"],
    // ["Coach", "/pages/coach"],
    // ["Player", "/pages/player"],
  ];

  return (
    <header className="w-full sticky top-0 z-50 bg-black/80 shadow-lg border-b border-purple-300 text-white">
      {/* Top Bar */}
      <div className="px-6 py-3 flex justify-between items-center text-sm">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center cursor-pointer transition-transform duration-300 hover:scale-105">
            <Image
              src="/image/pseLogo.png"
              alt="PSE Logo"
              width={160}
              height={80}
              className="object-contain drop-shadow-lg"
            />
          </div>
        </Link>

        {/* Title */}
        <h1 className=" lg:ml-[-150px] hidden md:block w-full text-center text-2xl md:text-4xl font-bold bg-gradient-to-r from-pink-500  to-purple-700 bg-clip-text text-transparent drop-shadow-lg">
          Extra Curriculum Activities Program
        </h1>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Navigation Bar */}
      <div className="px-6 py-4">
        <span className="block w-[70%] h-[2px] bg-gradient-to-r from-pink-500 to-purple-700 rounded-full mx-auto" />

        {/* Desktop Nav */}
        <nav className="hidden md:flex justify-center mt-5 gap-10 text-lg font-semibold tracking-wide">
          {navItems.map(([label, href]) => (
            <Link key={label} href={href}>
              <span className="relative group cursor-pointer transition-colors duration-300">
                <span className="group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-700 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  {label}
                </span>
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-gradient-to-r from-pink-500 to-purple-700 transition-all duration-300 group-hover:w-full" />
              </span>
            </Link>
          ))}
        </nav>

        {/* Mobile Nav */}
        {isOpen && (
          <nav className="md:hidden flex flex-col mt-4 gap-4 text-lg font-medium">
            {navItems.map(([label, href]) => (
              <Link key={label} href={href} onClick={() => setIsOpen(false)}>
                <span className="px-4 py-2 rounded hover:bg-gradient-to-r from-pink-500 to-purple-700 hover:text-white transition">
                  {label}
                </span>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
