// src/utils/scenario.js
// Scenario files are untrusted input: a user can hand-edit one, or be sent one
// by someone else. Rather than trusting the shape, we rebuild each object from
// known fields only, so unexpected keys are dropped and every value is clamped.

const MAX_CHARACTERS = 200;
const MAX_MARKERS = 200;
const MAX_CONDITIONS = 50;
const MAX_NAME = 100;
const MAX_HP = 100000;
const MAX_GRID = 200;

// Only bitmap image data URLs. SVG is excluded because it can carry script,
// and while an <img> won't execute it, there's no reason to accept it here.
const SAFE_IMAGE_RE = /^data:image\/(png|jpeg|jpg|gif|webp);base64,[a-z0-9+/=\s]+$/i;

const str = (value, max = MAX_NAME) =>
  typeof value === "string" ? value.slice(0, max) : "";

const int = (value, { min = 0, max = MAX_HP, fallback = 0 } = {}) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
};

export const isSafeImageDataUrl = (value) =>
  typeof value === "string" &&
  value.length < 8_000_000 &&
  SAFE_IMAGE_RE.test(value);

const cleanCondition = (condition) => ({
  name: str(condition?.name, 60),
  remainingRounds: int(condition?.remainingRounds, { min: 0, max: 1000, fallback: 1 }),
});

const cleanCharacter = (char) => {
  const maxHp = int(char?.maxHp, { min: 1, fallback: 1 });
  return {
    id: str(char?.id, 64) || crypto.randomUUID(),
    name: str(char?.name),
    maxHp,
    hp: int(char?.hp, { min: 0, max: maxHp, fallback: maxHp }),
    tempHp: int(char?.tempHp, { min: 0, max: MAX_HP, fallback: 0 }),
    ac: int(char?.ac, { min: 0, max: 100, fallback: 10 }),
    initiative:
      char?.initiative === null || char?.initiative === undefined
        ? null
        : int(char.initiative, { min: -50, max: 100, fallback: 0 }),
    type: char?.type === "enemy" ? "enemy" : "player",
    groupName: char?.groupName ? str(char.groupName, 60) : undefined,
    conditions: Array.isArray(char?.conditions)
      ? char.conditions.slice(0, MAX_CONDITIONS).map(cleanCondition)
      : [],
    concentration: char?.concentration
      ? {
          spell: str(char.concentration.spell, 100),
          remainingRounds: int(char.concentration.remainingRounds, {
            min: 0,
            max: 1000,
            fallback: 1,
          }),
        }
      : null,
    defeated: Boolean(char?.defeated),
    deathSaves: {
      success: int(char?.deathSaves?.success, { min: 0, max: 3, fallback: 0 }),
      fail: int(char?.deathSaves?.fail, { min: 0, max: 3, fallback: 0 }),
      stable: Boolean(char?.deathSaves?.stable),
    },
    position: {
      x: int(char?.position?.x, { min: -100000, max: 100000, fallback: 0 }),
      y: int(char?.position?.y, { min: -100000, max: 100000, fallback: 0 }),
    },
  };
};

const cleanMarker = (marker) => ({
  id: str(marker?.id, 100) || crypto.randomUUID(),
  label: str(marker?.label, 60),
  shape: ["cube", "sphere", "cone"].includes(marker?.shape) ? marker.shape : "cube",
  sizeInFeet: int(marker?.sizeInFeet, { min: 0, max: 1000, fallback: 5 }),
  squares: int(marker?.squares, { min: 0, max: 200, fallback: 1 }),
  x: int(marker?.x, { min: -100000, max: 100000, fallback: 0 }),
  y: int(marker?.y, { min: -100000, max: 100000, fallback: 0 }),
  rotation: int(marker?.rotation, { min: -360, max: 360, fallback: 0 }),
});

export const cleanGridConfig = (grid) => ({
  rows: int(grid?.rows, { min: 1, max: MAX_GRID, fallback: 20 }),
  cols: int(grid?.cols, { min: 1, max: MAX_GRID, fallback: 20 }),
  squareSize: int(grid?.squareSize, { min: 5, max: 300, fallback: 40 }),
  backgroundType: ["none", "grass", "desert", "dungeon", "snow", "custom"].includes(
    grid?.backgroundType
  )
    ? grid.backgroundType
    : "none",
  customBackground: isSafeImageDataUrl(grid?.customBackground)
    ? grid.customBackground
    : null,
});

/**
 * Returns a sanitised scenario, or null if the payload isn't usable.
 */
export const parseScenario = (raw) => {
  if (!raw || typeof raw !== "object") return null;
  if (!Array.isArray(raw.characters)) return null;

  return {
    characters: raw.characters.slice(0, MAX_CHARACTERS).map(cleanCharacter),
    round: int(raw.round, { min: 0, max: 10000, fallback: 0 }),
    currentTurnId: raw.currentTurnId ? str(raw.currentTurnId, 64) : null,
    gridConfig: cleanGridConfig(raw.gridConfig),
    spellMarkers: Array.isArray(raw.spellMarkers)
      ? raw.spellMarkers.slice(0, MAX_MARKERS).map(cleanMarker)
      : [],
    name: raw.name ? str(raw.name, 100) : undefined,
  };
};
