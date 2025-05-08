import CharacterForm from "./components/CharacterForm";
import EnemyForm from "./components/EnemyForm";
import InitiativeList from "./components/InitiativeList";
import ConditionManager from "./components/ConditionManager";
import ConcentrationManager from "./components/ConcentrationManager";
import CharacterPanel from "./components/CharacterPanel";
import TokenBoard from "./components/TokenBoard";
import ScenarioLibrary from "./components/ScenarioLibrary";
import SpellMarkerForm from "./components/SpellMarkerForm";
import { useCombat } from "./context/CombatContext";
import { useRef, useState, useEffect } from "react";
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
    undoLastChange,
  } = useCombat();

  const fileInputRef = useRef();
  const [lastAutosave, setLastAutosave] = useState(null);

  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setLastAutosave(formatted);
  }, [characters, spellMarkers, round]);

  const handleSave = () => {
    const filename = prompt("Name this scenario:", "my_encounter") || "turnspire_scenario";
    const data = {
      characters,
      round,
      currentTurn: characters.findIndex(c => !c.defeated),
      gridConfig: {
        rows: 20,
        cols: 20,
        squareSize: 40,
      },
      spellMarkers,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
    <div className="min-h-screen text-white px-4 py-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-2 mb-2 sm:mb-0 relative">
          <button
            onClick={handleSave}
            className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded text-sm z-10"
          >
            Save
          </button>
          <button
            onClick={undoLastChange}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded text-sm z-10"
          >
            Undo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={(e) => handleFileChange(e)}
            className="hidden"
          />
        </div>
        <h1 className="text-3xl font-bold text-center sm:flex-grow sm:-ml-20">Turnspire</h1>
        <div className="text-sm text-gray-200 mt-2 sm:mt-0 sm:text-right sm:w-40">
          {lastAutosave && `Last autosave: ${lastAutosave}`}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-overlay">
            <ScenarioLibrary />
            <CharacterForm />
            <EnemyForm />
            <SpellMarkerForm />
          </div>
          <TokenBoard />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-overlay">
            <InitiativeList />
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Round: {round}</h2>
              <button
                onClick={nextTurn}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
              >
                Next Turn
              </button>
            </div>
            <ConditionManager />
            <ConcentrationManager />
          </div>
        </div>
      </div>

      <CharacterPanel />
    </div>
  );
};

export default App;
