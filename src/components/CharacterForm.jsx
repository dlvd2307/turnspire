import { useState } from "react";
import { useCombat } from "../context/CombatContext";
import { v4 as uuidv4 } from "uuid";

const CharacterForm = () => {
  const { setCharacters } = useCombat();
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
      ac: parseInt(ac),
      initiative: initiative !== "" ? parseInt(initiative) : Math.floor(Math.random() * 20) + 1,
      type: "player",
      conditions: [],
      concentration: null,
      defeated: false,
      position: { x: 0, y: 0 },
    };

    setCharacters((prev) => [...prev, newCharacter]);
    setName("");
    setHp("");
    setAc("");
    setInitiative("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Add Character</h2>
      <div className="flex gap-2 items-center flex-wrap">
        <input
          type="text"
          placeholder="Character Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-2 py-1 rounded bg-gray-800 text-white w-full sm:w-auto"
        />
        <input
          type="number"
          min="1"
          placeholder="HP"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
          className="w-20 px-2 py-1 rounded bg-gray-800 text-white"
        />
        <input
          type="number"
          min="0"
          placeholder="AC"
          value={ac}
          onChange={(e) => setAc(e.target.value)}
          className="w-20 px-2 py-1 rounded bg-gray-800 text-white"
        />
        <input
          type="number"
          min="0"
          placeholder="Initiative"
          value={initiative}
          onChange={(e) => setInitiative(e.target.value)}
          className="w-24 px-2 py-1 rounded bg-gray-800 text-white"
        />
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded"
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default CharacterForm;
