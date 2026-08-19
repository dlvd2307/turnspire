// src/hooks/useMonsters.js
import { useCallback, useEffect, useState } from "react";

// SRD 5.2 (the 2024 rules) released under CC-BY-4.0, served by Open5e.
// Everything is pulled once and cached, so searching is instant and offline-safe.
const DIRECT_URL =
  "https://api.open5e.com/v2/creatures/?document__key__in=srd-2024" +
  "&fields=name,hit_points,armor_class,initiative_bonus,challenge_rating" +
  "&limit=500";

// Fallback if the browser blocks the cross-origin request (see /api/monsters.js).
const PROXY_URL = "/api/monsters";

const CACHE_KEY = "turnspire-monsters-v1";
const CACHE_TTL = 1000 * 60 * 60 * 24 * 30; // 30 days

const readCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw);
    if (!cached?.data?.length) return null;
    if (Date.now() - cached.fetchedAt > CACHE_TTL) return null;
    return cached.data;
  } catch {
    return null;
  }
};

const writeCache = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), data }));
  } catch {
    // Storage full or unavailable - not fatal, we just refetch next time.
  }
};

const normalise = (results) =>
  results
    .filter((c) => c?.name && Number.isFinite(c.hit_points))
    .map((c) => ({
      name: c.name,
      hp: c.hit_points,
      ac: c.armor_class ?? 10,
      initiativeBonus: c.initiative_bonus ?? 0,
      cr: c.challenge_rating,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

export const formatCR = (cr) => {
  if (cr === null || cr === undefined) return "?";
  if (cr === 0.125) return "1/8";
  if (cr === 0.25) return "1/4";
  if (cr === 0.5) return "1/2";
  return String(cr);
};

export default function useMonsters() {
  const [monsters, setMonsters] = useState(() => readCache() ?? []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async ({ force = false } = {}) => {
    if (!force) {
      const cached = readCache();
      if (cached) {
        setMonsters(cached);
        return;
      }
    }

    setLoading(true);
    setError(null);

    for (const url of [DIRECT_URL, PROXY_URL]) {
      try {
        const response = await fetch(url);
        if (!response.ok) continue;
        const json = await response.json();
        const data = normalise(json.results || []);
        if (!data.length) continue;
        setMonsters(data);
        writeCache(data);
        setLoading(false);
        return;
      } catch {
        // Try the next URL - a CORS failure lands here.
      }
    }

    setError("Couldn't load the monster list. You can still add enemies manually.");
    setLoading(false);
  }, []);

  useEffect(() => {
    if (monsters.length === 0) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { monsters, loading, error, reload: () => load({ force: true }) };
}
