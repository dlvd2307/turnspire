import { useState } from "react";
import { useCombat } from "../context/CombatContext";
import { v4 as uuidv4 } from "uuid";

const CharacterForm = () => {
  const { setCharacters, softResetCombat } = useCombat(); // <-- Added softResetCombat
  const [name, setName] = useState("");
  const [hp, setHp] = useState("");
  const [ac, setAc] = useState("");
  const [initiative, setInitiative] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !hp || !ac) return;

    const newCharacter = {
      id: uuidv4(),
      name,
      hp: parseInt(hp),
      maxHp: parseInt(hp),
      tempHp: 0,
      ac: parseInt(ac),
      initiative: initiative !== "" ? parseInt(initiative) : Math.floor(Math.random() * 20) + 1,
      type: "player",
      conditions: [],
      concentration: null,
      defeated: false,
      deathSaves: { success: 0, fail: 0, stable: false },
      position: { x: 0, y: 0 },
    };

    setCharacters((prev) => [...prev, newCharacter]);
    setName("");
    setHp("");
    setAc("");
    setInitiative("");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="panel">
        <h2 className="panel-title">Add Character</h2>
        <div className="flex gap-2 items-center flex-wrap">
          <input
            type="text"
            placeholder="Character Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="field w-full sm:w-auto"
          />
          <input
            type="number"
            min="1"
            placeholder="HP"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
            className="field field-sm w-20"
          />
          <input
            type="number"
            min="0"
            placeholder="AC"
            value={ac}
            onChange={(e) => setAc(e.target.value)}
            className="field field-sm w-20"
          />
          <input
            type="number"
            min="0"
            placeholder="Initiative"
            value={initiative}
            onChange={(e) => setInitiative(e.target.value)}
            className="field field-sm w-24"
          />
          <button
            type="submit"
            className="btn btn-primary"
          >
            Add
          </button>
        </div>
      </form>

      <button
        onClick={softResetCombat}
        className="btn btn-secondary btn-sm"
        title="Clear enemies and combat state, keep your party"
      >
        Soft Reset (Keep Party)
      </button>
    </>
  );
};

export default CharacterForm;
