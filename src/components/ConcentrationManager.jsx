import { useCombat } from "../context/CombatContext";
import { useState } from "react";

const ConcentrationManager = () => {
  const {
    characters,
    selectedCharacterId,
    setCharacters,
  } = useCombat();

  const [spell, setSpell] = useState("");
  const [duration, setDuration] = useState(1);
  const [applyToGroup, setApplyToGroup] = useState(false);

  const selected = characters.find((c) => c.id === selectedCharacterId);
  const groupName = selected?.groupName;

  const applyConcentration = () => {
    if (!selected) return;

    const updatedCharacters = characters.map((char) => {
      const shouldApply =
        applyToGroup && groupName
          ? char.groupName === groupName
          : char.id === selected.id;

      if (!shouldApply) return char;

      return {
        ...char,
        concentration: {
          spell,
          remainingRounds: parseInt(duration),
        },
      };
    });

    setCharacters(updatedCharacters);
    setSpell("");
    setDuration(1);
    setApplyToGroup(false);
  };

  return (
    <div className="bg-gray-800 p-4 rounded mt-4">
      <h3 className="text-lg font-semibold mb-2">Concentration</h3>

      {selected?.concentration && (
        <p className="mb-2 text-sm text-blue-300">
          {selected.concentration.spell} (
          {selected.concentration.remainingRounds} round
          {selected.concentration.remainingRounds !== 1 ? "s" : ""} left)
        </p>
      )}

      <div className="flex gap-2 items-end flex-wrap">
        <input
          type="text"
          placeholder="Spell or Effect"
          value={spell}
          onChange={(e) => setSpell(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded w-48"
        />
        <input
          type="number"
          placeholder="Rounds"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded w-24"
        />
        <button
          onClick={applyConcentration}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
        >
          Apply
        </button>

        {/* Group Apply Checkbox */}
        {groupName && (
          <label className="flex items-center gap-2 ml-2 text-sm">
            <input
              type="checkbox"
              checked={applyToGroup}
              onChange={() => setApplyToGroup(!applyToGroup)}
              className="accent-blue-500"
            />
            Apply to {groupName}
          </label>
        )}
      </div>
    </div>
  );
};

export default ConcentrationManager;
