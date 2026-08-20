import { createContext, useContext, useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { parseScenario } from "../utils/scenario";
import { safeGet, safeSet } from "../utils/safeStorage";

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
  // Remembers where the current combatant sits in the initiative order, so the
  // turn can be resumed if they're removed or defeated mid-round.
  const turnAnchorRef = useRef(null);
  const [loadedFromStorage, setLoadedFromStorage] = useState(false);

  useEffect(() => {
    const current = characters.find((c) => c.id === currentTurnId);
    if (current) {
      turnAnchorRef.current = { id: current.id, initiative: current.initiative };
    }
  }, [currentTurnId, characters]);

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
    const saved = safeGet("turnspire-autosave");
    if (saved) {
      try {
        const data = parseScenario(saved) || {};
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
    safeSet("turnspire-autosave", data);
  }, [characters, round, currentTurnId, gridConfig, spellMarkers, loadedFromStorage]);

  const addCharacter = (char) => {
    const newChar = {
      ...char,
      id: uuidv4(),
      position: { x: 0, y: 0 },
      conditions: [],
      concentration: null,
      defeated: false,
      tempHp: 0,
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

  // Temporary hit points are absorbed before real ones, and are never
  // restored by healing - they only go down, or get replaced outright.
  const applyDamage = (id, amount) => {
    const damage = Math.max(0, parseInt(amount) || 0);
    if (!damage) return;
    saveHistory();
    setCharacters((prev) =>
      prev.map((char) => {
        if (char.id !== id) return char;
        const temp = char.tempHp ?? 0;
        const absorbed = Math.min(temp, damage);
        const remainder = damage - absorbed;
        const hp = Math.max(0, char.hp - remainder);
        const updated = { ...char, tempHp: temp - absorbed, hp };
        return hp === 0 ? ensureDeathSaves(updated) : updated;
      })
    );
  };

  const applyHealing = (id, amount) => {
    const healing = Math.max(0, parseInt(amount) || 0);
    if (!healing) return;
    saveHistory();
    setCharacters((prev) =>
      prev.map((char) => {
        if (char.id !== id) return char;
        // Healing doesn't raise the dead - use the HP field directly for that.
        if (char.defeated) return char;
        const hp = Math.min(char.maxHp, char.hp + healing);
        return hp > 0 ? { ...resetDeathSaves(char), hp } : char;
      })
    );
  };

  // Temp HP doesn't stack in 5e - a new source replaces the old one.
  const setTemporaryHP = (id, value) => {
    saveHistory();
    setCharacters((prev) =>
      prev.map((char) =>
        char.id === id
          ? { ...char, tempHp: Math.max(0, parseInt(value) || 0) }
          : char
      )
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
    const removed = characters.find((char) => char.id === id);
    const remaining = characters.filter((char) => char.id !== id);
    setCharacters(remaining);

    if (currentTurnId !== id) return;

    // Deleting whoever's turn it is should hand the turn straight to the next
    // combatant, not leave the order pointing at nobody.
    const sorted = remaining
      .filter((c) => !c.defeated && c.initiative != null)
      .sort((a, b) => b.initiative - a.initiative);

    const anchorInitiative =
      removed?.initiative ?? turnAnchorRef.current?.initiative ?? null;

    const resumeIndex =
      anchorInitiative === null
        ? -1
        : sorted.findIndex((c) => c.initiative <= anchorInitiative);

    if (resumeIndex === -1) {
      // They were last in the order (or nobody's left), so the next press
      // should begin a new round properly - conditions tick, round advances.
      setCurrentTurnId(null);
      return;
    }

    setCurrentTurnId(sorted[resumeIndex].id);
    setSelectedCharacterId(sorted[resumeIndex].id);
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
          tempHp: 0,
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

    let nextIndex;
    let isNewRound;

    if (currentIndex !== -1) {
      nextIndex = (currentIndex + 1) % sorted.length;
      isNewRound = nextIndex === 0;
    } else {
      // Whoever's turn it was has left the fight - deleted from the board or
      // marked defeated. Pick up from their position in the order rather than
      // snapping back to the top and burning a round.
      const anchor = turnAnchorRef.current;
      const resumeIndex = anchor
        ? sorted.findIndex((c) => c.initiative <= anchor.initiative)
        : -1;

      if (resumeIndex === -1) {
        // They were last in the order (or we have nothing to go on), so this
        // genuinely is the top of a new round.
        nextIndex = 0;
        isNewRound = true;
      } else {
        nextIndex = resumeIndex;
        isNewRound = false;
      }
    }

    const nextChar = sorted[nextIndex];
    setCurrentTurnId(nextChar.id);
    setSelectedCharacterId(nextChar.id);
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
        applyDamage,
        applyHealing,
        setTemporaryHP,
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
