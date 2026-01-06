export type StorageKey = string;

export function readJson<T>(key: StorageKey): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeJson<T>(key: StorageKey, value: T): void {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function remove(key: StorageKey): void {
  window.localStorage.removeItem(key);
}

export function updateJson<T>(key: StorageKey, updater: (prev: T | null) => T): T {
  const prev = readJson<T>(key);
  const next = updater(prev);
  writeJson(key, next);
  return next;
}
