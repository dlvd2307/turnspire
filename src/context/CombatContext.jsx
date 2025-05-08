import { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const CombatContext = createContext();

export const CombatProvider = ({ children }) => {
  const [characters, setCharacters] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [round, setRound] = useState(1);
  const [selectedCharacterId, setSelectedCharacterId] = useState(null);
  const [gridConfig, setGridConfig] = useState({ rows: 20, cols: 20, squareSize: 40 });
  const [spellMarkers, setSpellMarkers] = useState([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);

  const addCharacter = (char) => {
    const newChar = {
      ...char,
      id: uuidv4(),
      position: { x: 0, y: 0 },
      conditions: [],
      concentration: null,
      defeated: false,
    };
    setCharacters((prev) => [...prev, newChar]);
  };

  const updateCharacterPosition = (id, position) => {
    setCharacters((prev) =>
      prev.map((char) => (char.id === id ? { ...char, position } : char))
    );
  };

  const selectCharacter = (id) => {
    setSelectedCharacterId(id);
  };

  const applyCondition = (id, condition) => {
    setCharacters((prev) =>
      prev.map((char) =>
        char.id === id
          ? { ...char, conditions: [...char.conditions, condition] }
          : char
      )
    );
  };

  const applyConcentration = (id, spell) => {
    setCharacters((prev) =>
      prev.map((char) =>
        char.id === id ? { ...char, concentration: spell } : char
      )
    );
  };

  const removeCondition = (id, conditionName) => {
    setCharacters((prev) =>
      prev.map((char) =>
        char.id === id
          ? {
              ...char,
              conditions: char.conditions.filter((c) => c.name !== conditionName),
            }
          : char
      )
    );
  };

  const clearConcentration = (id) => {
    setCharacters((prev) =>
      prev.map((char) =>
        char.id === id ? { ...char, concentration: null } : char
      )
    );
  };

  const markDefeated = (id) => {
    setCharacters((prev) =>
      prev.map((char) => (char.id === id ? { ...char, defeated: true } : char))
    );
  };

  const removeCharacter = (id) => {
    setCharacters((prev) => prev.filter((char) => char.id !== id));
  };

  const nextTurn = () => {
    const activeChars = characters.filter((c) => !c.defeated);
    if (activeChars.length === 0) return;

    const sorted = [...activeChars].sort((a, b) => b.initiative - a.initiative);
    const nextIndex = (currentTurn + 1) % sorted.length;

    setCurrentTurn(nextIndex);
    if (nextIndex === 0) {
      setRound((r) => r + 1);
    }

    // Tick down conditions and concentration
    setCharacters((prev) =>
      prev.map((char) => {
        const newConditions = char.conditions
          .map((c) => ({ ...c, remainingRounds: c.remainingRounds - 1 }))
          .filter((c) => c.remainingRounds > 0);

        const newConcentration =
          char.concentration && char.concentration.remainingRounds > 1
            ? {
                ...char.concentration,
                remainingRounds: char.concentration.remainingRounds - 1,
              }
            : null;

        return {
          ...char,
          conditions: newConditions,
          concentration: newConcentration,
        };
      })
    );
  };

  return (
    <CombatContext.Provider
      value={{
        characters,
        setCharacters,
        addCharacter,
        updateCharacterPosition,
        selectCharacter,
        selectedCharacterId,
        applyCondition,
        applyConcentration,
        removeCondition,
        clearConcentration,
        markDefeated,
        removeCharacter,
        nextTurn,
        currentTurn,
        round,
        gridConfig,
        setGridConfig,
        spellMarkers,
        setSpellMarkers,
        selectedMarkerId,
        setSelectedMarkerId,
      }}
    >
      {children}
    </CombatContext.Provider>
  );
};

export const useCombat = () => useContext(CombatContext);
