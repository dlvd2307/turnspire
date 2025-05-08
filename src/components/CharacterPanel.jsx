import { useCombat } from "../context/CombatContext";

const CharacterPanel = () => {
  const {
    characters,
    selectedCharacterId,
    updateCharacterHP,
    selectCharacter,
    setCharacters,
  } = useCombat();

  const character = characters.find((c) => c.id === selectedCharacterId);
  if (!character) return null;

  const removeCharacter = () => {
    const confirmed = confirm(`Remove ${character.name} from the board?`);
    if (!confirmed) return;

    const updated = characters.filter((c) => c.id !== character.id);
    setCharacters(updated);
    selectCharacter(null);
  };

  const markAsDefeated = () => {
    const confirmed = confirm(`Mark ${character.name} as defeated?`);
    if (!confirmed) return;

    const updated = characters.map((c) =>
      c.id === character.id ? { ...c, defeated: true } : c
    );
    setCharacters(updated);
    selectCharacter(null);
  };

  return (
    <div className="fixed right-4 top-20 w-72 bg-gray-900 text-white p-4 rounded shadow-lg border border-gray-700 z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{character.name}</h3>
        <button
          onClick={() => selectCharacter(null)}
          className="text-sm text-red-400 hover:text-red-600"
        >
          Close
        </button>
      </div>

      {/* HP Control */}
      <label className="block mb-4">
        HP:
        <input
          type="number"
          value={character.hp}
          onChange={(e) =>
            updateCharacterHP(character.id, parseInt(e.target.value))
          }
          className="w-full mt-1 p-2 bg-gray-800 text-white rounded"
        />
      </label>

      {/* Active Conditions */}
      {character.conditions.length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm font-semibold mb-1">Conditions:</h4>
          <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
            {character.conditions.map((cond, i) => (
              <li key={i}>
                {cond.name} ({cond.remainingRounds} round
                {cond.remainingRounds !== 1 ? "s" : ""} left)
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Active Concentration */}
      {character.concentration && (
        <div className="mb-2">
          <h4 className="text-sm font-semibold mb-1">Concentration:</h4>
          <p className="text-sm text-blue-300">
            {character.concentration.spell} (
            {character.concentration.remainingRounds} round
            {character.concentration.remainingRounds !== 1 ? "s" : ""} left)
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <button
        onClick={removeCharacter}
        className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
      >
        Remove Character
      </button>
      <button
        onClick={markAsDefeated}
        className="mt-2 w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded"
      >
        Mark as Defeated
      </button>
    </div>
  );
};

export default CharacterPanel;
