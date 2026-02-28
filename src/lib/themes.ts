export type ThemeVariant = "blue" | "green" | "amber" | "turbo";

export interface ThemeColors {
  "bios-bg": string;
  "bios-text": string;
  "bios-highlight": string;
  "bios-accent": string;
  "bios-success": string;
  "bios-error": string;
  "desktop-bg": string;
  "chrome-base": string;
  "chrome-shadow": string;
  "chrome-highlight": string;
  "chrome-dark": string;
  "titlebar-start": string;
  "titlebar-end": string;
}

export const themes: Record<ThemeVariant, ThemeColors> = {
  blue: {
    "bios-bg": "#0000AA",
    "bios-text": "#AAAAAA",
    "bios-highlight": "#FFFFFF",
    "bios-accent": "#000000",
    "bios-success": "#228B22",
    "bios-error": "#FF5555",
    "desktop-bg": "#000040",
    "chrome-base": "#C0C0C0",
    "chrome-shadow": "#808080",
    "chrome-highlight": "#FFFFFF",
    "chrome-dark": "#000000",
    "titlebar-start": "#000080",
    "titlebar-end": "#1084d0",
  },
  green: {
    "bios-bg": "#002200",
    "bios-text": "#33FF33",
    "bios-highlight": "#00FF00",
    "bios-accent": "#004400",
    "bios-success": "#00FF00",
    "bios-error": "#FF5555",
    "desktop-bg": "#001100",
    "chrome-base": "#C0C0C0",
    "chrome-shadow": "#808080",
    "chrome-highlight": "#FFFFFF",
    "chrome-dark": "#000000",
    "titlebar-start": "#003300",
    "titlebar-end": "#00AA00",
  },
  amber: {
    "bios-bg": "#221100",
    "bios-text": "#FFAA33",
    "bios-highlight": "#FFCC00",
    "bios-accent": "#442200",
    "bios-success": "#FFAA00",
    "bios-error": "#FF5555",
    "desktop-bg": "#110800",
    "chrome-base": "#C0C0C0",
    "chrome-shadow": "#808080",
    "chrome-highlight": "#FFFFFF",
    "chrome-dark": "#000000",
    "titlebar-start": "#442200",
    "titlebar-end": "#FF8800",
  },
  turbo: {
    "bios-bg": "#1a0a2e",
    "bios-text": "#00FFFF",
    "bios-highlight": "#FF00FF",
    "bios-accent": "#2d1b4e",
    "bios-success": "#00FF00",
    "bios-error": "#FF5555",
    "desktop-bg": "#0d0520",
    "chrome-base": "#C0C0C0",
    "chrome-shadow": "#808080",
    "chrome-highlight": "#FFFFFF",
    "chrome-dark": "#000000",
    "titlebar-start": "#6B0F9E",
    "titlebar-end": "#FF00FF",
  },
};

const THEME_STORAGE_KEY = "aldrich-theme";

export function applyTheme(theme: ThemeVariant): void {
  if (typeof window === "undefined") return;

  const colors = themes[theme];
  const root = document.documentElement;

  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });

  // Update theme-color meta tag
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (themeColorMeta) {
    themeColorMeta.setAttribute("content", colors["bios-bg"]);
  }
}

export function getStoredTheme(): ThemeVariant {
  if (typeof window === "undefined") return "blue";

  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored && ["blue", "green", "amber", "turbo"].includes(stored)) {
    return stored as ThemeVariant;
  }
  return "blue";
}

export function storeTheme(theme: ThemeVariant): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}
