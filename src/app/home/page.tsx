'use client'; // Required for client-side features like useState

import { useState } from 'react';
import Link from 'next/link'; // For navigation

export default function Homepage() {
  const [count, setCount] = useState(0); // State for interactivity

  return (
    <div className="flex flex-col min-h-screen font-sans text-center">
      {/* Header */}
      <header className="bg-gray-100 p-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to My Next.js App</h1>
        <nav className="mt-2">
          <Link href="/about" className="text-blue-600 hover:underline mx-4">About</Link>
          <span>|</span>
          <Link href="/contact" className="text-blue-600 hover:underline mx-4">Contact</Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-600">Explore Our Features</h2>
          <p className="mt-2 text-gray-600">
            This is a sample homepage built with Next.js and styled with Tailwind CSS. Click the button below to see interactivity!
          </p>
        </section>

        <section className="mt-8">
          <p className="text-lg text-gray-700">Counter: {count}</p>
          <button
            onClick={() => setCount(count + 1)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Increment
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 p-4 border-t border-gray-200 text-gray-600">
        <p>© 2025 My Next.js App. All rights reserved.</p>
      </footer>
    </div>
  );
}