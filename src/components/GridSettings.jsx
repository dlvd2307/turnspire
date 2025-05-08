import { useCombat } from "../context/CombatContext";

const GridSettings = () => {
  const { gridConfig, setGridConfig } = useCombat();

  const update = (field, value) => {
    setGridConfig({ ...gridConfig, [field]: parseInt(value) });
  };

  return (
    <div className="bg-gray-800 p-4 rounded mb-4 max-w-xl mx-auto">
      <h3 className="text-lg font-semibold mb-3">Grid Settings</h3>
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
  );
};

export default GridSettings;
