// src/LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";

const FEATURES = [
  {
    title: "Damage & healing, done for you",
    desc: "Enter a number, hit Damage. Temporary hit points are absorbed first, healing caps at max, and every change is undoable.",
  },
  {
    title: "Initiative that handles groups",
    desc: "Add six goblins as one group with a shared roll, then collapse them into a single line in the turn order.",
  },
  {
    title: "Conditions & concentration",
    desc: "Effects count down by round and expire on their own. Apply them to a whole enemy group at once.",
  },
  {
    title: "Drag-and-drop battlefield",
    desc: "Move tokens on a grid sized to your encounter, with terrain backgrounds or your own uploaded map.",
  },
  {
    title: "Spell effect markers",
    desc: "Drop cubes, spheres, and cones scaled to the grid, then drag and rotate them into place.",
  },
  {
    title: "Save, load & autosave",
    desc: "Prep encounters ahead of the session, keep a library of scenarios, and pick up exactly where you left off.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* ---- Top bar ---- */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2">
          <img
            src="/assets/turnspirelogo.png"
            alt="Turnspire"
            className="h-14 w-auto sm:h-16"
          />
          <Link to="/app" className="btn btn-primary btn-sm">
            Launch Turnspire
          </Link>
        </div>
      </header>

      {/* ---- Hero ----
          Image and scrim are separate layers. Putting opacity on the image
          element itself would dim the photo instead of darkening over it. */}
      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-slate-900 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/landing-bg.jpg')" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/45 via-slate-950/35 to-slate-950"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(2,6,23,0.65)_0%,transparent_70%)]"
        />

        <div className="mx-auto max-w-3xl px-6 py-28 text-center sm:py-40">
          <h1 className="text-4xl font-semibold tracking-tight drop-shadow-[0_2px_12px_rgba(2,6,23,0.9)] sm:text-6xl">
            Run combat, not spreadsheets.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-200 drop-shadow-[0_1px_8px_rgba(2,6,23,0.9)]">
            Turnspire tracks initiative, hit points, conditions, and positions in
            one screen — so you can keep your attention on the table instead of
            the arithmetic.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/app" className="btn btn-primary px-6 py-3 text-base">
              Launch Turnspire
            </Link>
            <span className="text-sm text-slate-400">
              Free · No account · Runs in your browser
            </span>
          </div>
        </div>
      </section>

      {/* ---- Features ---- */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-2xl font-semibold tracking-tight">
          Everything a DM needs mid-encounter
        </h2>
        <p className="mt-2 max-w-2xl text-slate-400">
          Built around the things that actually slow a fight down.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="panel">
              <h3 className="text-base font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Why ---- */}
      <section className="border-y border-slate-800 bg-slate-900/40">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h2 className="text-2xl font-semibold tracking-tight">
            Why I made it
          </h2>
          <p className="mt-4 leading-relaxed text-slate-300">
            I wanted something elegant for DMs — no spreadsheets, no endless
            tabs, just one tool that felt like an extension of the tabletop.
            Turnspire exists to keep your focus where it belongs: storytelling,
            strategy, and shared adventures.
          </p>
          <p className="mt-4 leading-relaxed text-slate-400">
            It's free and always will be. If you hit a bug or want a feature,
            email me — I read everything.
          </p>
        </div>
      </section>

      {/* ---- Support ---- */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Support the project
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-400">
          If Turnspire helps at your table, a small contribution keeps it
          running and ad-free.
        </p>
        <a
          href="https://ko-fi.com/dlvd2307"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary mt-6 px-6 py-3 text-base"
        >
          Buy me a potion on Ko-fi
        </a>
      </section>

      {/* ---- Footer ---- */}
      <footer className="border-t border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Turnspire. Made by Dylan van Dijk.
          </p>
          <a
            href="mailto:turnspire@gmail.com"
            className="text-indigo-400 hover:text-indigo-300"
          >
            turnspire@gmail.com
          </a>
        </div>
      </footer>
    </div>
  );
}
