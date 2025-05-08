import { useCombat } from "../context/CombatContext";
import { useState, useEffect, useRef } from "react";

const SCENARIO_STORAGE_KEY = "turnspire-scenarios";

const ScenarioLibrary = () => {
  const {
    setCharacters,
    setGridConfig,
    setSelectedCharacterId,
  } = useCombat();

  const [scenarios, setScenarios] = useState([]);
  const fileInputRef = useRef();

  // Load stored scenarios on mount
  useEffect(() => {
    const saved = localStorage.getItem(SCENARIO_STORAGE_KEY);
    if (saved) {
      setScenarios(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage on update
  const saveToStorage = (data) => {
    localStorage.setItem(SCENARIO_STORAGE_KEY, JSON.stringify(data));
    setScenarios(data);
  };

  const loadScenario = (scenario) => {
    setCharacters(scenario.characters);
    setGridConfig(scenario.gridConfig || { rows: 20, cols: 20, squareSize: 40 });
    setSelectedCharacterId(null);
  };

  const exportScenario = (scenario) => {
    const blob = new Blob([JSON.stringify(scenario, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${scenario.name || "turnspire_scenario"}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const deleteScenario = (index) => {
    const updated = scenarios.filter((_, i) => i !== index);
    saveToStorage(updated);
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (parsed.characters) {
          const name = prompt("Name this imported scenario:", file.name.replace(".json", ""));
          const updated = [...scenarios, { ...parsed, name }];
          saveToStorage(updated);
        } else {
          alert("Invalid scenario file.");
        }
      } catch {
        alert("Failed to parse file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-gray-800 p-4 rounded mb-6">
      <h2 className="text-lg font-bold mb-3">Scenario Library</h2>

      {scenarios.length === 0 ? (
        <p className="text-gray-400 text-sm">No saved scenarios yet.</p>
      ) : (
        <ul className="space-y-3">
          {scenarios.map((scen, index) => (
            <li key={index} className="bg-gray-900 rounded p-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{scen.name || "Unnamed Scenario"}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => loadScenario(scen)}
                    className="text-sm bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-white"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => exportScenario(scen)}
                    className="text-sm bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-white"
                  >
                    Export
                  </button>
                  <button
                    onClick={() => deleteScenario(index)}
                    className="text-sm bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4">
        <button
          onClick={handleImportClick}
          className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded"
        >
          Import Scenario
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ScenarioLibrary;
