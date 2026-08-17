import { useState } from "react";
import { useCombat } from "../context/CombatContext";
import { v4 as uuidv4 } from "uuid";

const EnemyForm = () => {
  const { setCharacters } = useCombat();
  const [name, setName] = useState("");
  const [hp, setHp] = useState("");
  const [ac, setAc] = useState("");
  const [count, setCount] = useState("");
  const [initiative, setInitiative] = useState("");
  const [asGroup, setAsGroup] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !hp || !ac || !count) return;

    const total = parseInt(count);
    const grouped = asGroup && total > 1;

    // A group shares one initiative roll, so they act together in the order.
    const sharedInitiative =
      initiative !== "" ? parseInt(initiative) : Math.floor(Math.random() * 20) + 1;

    const newEnemies = Array.from({ length: total }).map((_, i) => ({
      id: uuidv4(),
      name: total > 1 ? `${name} ${i + 1}` : name,
      hp: parseInt(hp),
      maxHp: parseInt(hp),
      tempHp: 0,
      ac: parseInt(ac),
      initiative: grouped
        ? sharedInitiative
        : initiative !== ""
        ? parseInt(initiative)
        : Math.floor(Math.random() * 20) + 1,
      type: "enemy",
      groupName: grouped ? name : undefined,
      conditions: [],
      concentration: null,
      defeated: false,
      deathSaves: { success: 0, fail: 0, stable: false },
      position: { x: 0, y: 0 },
    }));

    setCharacters((prev) => [...prev, ...newEnemies]);
    setName("");
    setHp("");
    setAc("");
    setCount("");
    setInitiative("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Add Enemies / Groups</h2>
      <div className="flex gap-2 items-center flex-wrap">
        <input
          type="text"
          placeholder="Enemy Name"
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

      <label className="mt-2 flex items-center gap-2 text-sm text-gray-300">
        <input
          type="checkbox"
          checked={asGroup}
          onChange={() => setAsGroup(!asGroup)}
          className="accent-red-600"
        />
        Group them (one shared initiative, collapsible in the turn order)
      </label>
    </form>
  );
};

export default EnemyForm;
