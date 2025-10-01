export function computeFavicon(url: string): string | undefined {
  try {
    const parsed = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=64`;
  } catch {
    return undefined;
  }
}