// src/utils/safeStorage.js
// localStorage throws in three common situations: private browsing, a full
// quota (a big uploaded map background will do it), and corrupted values.
// Unhandled, any of those crash the app on load. These wrappers never throw.

export const safeGet = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    // Corrupt or unreadable - drop it so we don't keep failing on every load.
    try {
      localStorage.removeItem(key);
    } catch {
      /* nothing more we can do */
    }
    return fallback;
  }
};

export const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    const quotaExceeded =
      err instanceof DOMException &&
      (err.name === "QuotaExceededError" ||
        err.name === "NS_ERROR_DOM_QUOTA_REACHED");
    if (quotaExceeded) {
      console.warn(
        `Storage full - "${key}" wasn't saved. A large custom map background is the usual cause.`
      );
    }
    return false;
  }
};

export const safeRemove = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
};
