import { useCombat } from "../context/CombatContext";
import { useState } from "react";

const InitiativeList = () => {
  const { characters, currentTurn } = useCombat();

  // Separate grouped and ungrouped characters
  const grouped = {};
  const ungrouped = [];

  characters.forEach((char, index) => {
    if (char.groupName) {
      if (!grouped[char.groupName]) {
        grouped[char.groupName] = [];
      }
      grouped[char.groupName].push({ ...char, index });
    } else {
      ungrouped.push({ ...char, index });
    }
  });

  // Sort ungrouped characters by initiative (descending)
  const sortedUngrouped = [...ungrouped].sort((a, b) => b.initiative - a.initiative);

  // Sort groups by first member's initiative (descending)
  const sortedGrouped = Object.entries(grouped).sort(
    ([, a], [, b]) => b[0].initiative - a[0].initiative
  );

  const [expandedGroups, setExpandedGroups] = useState({});

  const toggleGroup = (groupName) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Initiative Order</h2>
      <ul className="space-y-2">
        {/* Render ungrouped characters */}
        {sortedUngrouped.map((char) => (
          <li
            key={char.id}
            className={`p-2 rounded ${
              char.index === currentTurn
                ? "bg-emerald-700 text-white font-bold"
                : "bg-gray-800"
            }`}
          >
            {char.name}{" "}
            <span className="text-gray-400">({char.initiative})</span>
          </li>
        ))}

        {/* Render grouped characters */}
        {sortedGrouped.map(([groupName, members]) => {
          const isExpanded = expandedGroups[groupName];
          const isGroupTurn = members.some((m) => m.index === currentTurn);
          const groupInit = members[0]?.initiative ?? 0;

          return (
            <li key={groupName} className="bg-gray-800 rounded p-2">
              <div
                className={`flex justify-between items-center cursor-pointer ${
                  isGroupTurn ? "bg-emerald-700 text-white font-bold p-2 -m-2 rounded" : ""
                }`}
                onClick={() => toggleGroup(groupName)}
              >
                <span>{isExpanded ? "▼" : "►"} {groupName}</span>
                <span className="text-gray-400">
                  Init: {groupInit}
                </span>
              </div>
              {isExpanded && (
                <ul className="mt-2 ml-4 space-y-1">
                  {members.map((char) => (
                    <li
                      key={char.id}
                      className={`p-1 rounded ${
                        char.index === currentTurn
                          ? "bg-emerald-700 text-white font-bold"
                          : "bg-gray-700"
                      }`}
                    >
                      {char.name}
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
