import { createContext, useContext, useState, useEffect, useRef } from "react";

const CombatContext = createContext();

export const useCombat = () => useContext(CombatContext);

export const CombatProvider = ({ children }) => {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState(null);
  const [round, setRound] = useState(1);
  const [gridConfig, setGridConfig] = useState({
    rows: 20,
    cols: 20,
    squareSize: 40,
  });
  const [spellMarkers, setSpellMarkers] = useState([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [lastState, setLastState] = useState(null);

  const selectedCharacterRef = useRef(null);
  const selectedMarkerRef = useRef(null);

  useEffect(() => {
    selectedCharacterRef.current = selectedCharacterId;
    selectedMarkerRef.current = selectedMarkerId;
  }, [selectedCharacterId, selectedMarkerId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        const currentChar = selectedCharacterRef.current;
        const currentMarker = selectedMarkerRef.current;

        if (currentMarker) {
          backupState();
          setSpellMarkers((prev) => prev.filter((m) => m.id !== currentMarker));
          setSelectedMarkerId(null);
        } else if (currentChar) {
          backupState();
          setCharacters((prev) =>
            prev.map((c) =>
              c.id === currentChar ? { ...c, defeated: true } : c
            )
          );
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        undoLastChange();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const backupState = () => {
    setLastState({
      characters: JSON.parse(JSON.stringify(characters)),
      spellMarkers: JSON.parse(JSON.stringify(spellMarkers)),
      round,
    });
  };

  const undoLastChange = () => {
    if (!lastState) return;
    setCharacters(lastState.characters);
    setSpellMarkers(lastState.spellMarkers);
    setRound(lastState.round);
    setLastState(null);
  };

  const nextTurn = () => {
    backupState();

    const active = characters
      .filter((c) => !c.defeated)
      .sort((a, b) => b.initiative - a.initiative);

    if (active.length === 0) return;

    const currentIndex = active.findIndex((c) => c.id === selectedCharacterId);
    const nextIndex = (currentIndex + 1) % active.length;

    if (nextIndex === 0) setRound((r) => r + 1);

    setSelectedCharacterId(active[nextIndex].id);

    setCharacters((prev) =>
      prev.map((c) => {
        const updated = { ...c };
        if (updated.conditions) {
          updated.conditions = updated.conditions
            .map((cond) =>
              cond.duration > 0 ? { ...cond, duration: cond.duration - 1 } : cond
            )
            .filter((cond) => cond.duration !== 0);
        }

        if (updated.concentration && updated.concentration.duration > 0) {
          updated.concentration.duration -= 1;
          if (updated.concentration.duration === 0) updated.concentration = null;
        }

        return updated;
      })
    );
  };

  const updateCharacterPosition = (id, position) => {
    backupState();
    setCharacters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, position } : c))
    );
  };

  const selectCharacter = (id) => {
    setSelectedCharacterId(id);
    setSelectedMarkerId(null);
  };

  return (
    <CombatContext.Provider
      value={{
        characters,
        setCharacters,
        selectedCharacterId,
        setSelectedCharacterId,
        round,
        setRound,
        gridConfig,
        setGridConfig,
        updateCharacterPosition,
        nextTurn,
        spellMarkers,
        setSpellMarkers,
        selectedMarkerId,
        setSelectedMarkerId,
        undoLastChange,
        selectCharacter,
      }}
    >
      {children}
    </CombatContext.Provider>
  );
};
