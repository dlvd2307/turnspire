import { useState } from "react";
import { useCombat } from "../context/CombatContext";
import { v4 as uuidv4 } from "uuid";
import MonsterSearch from "./MonsterSearch";

const EnemyForm = () => {
  const { setCharacters } = useCombat();
  const [name, setName] = useState("");
  const [hp, setHp] = useState("");
  const [ac, setAc] = useState("");
  const [count, setCount] = useState("");
  const [initiative, setInitiative] = useState("");
  const [asGroup, setAsGroup] = useState(true);
  // Only set when a stat block is pulled in; manual entries roll a flat d20.
  const [initiativeBonus, setInitiativeBonus] = useState(null);
  const [sourceName, setSourceName] = useState(null);

  const applyMonster = (monster) => {
    setName(monster.name);
    setHp(String(monster.hp));
    setAc(String(monster.ac));
    setInitiativeBonus(monster.initiativeBonus);
    setSourceName(monster.name);
    if (count === "") setCount("1");
  };

  const clearForm = () => {
    setName("");
    setHp("");
    setAc("");
    setCount("");
    setInitiative("");
    setInitiativeBonus(null);
    setSourceName(null);
  };

  const rollInitiative = () =>
    Math.floor(Math.random() * 20) + 1 + (initiativeBonus ?? 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !hp || !ac || !count) return;

    const total = parseInt(count);
    const grouped = asGroup && total > 1;

    // A group shares one initiative roll, so they act together in the order.
    const sharedInitiative =
      initiative !== "" ? parseInt(initiative) : rollInitiative();

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
        : rollInitiative(),
      type: "enemy",
      groupName: grouped ? name : undefined,
      conditions: [],
      concentration: null,
      defeated: false,
      deathSaves: { success: 0, fail: 0, stable: false },
      position: { x: 0, y: 0 },
    }));

    setCharacters((prev) => [...prev, ...newEnemies]);
    clearForm();
  };

  return (
    <form onSubmit={handleSubmit} className="panel">
      <h2 className="panel-title">Add Enemies / Groups</h2>

      <MonsterSearch onSelect={applyMonster} />

      {sourceName && (
        <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
          <span className="tag">SRD: {sourceName}</span>
          <span>Edit any field below to customise.</span>
          <button
            type="button"
            onClick={clearForm}
            className="underline hover:text-slate-200"
          >
            Clear
          </button>
        </div>
      )}

      <div className="flex gap-2 items-center flex-wrap">
        <input
          type="text"
          placeholder="Enemy Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSourceName(null);
          }}
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
          min="1"
          placeholder="#"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          className="field field-sm w-16"
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

      <label className="mt-2 flex items-center gap-2 text-sm text-slate-300">
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
