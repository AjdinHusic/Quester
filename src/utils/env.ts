const prefixes = ["REACT_APP", "REACT", "VITE"];

function isBrowser() {
  return Boolean(typeof window !== "undefined" && window.__ENV);
}

export function env(
  key: keyof typeof window.__ENV | string,
  defaultValue: string
): string {
  const safeKeys = [];
  for (const prefix of prefixes) {
    safeKeys.push(`${prefix}_${key}`);
  }
  safeKeys.push(key);
  const nonBrowser = import.meta.env;
  const together = { ...window.__ENV, ...nonBrowser };
  for (const safeKey of safeKeys) {
    if (safeKey in together && together[safeKey] !== `%(${safeKey})`) {
      return together[safeKey];
    }
  }
  return defaultValue;
}
