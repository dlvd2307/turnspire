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
    setCharacters,
    setGridConfig,
    setSelectedCharacterId,
    spellMarkers,
    setSpellMarkers,
    gridConfig,
  } = useCombat();

  const fileInputRef = useRef();
  const [lastAutosave, setLastAutosave] = useState(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [showRoundBanner, setShowRoundBanner] = useState(false);

  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setLastAutosave(formatted);
  }, [characters, spellMarkers, round]);

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
      if (!filename) {
        console.log("Save cancelled by user.");
        return;
      }
      const data = {
        characters,
        round,
        currentTurn: characters.findIndex(c => !c.defeated),
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
        } else {
          alert("Invalid scenario file.");
        }
      } catch {
        alert("Failed to load scenario.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-6">
      {showRoundBanner && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-yellow-600 text-black px-6 py-2 rounded-lg shadow-lg z-50 text-lg font-bold">
          ⚔️ Round {round} Begins!
        </div>
      )}

      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-2 mb-2 sm:mb-0 relative">
          <button
            onClick={handleSave}
            className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded text-sm z-10"
          >
            Save
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={(e) => handleFileChange(e)}
            className="hidden"
          />
        </div>

<img
  src="/assets/turnspirelogo.png"
  alt="Turnspire Logo"
  className="h-28 sm:h-32 w-auto drop-shadow-lg"
/>




        <div className="text-sm text-gray-400 mt-2 sm:mt-0 sm:text-right sm:w-40">
          {lastAutosave && `Last autosave: ${lastAutosave}`}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <ScenarioLibrary />
          <CharacterForm />
          <EnemyForm />
          <SpellMarkerForm />
          <TokenBoard />
          <GridSettings />
        </div>
        <div className="lg:col-span-2">
          <InitiativeList />
          <div className="flex justify-between items-center mb-4 space-x-2">
            <h2 className="text-lg font-semibold">Round: {round}</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => window.dispatchEvent(new Event("undo-action"))}
                className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded text-white"
                title="Undo last action"
              >
                Undo
              </button>
              <button
                onClick={nextTurn}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
              >
                Next Turn
              </button>
            </div>
          </div>
          <ConditionManager />
          <ConcentrationManager />
          <StatusOverview />
          <CharacterPanel />
        </div>
      </div>

      <footer className="mt-10 text-center text-sm text-gray-400">
        <p>Thank you for using Turnspire.</p>
        <p>
          If you have questions, ideas, or need help, email me at{" "}
          <a href="mailto:turnspire@gmail.com" className="text-blue-400 underline">
            turnspire@gmail.com
          </a>.
        </p>
      </footer>

      <button
        onClick={() => setIsHelpOpen(true)}
        className="fixed bottom-4 right-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-3 py-2 rounded-full shadow-lg"
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
