"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import {jwtDecode} from "jwt-decode";
interface DecodedToken {
  exp: number;
}
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem("token");

    try{
      const decoded:DecodedToken=jwtDecode(token as string);
      const currentTime=Date.now()/1000;
      if (decoded.exp > currentTime) {
        router.push("/pages/adminpage"); 
      } else {
        localStorage.removeItem("token"); 
      }

    }catch(err){
      console.log(err);
      localStorage.removeItem("token"); 
    }
  
  }, [router]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);

      router.push("/pages/adminpage");
    } catch (err) {
      console.log(err)
      setError( "An unexpected error occurred.");
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="h-screen w-screen bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: 'url("/image/b.jpg")' }}
    >
      <div className="w-[500px] h-[500px] text-white rounded-[10px] shadow-lg">
        {/* Header */}
        <div className="w-full h-[90px] bg-[#1D276C] rounded-t-[10px]">
          <Image
            src="/image/pseLogo.png"
            alt="PSE Logo"
            width={120}
            height={80}
            className="object-contain p-[10px] h-[90px]"
          />
        </div>

        {/* Form Body */}
        <div className="w-full h-[420px] bg-white/10 backdrop-blur-md rounded-b shadow-lg p-[40px]">
          <p className="text-3xl text-center mb-[20px] font-serif text-white">
            Ecap Management
          </p>

          {error && (
            <p className="text-red-200 text-center mb-4 text-sm">{error}</p>
          )}

          {/* Email Field */}
          <div className="flex items-center bg-white/50 rounded-lg mb-4 text-gray-700 shadow-md">
            <div className="bg-[#14247A] w-[60px] py-4 rounded-l-[8px] text-white mr-4 flex justify-center items-center">
              <FontAwesomeIcon icon={faUser} style={{ fontSize: "18px" }} />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent outline-none w-full  text-[20px]"
            />
          </div>

          {/* Password Field */}
          <div className="flex items-center bg-white/30 rounded-lg mb-6 text-gray-700 shadow-md relative">
            <div className="bg-[#14247A] w-[60px] py-4 rounded-l-[8px] text-white mr-4 flex justify-center items-center">
              <FontAwesomeIcon icon={faLock} style={{ fontSize: "18px" }} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent outline-none w-full text-gray-800 placeholder-gray-500 text-[20px] pr-10"
            />
            <div
              className="absolute right-4 cursor-pointer text-[#14247A]"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                style={{ fontSize: "18px" }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#14247A] text-white py-3 rounded-lg text-lg font-medium shadow-md hover:bg-[#101d5a] transition duration-200"
          >
            Login
          </button>

          <p className="text-[20px] text-center mt-[30px]">Forgot Password?</p>
        </div>
      </div>
    </form>
  );
}
