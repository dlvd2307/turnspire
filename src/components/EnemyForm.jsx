import { useState } from "react";
import { useCombat } from "../context/CombatContext";
import { v4 as uuidv4 } from "uuid";

const EnemyForm = () => {
  const { setCharacters } = useCombat();
  const [name, setName] = useState("");
  const [hp, setHp] = useState("");
  const [count, setCount] = useState("");
  const [initiative, setInitiative] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !hp || !count) return;

    const newEnemies = Array.from({ length: parseInt(count) }).map((_, i) => ({
      id: uuidv4(),
      name: count > 1 ? `${name} ${i + 1}` : name,
      hp: parseInt(hp),
      maxHp: parseInt(hp),
      initiative: initiative !== "" ? parseInt(initiative) : Math.floor(Math.random() * 20) + 1,
      type: "enemy",
      conditions: [],
      concentration: null,
      defeated: false,
      position: { x: 0, y: 0 },
    }));

    setCharacters((prev) => [...prev, ...newEnemies]);
    setName("");
    setHp("");
    setCount("");
    setInitiative("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Add Enemies / Groups</h2>
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Enemy Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-2 py-1 rounded bg-gray-800 text-white w-full"
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
          min="1"
          placeholder="#"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          className="w-16 px-2 py-1 rounded bg-gray-800 text-white"
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
          className="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded"
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default EnemyForm;
