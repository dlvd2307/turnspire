import { useCombat } from "../context/CombatContext";

const StatusOverview = () => {
  const { characters } = useCombat();

  const charactersWithStatuses = characters.filter(
    (char) => char.conditions?.length > 0 || char.concentration
  );

  if (charactersWithStatuses.length === 0) return null;

  return (
    <div className="bg-gray-800 p-4 rounded mt-4">
      <h3 className="text-lg font-semibold mb-3">Active Effects</h3>
      <div className="space-y-4">
        {charactersWithStatuses.map((char) => (
          <div key={char.id}>
            <h4 className="font-bold">{char.name}</h4>
            <ul className="list-disc list-inside text-sm ml-2 mt-1 space-y-1">
              {char.conditions?.map((cond, idx) => (
                <li
                  key={idx}
                  className={`${
                    cond.remainingRounds === 1
                      ? "text-yellow-300 italic"
                      : ""
                  }`}
                >
                  {cond.name} ({cond.remainingRounds} round
                  {cond.remainingRounds !== 1 ? "s" : ""} left)
                </li>
              ))}
              {char.concentration && (
                <li
                  className={`${
                    char.concentration.remainingRounds === 1
                      ? "text-yellow-300 italic"
                      : ""
                  }`}
                >
                  Concentrating on{" "}
                  <em>{char.concentration.spell}</em> (
                  {char.concentration.remainingRounds} round
                  {char.concentration.remainingRounds !== 1 ? "s" : ""} left)
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusOverview;
