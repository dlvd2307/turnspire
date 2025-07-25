import { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const CombatContext = createContext();

export const CombatProvider = ({ children }) => {
  const [characters, setCharacters] = useState([]);
  const [currentTurnId, setCurrentTurnId] = useState(null);
  const [round, setRound] = useState(0);
  const [selectedCharacterId, setSelectedCharacterId] = useState(null);
  const [gridConfig, setGridConfig] = useState({
    rows: 20,
    cols: 20,
    squareSize: 40,
    backgroundType: "none",
    customBackground: null,
  });
  const [spellMarkers, setSpellMarkers] = useState([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadedFromStorage, setLoadedFromStorage] = useState(false);

  const saveHistory = () => {
    setHistory((prev) => [
      ...prev.slice(-19),
      {
        characters: JSON.parse(JSON.stringify(characters)),
        round,
        currentTurnId,
        spellMarkers: JSON.parse(JSON.stringify(spellMarkers)),
      },
    ]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setCharacters(last.characters);
    setRound(last.round);
    setCurrentTurnId(last.currentTurnId);
    setSpellMarkers(last.spellMarkers);
    setHistory((prev) => prev.slice(0, -1));
  };

  useEffect(() => {
    const handleUndo = (e) => {
      const isInputFocused = ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName);
      if (isInputFocused) return;
      if (e.type === "undo-action" || (e.ctrlKey && e.key === "z")) {
        e.preventDefault();
        undo();
      }
    };
    window.addEventListener("undo-action", handleUndo);
    window.addEventListener("keydown", handleUndo);
    return () => {
      window.removeEventListener("undo-action", handleUndo);
      window.removeEventListener("keydown", handleUndo);
    };
  }, [history]);

  useEffect(() => {
    const handleSetRound = (e) => setRound(e.detail);
    const handleSetCurrentTurn = (e) => setCurrentTurnId(e.detail);
    window.addEventListener("set-round", handleSetRound);
    window.addEventListener("set-current-turn", handleSetCurrentTurn);
    return () => {
      window.removeEventListener("set-round", handleSetRound);
      window.removeEventListener("set-current-turn", handleSetCurrentTurn);
    };
  }, []);

  const initializeBlankState = () => {
    setCharacters([]);
    setRound(0);
    setCurrentTurnId(null);
    setSpellMarkers([]);
    setGridConfig({
      rows: 20,
      cols: 20,
      squareSize: 40,
      backgroundType: "none",
      customBackground: null,
    });
  };

  useEffect(() => {
    const saved = localStorage.getItem("turnspire-autosave");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setCharacters(data.characters || []);
        setGridConfig(data.gridConfig || { rows: 20, cols: 20, squareSize: 40 });
        setSpellMarkers(data.spellMarkers || []);
        setSelectedCharacterId(null);

        if (typeof data.round === "number") {
          setTimeout(() => window.dispatchEvent(new CustomEvent("set-round", { detail: data.round })), 0);
        }

        if (data.currentTurnId) {
          setTimeout(
            () => window.dispatchEvent(new CustomEvent("set-current-turn", { detail: data.currentTurnId })),
            0
          );
        }
      } catch {
        console.warn("Failed to load autosave.");
        initializeBlankState();
      }
    } else {
      initializeBlankState();
    }

    setLoadedFromStorage(true);
  }, []);

  useEffect(() => {
    if (!loadedFromStorage) return;
    const data = {
      characters,
      round,
      currentTurnId,
      gridConfig,
      spellMarkers,
    };
    localStorage.setItem("turnspire-autosave", JSON.stringify(data));
  }, [characters, round, currentTurnId, gridConfig, spellMarkers, loadedFromStorage]);

  const addCharacter = (char) => {
    const newChar = {
      ...char,
      id: uuidv4(),
      position: { x: 0, y: 0 },
      conditions: [],
      concentration: null,
      defeated: false,
      deathSaves: { success: 0, fail: 0, stable: false },
    };
    setCharacters((prev) => {
      const updated = [...prev, newChar];
      if (updated.length === 1) setCurrentTurnId(newChar.id);
      return updated;
    });
  };

  const updateCharacterPosition = (id, position) => {
    saveHistory();
    setCharacters((prev) =>
      prev.map((char) => (char.id === id ? { ...char, position } : char))
    );
  };

  const resetDeathSaves = (char) => ({
    ...char,
    deathSaves: { success: 0, fail: 0, stable: false },
  });

  const ensureDeathSaves = (char) =>
    char.deathSaves
      ? char
      : { ...char, deathSaves: { success: 0, fail: 0, stable: false } };

  const updateCharacterHP = (id, newHP) => {
    saveHistory();
    setCharacters((prev) =>
      prev.map((char) => {
        if (char.id !== id) return char;
        const clamped = Math.max(0, Math.min(newHP, char.maxHp));
        // If they heal above 0 HP, clear death saves & stable status.
        if (clamped > 0) {
          return {
            ...resetDeathSaves(char),
            hp: clamped,
            defeated: false,
          };
        }
        // If they drop to 0, ensure death save state exists.
        return ensureDeathSaves({ ...char, hp: clamped });
      })
    );
  };

  const updateCharacterAC = (id, newAC) => {
    saveHistory();
    setCharacters((prev) =>
      prev.map((char) =>
        char.id === id ? { ...char, ac: Math.max(0, parseInt(newAC) || 0) } : char
      )
    );
  };

  const updateCharacterInitiative = (id, newValue) => {
    setCharacters((prev) =>
      prev.map((char) =>
        char.id === id ? { ...char, initiative: parseInt(newValue) || 0 } : char
      )
    );
  };

  const recordDeathSaveSuccess = (id) => {
    setCharacters((prev) =>
      prev.map((char) => {
        if (char.id !== id) return char;
        const ds = ensureDeathSaves(char).deathSaves;
        if (ds.stable || char.defeated) return char; // already done
        const success = Math.min(3, ds.success + 1);
        const stable = success >= 3;
        return {
          ...char,
          deathSaves: { ...ds, success, stable },
        };
      })
    );
  };

  const recordDeathSaveFailure = (id) => {
    setCharacters((prev) =>
      prev.map((char) => {
        if (char.id !== id) return char;
        const ds = ensureDeathSaves(char).deathSaves;
        if (ds.stable || char.defeated) return char; // already done
        const fail = Math.min(3, ds.fail + 1);
        const defeated = fail >= 3 ? true : char.defeated;
        return {
          ...char,
          deathSaves: { ...ds, fail },
          defeated,
        };
      })
    );
  };

  const clearDeathSaves = (id) => {
    setCharacters((prev) =>
      prev.map((char) => (char.id === id ? resetDeathSaves(char) : char))
    );
  };

  const selectCharacter = (id) => {
    setSelectedCharacterId(id);
  };

  const applyCondition = (id, condition) => {
    saveHistory();
    setCharacters((prev) =>
      prev.map((char) =>
        char.id === id ? { ...char, conditions: [...char.conditions, condition] } : char
      )
    );
  };

  const applyConcentration = (id, spell) => {
    saveHistory();
    setCharacters((prev) =>
      prev.map((char) => (char.id === id ? { ...char, concentration: spell } : char))
    );
  };

  const removeCondition = (id, conditionName) => {
    saveHistory();
    setCharacters((prev) =>
      prev.map((char) =>
        char.id === id
          ? { ...char, conditions: char.conditions.filter((c) => c.name !== conditionName) }
          : char
      )
    );
  };

  const clearConcentration = (id) => {
    saveHistory();
    setCharacters((prev) =>
      prev.map((char) => (char.id === id ? { ...char, concentration: null } : char))
    );
  };

  const markDefeated = (id) => {
    saveHistory();
    setCharacters((prev) =>
      prev.map((char) => (char.id === id ? { ...char, defeated: true } : char))
    );
  };

  const removeCharacter = (id) => {
    saveHistory();
    setCharacters((prev) => prev.filter((char) => char.id !== id));
    if (currentTurnId === id) {
      setCurrentTurnId(null);
    }
  };

  const resetCombat = () => {
    setCharacters([]);
    setSpellMarkers([]);
    setRound(0);
    setCurrentTurnId(null);
    setSelectedCharacterId(null);
    setGridConfig((prev) => ({
      ...prev,
      rows: 20,
      cols: 20,
      squareSize: 40,
      backgroundType: "none",
      customBackground: null,
    }));
  };

  const softResetCombat = () => {
    setCharacters((prev) =>
      prev
        .filter((char) => char.type !== "enemy")
        .map((char) => ({
          ...resetDeathSaves(char),
          conditions: [],
          concentration: null,
          defeated: false,
          initiative: null,
          position: { x: 0, y: 0 },
        }))
    );
    setSpellMarkers([]);
    setRound(0);
    setCurrentTurnId(null);
    setSelectedCharacterId(null);
    setGridConfig((prev) => ({
      ...prev,
      rows: 20,
      cols: 20,
      squareSize: 40,
      backgroundType: "none",
      customBackground: null,
    }));
  };

  const nextTurn = () => {
    const active = characters.filter((c) => !c.defeated && c.initiative != null);
    const sorted = [...active].sort((a, b) => b.initiative - a.initiative);

    if (!sorted.length) return;

    const currentIndex = sorted.findIndex((c) => c.id === currentTurnId);
    const nextIndex = (currentIndex + 1) % sorted.length;
    const nextChar = sorted[nextIndex];
    setCurrentTurnId(nextChar.id);
    setSelectedCharacterId(nextChar.id);

    const isNewRound = nextIndex === 0;
    if (isNewRound) {
      setRound((r) => r + 1);
      saveHistory();
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
    }
  };

  return (
    <CombatContext.Provider
      value={{
        characters,
        setCharacters,
        addCharacter,
        updateCharacterPosition,
        updateCharacterHP,
        updateCharacterAC,
        updateCharacterInitiative,
        recordDeathSaveSuccess,
        recordDeathSaveFailure,
        clearDeathSaves,
        selectCharacter,
        selectedCharacterId,
        applyCondition,
        applyConcentration,
        removeCondition,
        clearConcentration,
        markDefeated,
        removeCharacter,
        nextTurn,
        currentTurnId,
        round,
        gridConfig,
        setGridConfig,
        spellMarkers,
        setSpellMarkers,
        selectedMarkerId,
        setSelectedMarkerId,
        undo,
        loadedFromStorage,
        resetCombat,
        softResetCombat,
      }}
    >
      {children}
    </CombatContext.Provider>
  );
};

export const useCombat = () => useContext(CombatContext);
