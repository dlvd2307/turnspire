import { useCombat } from "../context/CombatContext";

const TurnController = () => {
  const { characters, currentTurn, round, nextTurn } = useCombat();

  const currentCharacter = characters[currentTurn];

  return (
    <div className="bg-gray-800 p-4 rounded">
      <h2 className="text-xl font-semibold mb-2">Turn Tracker</h2>
      <p className="mb-2">Round: <strong>{round}</strong></p>
      {currentCharacter ? (
        <p className="mb-4">
          Current Turn: <strong>{currentCharacter.name}</strong>
        </p>
      ) : (
        <p className="mb-4 italic text-gray-400">No characters yet.</p>
      )}
      <button
        onClick={nextTurn}
        disabled={!characters.length}
        className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-white disabled:opacity-50"
      >
        Next Turn
      </button>
    </div>
  );
};

export default TurnController;
