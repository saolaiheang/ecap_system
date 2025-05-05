"use client";

import { useState } from "react";
import Image from "next/image";
import logo from "../../../public/image/pseLogo.png";
import bg from "../../../public/image/b.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faLock } from '@fortawesome/free-solid-svg-icons';


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleFormSubmit = (event: any) => {
    event.preventDefault();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValid) {
      setError("Please enter a valid email address.");
    } else {
      setError("");
      alert("Email is valid!");
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="h-screen w-screen bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: `url(${bg.src})` }}
    >
      <div className="w-[500px] h-[500px] text-white rounded-[10px] shadow-lg">
        <div className="w-[100%] h-[100px] bg-[#1D276C] rounded-t-[10px]">
          <Image
            src={logo}
            alt="PSE Logo"
            className="w-auto object-contain p-[10px]"
          />
        </div>

        <div className="w-[100%] h-[450px] bg-white/30 backdrop-blur-md rounded-b shadow-lg p-[50px] ">
          <p className="text-3xl text-center mb-[40px] font-serif">
            Ecap Management
          </p>
          {/* Email Field */}
          {email}-{password}
          <div className="flex items-center bg-white/50 rounded-lg mb-4   text-gray-700 shadow-md">
            <div className="bg-[#14247A] w-[60px] py-4 rounded-l-[8px] text-white mr-4 flex justify-center">
            <FontAwesomeIcon icon={faUser} style={{ fontSize: '20px' }} />

            </div>
            <input
              type="email"
              placeholder="Email"
              onChange={(event) => setEmail(event.target.value)}
              className="bg-transparent outline-none w-full text-gray-800 placeholder-gray-500 text-[20px]"
            />
          </div>
          {/* Password Field */}
          <div className="flex items-center bg-white/30 rounded-lg mb-6  text-gray-700 shadow-md  ">
            <div className="bg-[#14247A] w-[60px] py-4 rounded-l-[8px] text-white mr-4 flex justify-center">
            <FontAwesomeIcon icon={faLock} style={{ fontSize: '20px'}} />


            </div>
            <input
              type="password"
              placeholder="Password"
              onChange={(event) => setPassword(event.target.value)}
              className="bg-transparent outline-none w-full text-gray-800 placeholder-gray-500 text-[20px]"
            />
          </div>
          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-[#14247A] text-white py-3 rounded-lg text-lg font-medium shadow-md hover:bg-[#101d5a] transition duration-200"
          >
            Login
          </button>
          <p className="text-[20px] text-center mt-[40px]">Forgot Password?</p>
        </div>
      </div>
    </form>
  );
}
