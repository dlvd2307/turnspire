import { useState } from "react";
import { useCombat } from "../context/CombatContext";

const SpellMarkerForm = () => {
  const { spellMarkers, setSpellMarkers, gridConfig } = useCombat();
  const [label, setLabel] = useState("");
  const [size, setSize] = useState("");
  const [shape, setShape] = useState("cube");

  const handleSubmit = (e) => {
    e.preventDefault();

    const squareSize = gridConfig.squareSize;
    const feet = parseInt(size);
    const squares = Math.ceil(feet / 5);

    const id = `${label}-${Date.now()}`;
    const newMarker = {
      id,
      label,
      shape,
      sizeInFeet: feet,
      squares,
      x: 0,
      y: 0,
      rotation: 0, // Default for all markers (especially cone)
    };

    setSpellMarkers([...spellMarkers, newMarker]);
    setLabel("");
    setSize("");
    setShape("cube");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 p-4 rounded mb-4 space-y-2"
    >
      <h3 className="text-lg font-semibold mb-2">Add Spell Marker</h3>
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Label (e.g. Fog Cloud)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded w-full sm:w-48"
        />
        <input
          type="number"
          placeholder="Size (ft)"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded w-full sm:w-24"
        />
        <select
          value={shape}
          onChange={(e) => setShape(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded w-full sm:w-32"
        >
          <option value="cube">Cube</option>
          <option value="sphere">Sphere</option>
          <option value="cone">Cone</option>
        </select>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          Add Marker
        </button>
      </div>
    </form>
  );
};

export default SpellMarkerForm;
