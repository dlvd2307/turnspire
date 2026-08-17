// src/App.jsx
import CharacterForm from "./components/CharacterForm";
import EnemyForm from "./components/EnemyForm";
import InitiativeList from "./components/InitiativeList";
import ConditionManager from "./components/ConditionManager";
import ConcentrationManager from "./components/ConcentrationManager";
import CharacterPanel from "./components/CharacterPanel";
import TokenBoard from "./components/TokenBoard";
import ScenarioLibrary from "./components/ScenarioLibrary";
import SpellMarkerForm from "./components/SpellMarkerForm";
import StatusOverview from "./components/StatusOverview";
import HelpPopup from "./components/HelpPopup";
import GridSettings from "./components/GridSettings";
import { useCombat } from "./context/CombatContext";
import { useRef, useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import "./index.css";

const App = () => {
  const {
  nextTurn,
  round,
  characters,
  currentTurnId, // ← This is fine
  setCharacters,
  setGridConfig,
  setSelectedCharacterId,
  spellMarkers,
  setSpellMarkers,
  gridConfig,
  resetCombat,
} = useCombat();


  const fileInputRef = useRef();
  const [lastAutosave, setLastAutosave] = useState(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [showRoundBanner, setShowRoundBanner] = useState(false);
  const [loadedFromStorage, setLoadedFromStorage] = useState(false);

  // Load autosave on first mount BEFORE render
useEffect(() => {
  const saved = localStorage.getItem("turnspire-autosave");
  if (saved) {
    try {
      const data = JSON.parse(saved);
      setCharacters(data.characters || []);
      setGridConfig(data.gridConfig || { rows: 20, cols: 20, squareSize: 40 });
      setSpellMarkers(data.spellMarkers || []);
      setSelectedCharacterId(null);

      if (typeof data.round === "number") {
        setTimeout(() => window.dispatchEvent(new CustomEvent("set-round", { detail: data.round })), 0);
      }

      if (data.currentTurnId) {
        setTimeout(() => window.dispatchEvent(new CustomEvent("set-current-turn", { detail: data.currentTurnId })), 0);
      }
    } catch {
      console.warn("Failed to load autosave.");
    }
  }

  // ✅ This line is missing
  setLoadedFromStorage(true);
}, []);


  // Set autosave label
  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setLastAutosave(formatted);
  }, [characters, spellMarkers, round]);

useEffect(() => {
  if (!loadedFromStorage) return;
  const data = {
    characters,
    round,
    currentTurnId, // ✅ Correct
    gridConfig,
    spellMarkers,
  };
  localStorage.setItem("turnspire-autosave", JSON.stringify(data));
}, [characters, spellMarkers, round, currentTurnId, gridConfig, loadedFromStorage]);


  useEffect(() => {
    if (document.getElementById("kofi-script")) return;
    const script = document.createElement("script");
    script.src = "https://storage.ko-fi.com/cdn/scripts/overlay-widget.js";
    script.id = "kofi-script";
    script.async = true;
    script.onload = () => {
      if (window.kofiWidgetOverlay) {
        window.kofiWidgetOverlay.draw("dlvd2307", {
          type: "floating-chat",
          "floating-chat.donateButton.text": "Buy me a potion",
          "floating-chat.donateButton.background-color": "#00b9fe",
          "floating-chat.donateButton.text-color": "#fff",
        });
      }
    };
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const hasSeenHelp = localStorage.getItem("hasSeenHelp");
    if (!hasSeenHelp) {
      setIsHelpOpen(true);
      localStorage.setItem("hasSeenHelp", "true");
    }
  }, []);

  useEffect(() => {
    setShowRoundBanner(true);
    const timer = setTimeout(() => setShowRoundBanner(false), 2000);
    return () => clearTimeout(timer);
  }, [round]);

  const handleSave = () => {
    try {
      const filename = prompt("Name this scenario:", "my_encounter");
      if (!filename) return;

      const data = {
        characters,
        round,
        currentTurnId,
        gridConfig,
        spellMarkers,
      };
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${filename}.json`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
      }, 100);
    } catch (error) {
      console.error("Error during save:", error);
      alert("Failed to save scenario. Check the console for details.");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.characters && data.round != null) {
          setCharacters(data.characters);
          setGridConfig(data.gridConfig || { rows: 20, cols: 20, squareSize: 40 });
          setSpellMarkers(data.spellMarkers || []);
          setSelectedCharacterId(null);

          if (typeof data.round === "number") {
            window.dispatchEvent(new CustomEvent("set-round", { detail: data.round }));
          }
          if (data.currentTurnId) {
            window.dispatchEvent(
              new CustomEvent("set-current-turn", { detail: data.currentTurnId })
            );
          }
        } else {
          alert("Invalid scenario file.");
        }
      } catch {
        alert("Failed to load scenario.");
      }
    };
    reader.readAsText(file);
    // Clear the input so picking the same file again still fires onChange.
    event.target.value = "";
  };

  if (!loadedFromStorage) {
    return <div className="mt-20 text-center text-slate-400">Loading Turnspire…</div>;
  }

  return (
    <div className="min-h-screen">
      {showRoundBanner && (
        <div className="fixed left-1/2 top-20 z-50 -translate-x-1/2 rounded-full
                        border border-amber-500/30 bg-amber-500/15 px-5 py-2
                        text-sm font-semibold text-amber-200 backdrop-blur">
          Round {round} begins
        </div>
      )}

      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2">
          <img
            src="/assets/turnspirelogo.png"
            alt="Turnspire"
            className="h-14 w-auto sm:h-20"
          />

          <div className="flex items-center gap-2">
            {lastAutosave && (
              <span className="hidden text-xs text-slate-500 sm:inline">
                Saved {lastAutosave}
              </span>
            )}
            <button onClick={handleSave} className="btn btn-secondary btn-sm">
              Save
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-secondary btn-sm"
            >
              Load
            </button>
            <button
              onClick={() => {
                const confirmed = confirm("This will clear the entire board. Are you sure?");
                if (confirmed) resetCombat();
              }}
              className="btn btn-danger btn-sm"
            >
              Reset
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={(e) => handleFileChange(e)}
              className="hidden"
            />
          </div>
        </div>
      </header>


      <main className="mx-auto max-w-7xl grid grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <ScenarioLibrary />
          <CharacterForm />
          <EnemyForm />
          <SpellMarkerForm />
          <TokenBoard />
          <GridSettings />
        </div>
        <div className="space-y-6 lg:col-span-2">
          {/* Turn controls sit above the order - the thing you touch most. */}
          <div className="flex items-center justify-between gap-3 rounded-xl
                          border border-slate-800 bg-slate-900/70 px-4 py-3">
            <div>
              <div className="label">Round</div>
              <div className="text-2xl font-semibold tabular-nums leading-none">
                {round}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => window.dispatchEvent(new Event("undo-action"))}
                className="btn btn-secondary"
                title="Undo last action (Ctrl+Z)"
              >
                Undo
              </button>
              <button onClick={nextTurn} className="btn btn-success">
                Next Turn
              </button>
            </div>
          </div>
          <InitiativeList />
          <ConditionManager />
          <ConcentrationManager />
          <StatusOverview />
          <CharacterPanel />
        </div>
      </main>

      <footer className="mx-auto max-w-7xl border-t border-slate-800 px-4 py-8 text-center text-sm text-slate-400 space-y-1">
  <p>Thank you for using Turnspire.</p>
  <p>
    If you have questions, ideas, or need help, email me at{" "}
    <a href="mailto:turnspire@gmail.com" className="text-indigo-400 hover:text-indigo-300">
      turnspire@gmail.com
    </a>.
  </p>
  <p className="pt-2 text-xs text-slate-500">
    © {new Date().getFullYear()} Dylan van Dijk. All rights reserved.
  </p>
</footer>


      <button
        onClick={() => setIsHelpOpen(true)}
        className="fixed bottom-4 right-4 h-10 w-10 rounded-full border border-slate-700 bg-slate-800 text-slate-300 shadow-lg transition-colors hover:bg-slate-700 hover:text-white"
        title="Help"
      >
        ?
      </button>
      <HelpPopup isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <Analytics />
    </div>
  );
};

export default App;
