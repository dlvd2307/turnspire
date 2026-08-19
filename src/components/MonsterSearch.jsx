// src/components/MonsterSearch.jsx
import { useMemo, useRef, useState } from "react";
import useMonsters, { formatCR } from "../hooks/useMonsters";

/**
 * Typeahead over the SRD creature list. Purely a convenience layer:
 * picking a result fills the form fields, which stay fully editable.
 *
 * Props:
 *   onSelect({ name, hp, ac, initiativeBonus }) - called when a result is picked
 */
const MonsterSearch = ({ onSelect }) => {
  const { monsters, loading, error, reload } = useMonsters();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const blurTimer = useRef(null);

  const matches = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    // Prefer names that start with the term ("bat" before "Giant Bat").
    return monsters
      .filter((m) => m.name.toLowerCase().includes(term))
      .sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(term) ? 0 : 1;
        const bStarts = b.name.toLowerCase().startsWith(term) ? 0 : 1;
        return aStarts - bStarts || a.name.localeCompare(b.name);
      })
      .slice(0, 8);
  }, [query, monsters]);

  const choose = (monster) => {
    onSelect(monster);
    setQuery("");
    setOpen(false);
    setHighlight(0);
  };

  const handleKeyDown = (e) => {
    if (!matches.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % matches.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 + matches.length) % matches.length);
    } else if (e.key === "Enter") {
      e.preventDefault(); // don't submit the surrounding form
      choose(matches[highlight]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="relative mb-3">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setHighlight(0);
        }}
        onFocus={() => setOpen(true)}
        // Delay so a click on a result registers before the list closes.
        onBlur={() => {
          blurTimer.current = setTimeout(() => setOpen(false), 120);
        }}
        onKeyDown={handleKeyDown}
        placeholder={
          loading ? "Loading SRD monsters…" : "Search SRD monsters (optional)"
        }
        aria-label="Search SRD monsters"
        className="field w-full"
      />

      {error && (
        <p className="mt-1 text-xs text-amber-300">
          {error}{" "}
          <button
            type="button"
            onClick={reload}
            className="underline hover:text-amber-200"
          >
            Retry
          </button>
        </p>
      )}

      {open && matches.length > 0 && (
        <ul
          className="absolute z-30 mt-1 w-full overflow-hidden rounded-lg border
                     border-slate-700 bg-slate-900 shadow-xl"
        >
          {matches.map((monster, index) => (
            <li key={monster.name}>
              <button
                type="button"
                onMouseDown={() => clearTimeout(blurTimer.current)}
                onClick={() => choose(monster)}
                onMouseEnter={() => setHighlight(index)}
                className={`flex w-full items-center justify-between gap-3 px-3 py-2
                            text-left text-sm transition-colors ${
                              index === highlight
                                ? "bg-slate-700 text-white"
                                : "text-slate-200 hover:bg-slate-800"
                            }`}
              >
                <span className="truncate">{monster.name}</span>
                <span className="shrink-0 tabular-nums text-xs text-slate-400">
                  CR {formatCR(monster.cr)} · {monster.hp} HP · AC {monster.ac}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MonsterSearch;
