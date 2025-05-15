// src/components/GridSettings.jsx
import { useCombat } from "../context/CombatContext";
import { useState } from "react";

const GridSettings = () => {
  const { gridConfig, setGridConfig } = useCombat();
  const [isOpen, setIsOpen] = useState(false);

  const update = (field, value) => {
    const parsed = field === "backgroundType" ? value : parseInt(value);
    setGridConfig({ ...gridConfig, [field]: parsed });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setGridConfig({
        ...gridConfig,
        backgroundType: "custom",
        customBackground: reader.result,
      });
    };
    reader.readAsDataURL(file);
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
            <label className="flex items-center gap-2">
              <span>Background:</span>
              <select
                value={gridConfig.backgroundType}
                onChange={(e) => update("backgroundType", e.target.value)}
                className="px-2 py-1 bg-gray-700 text-white rounded"
              >
                <option value="none">None</option>
                <option value="grass">Grass</option>
                <option value="desert">Desert</option>
                <option value="dungeon">Dungeon</option>
                <option value="snow">Snow</option>
                <option value="custom">Custom (uploaded)</option>
              </select>
            </label>
            <label className="flex items-center gap-2">
              <span>Upload Image:</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="text-white"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default GridSettings;
