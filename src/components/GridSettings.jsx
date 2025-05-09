// src/components/GridSettings.jsx
import { useCombat } from "../context/CombatContext";
import { useState } from "react";

const GridSettings = () => {
  const { gridConfig, setGridConfig } = useCombat();
  const [isOpen, setIsOpen] = useState(false);

  const update = (field, value) => {
    setGridConfig({ ...gridConfig, [field]: parseInt(value) });
  };

  return (
    <div className="mb-4 max-w-xl mx-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded shadow mb-2"
      >
        ⚙️ {isOpen ? "Hide" : "Show"} Grid Settings
      </button>

      {isOpen && (
        <div className="bg-overlay p-4 rounded shadow-md border border-gray-600">
          <h3 className="text-lg font-semibold mb-3 font-fantasy">Adjust Battlefield Dimensions</h3>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <span>Rows:</span>
              <input
                type="number"
                value={gridConfig.rows}
                onChange={(e) => update("rows", e.target.value)}
                className="w-20 p-2 bg-gray-700 text-white rounded"
              />
            </label>
            <label className="flex items-center gap-2">
              <span>Columns:</span>
              <input
                type="number"
                value={gridConfig.cols}
                onChange={(e) => update("cols", e.target.value)}
                className="w-20 p-2 bg-gray-700 text-white rounded"
              />
            </label>
            <label className="flex items-center gap-2">
              <span>Square Size (px):</span>
              <input
                type="number"
                value={gridConfig.squareSize}
                onChange={(e) => update("squareSize", e.target.value)}
                className="w-24 p-2 bg-gray-700 text-white rounded"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default GridSettings;
