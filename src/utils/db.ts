export const DB = {
  get: <T>(k: string, fallback: T): T => {
    try {
      const v = localStorage.getItem(k);
      return v ? (JSON.parse(v) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set: (k: string, v: unknown): void => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  },
};
