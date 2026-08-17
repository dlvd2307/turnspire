import { useCombat } from "../context/CombatContext";
import { useState } from "react";

const InitiativeList = () => {
  const { characters, currentTurnId, selectedCharacterId, selectCharacter } =
    useCombat();

  // Separate grouped and ungrouped characters
  const grouped = {};
  const ungrouped = [];

  characters.forEach((char) => {
    if (char.groupName) {
      if (!grouped[char.groupName]) {
        grouped[char.groupName] = [];
      }
      grouped[char.groupName].push(char);
    } else {
      ungrouped.push(char);
    }
  });

  // Sort ungrouped characters by initiative (descending)
  const sortedUngrouped = [...ungrouped].sort((a, b) => b.initiative - a.initiative);

  // Sort groups by first member's initiative (descending)
  const sortedGrouped = Object.entries(grouped).sort(
    ([, a], [, b]) => (b[0]?.initiative || 0) - (a[0]?.initiative || 0)
  );

  const [expandedGroups, setExpandedGroups] = useState({});

  const toggleGroup = (groupName) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  // Shared row styling so grouped and ungrouped entries read the same way.
  const rowClasses = (char) => {
    if (char.id === currentTurnId) return "bg-emerald-700 text-white font-semibold";
    if (char.id === selectedCharacterId) return "bg-slate-600 ring-1 ring-sky-400";
    if (char.defeated) return "bg-slate-800 text-slate-500 line-through";
    return "bg-slate-800 hover:bg-slate-700";
  };

  const HealthText = ({ char }) => (
    <span className="tabular-nums text-sm text-slate-400">
      {char.hp}/{char.maxHp}
      {char.tempHp > 0 && <span className="text-sky-300"> +{char.tempHp}</span>}
    </span>
  );

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Initiative Order</h2>
      <ul className="space-y-1.5">
        {/* Render ungrouped characters */}
        {sortedUngrouped.map((char) => (
          <li
            key={char.id}
            onClick={() => selectCharacter(char.id)}
            className={`flex cursor-pointer items-center justify-between rounded px-3 py-2 transition-colors ${rowClasses(
              char
            )}`}
          >
            <span className="truncate">
              {char.name}{" "}
              <span className="text-slate-400 text-sm">({char.initiative})</span>
            </span>
            <HealthText char={char} />
          </li>
        ))}

        {/* Render grouped characters */}
        {sortedGrouped.map(([groupName, members]) => {
          const isExpanded = expandedGroups[groupName];
          const isGroupTurn = members.some((m) => m.id === currentTurnId);
          const groupInit = members[0]?.initiative ?? 0;
          const standing = members.filter((m) => !m.defeated).length;

          return (
            <li key={groupName} className="rounded bg-slate-800">
              <div
                className={`flex cursor-pointer items-center justify-between rounded px-3 py-2 ${
                  isGroupTurn ? "bg-emerald-700 font-semibold text-white" : ""
                }`}
                onClick={() => toggleGroup(groupName)}
              >
                <span className="truncate">
                  {isExpanded ? "▾" : "▸"} {groupName}
                  <span className="ml-2 text-sm text-slate-400">
                    ({standing}/{members.length} up)
                  </span>
                </span>
                <span className="text-sm text-slate-400">Init: {groupInit}</span>
              </div>
              {isExpanded && (
                <ul className="space-y-1 px-2 pb-2">
                  {members.map((char) => (
                    <li
                      key={char.id}
                      onClick={() => selectCharacter(char.id)}
                      className={`flex cursor-pointer items-center justify-between rounded px-3 py-1.5 text-sm transition-colors ${rowClasses(
                        char
                      )}`}
                    >
                      <span className="truncate">{char.name}</span>
                      <HealthText char={char} />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default InitiativeList;
