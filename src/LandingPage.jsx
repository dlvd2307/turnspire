// src/LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen text-white px-6 py-12">
      {/* Background image overlay */}
      <div
        className="absolute inset-0 bg-black opacity-60"
        style={{ backgroundImage: "url('/assets/landing-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
      />

      {/* Main content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <img
            src="/assets/turnspirelogo.png"
            alt="Turnspire Logo"
            className="mx-auto w-32 h-32 mb-4 drop-shadow-lg"
          />
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">Turnspire</h1>
          <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
            A powerful yet intuitive D&D combat tracker built for Dungeon Masters who want clarity, control, and immersion.
          </p>

          {/* Launch button */}
          <Link to="/app">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded text-lg">
              Launch Turnspire
            </button>
          </Link>
        </section>

        {/* What is Turnspire */}
        <section className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4">What is Turnspire?</h2>
          <p className="text-gray-300">
            Turnspire is a fast, modern combat manager designed for tabletop roleplaying games. Track initiative, conditions,
            concentration, spell effects, and battlefield positions in one clean interface. It's free, easy to use, and optimized
            for DMs who love narrative and tactical combat alike.
          </p>
        </section>

        {/* Why We Built It */}
        <section className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Why We Made It</h2>
          <p className="text-gray-300">
            I wanted to build something elegant for DMs- no spreadsheets, no endless tabs, just one tool that felt like an extension
            of the tabletop. Turnspire exists to keep your focus where it belongs: storytelling, strategy,
            and shared adventures.
          </p>
        </section>

        {/* Features */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-6 text-center">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Feature title="🧠 Condition & Concentration Tracking" desc="Auto-expiring effects, round timers, visual rings." />
            <Feature title="🗺️ Drag-and-Drop Grid" desc="Interactive battlefield with customizable terrain and markers." />
            <Feature title="🎲 Initiative Order" desc="Group enemies, skip defeated, collapse lists, and undo turns." />
            <Feature title="💾 Save, Load & Autosave" desc="Create scenarios, prep encounters, autosave sessions." />
            <Feature title="📐 Spell Effect Markers" desc="Add cones, cubes, and spheres with labels and rotation." />
            <Feature title="🎨 Custom Backgrounds" desc="Upload your own terrain maps or use built-in tiles." />
          </div>
        </section>

        {/* Support the Project */}
        <section className="text-center mb-20">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Support the Project</h2>
          <p className="text-gray-300 mb-4">
            If Turnspire helps your game, please consider supporting development!
          </p>
          <a href="https://ko-fi.com/dlvd2307" target="_blank" rel="noopener noreferrer">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded text-lg">
              Buy me a potion on Ko-fi
            </button>
          </a>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 border-t border-gray-700 pt-6">
          <p>&copy; {new Date().getFullYear()} Turnspire. Made by Dylan van Dijk.</p>
          <p>
            Contact: <a href="mailto:turnspire@gmail.com" className="text-blue-400">turnspire@gmail.com</a>
          </p>
        </footer>
      </div>
    </div>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  );
}
