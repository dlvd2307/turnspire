import { useCombat } from "../context/CombatContext";
import { useState } from "react";

const ConditionManager = () => {
  const {
    characters,
    selectedCharacterId,
    setCharacters,
  } = useCombat();

  const [conditionName, setConditionName] = useState("");
  const [duration, setDuration] = useState(1);
  const [applyToGroup, setApplyToGroup] = useState(false);

  const selected = characters.find((c) => c.id === selectedCharacterId);
  const groupName = selected?.groupName;

  const applyCondition = () => {
    if (!selected) return;

    const updatedCharacters = characters.map((char) => {
      const shouldApply =
        applyToGroup && groupName
          ? char.groupName === groupName
          : char.id === selected.id;

      if (!shouldApply) return char;

      return {
        ...char,
        conditions: [
          ...char.conditions,
          {
            name: conditionName,
            remainingRounds: parseInt(duration),
          },
        ],
      };
    });

    setCharacters(updatedCharacters);
    setConditionName("");
    setDuration(1);
    setApplyToGroup(false);
  };

  return (
    <div className="bg-gray-800 p-4 rounded mt-4">
      <h3 className="text-lg font-semibold mb-2">Conditions</h3>

      {selected?.conditions.length > 0 && (
        <ul className="mb-2 list-disc list-inside text-sm">
          {selected.conditions.map((cond, i) => (
            <li key={i}>
              {cond.name} ({cond.remainingRounds} round
              {cond.remainingRounds !== 1 ? "s" : ""} left)
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2 items-end flex-wrap">
        <input
          type="text"
          placeholder="Condition (e.g. Poisoned)"
          value={conditionName}
          onChange={(e) => setConditionName(e.target.value)}
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
          onClick={applyCondition}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
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
              className="accent-red-600"
            />
            Apply to {groupName}
          </label>
        )}
      </div>
    </div>
  );
};

export default ConditionManager;
