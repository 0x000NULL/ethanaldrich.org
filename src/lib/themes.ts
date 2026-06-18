/**
 * Tokyo-Metro design tokens. The runtime mechanism (CSS variables applied to :root,
 * persisted to localStorage, mirrored to the theme-color meta tag) is carried over
 * from the old BIOS theme system; only the palette changed. There is a single
 * "metro" variant today — the machinery is kept so a future variant is a one-liner.
 */
export type ThemeVariant = "metro";

export interface ThemeColors {
  /** Paper-cream map background. */
  "metro-bg": string;
  /** Primary ink for labels and body copy. */
  "metro-ink": string;
  /** Secondary ink (subtitles, captions). */
  "metro-ink-dim": string;
  /** Panel / sheet surface. */
  "metro-panel": string;
  /** Hairline borders and ticks. */
  "metro-border": string;
  /** Roundel fill (so the line color reads as a ring). */
  "metro-roundel": string;
  /** Interactive accent / focus ring. */
  "metro-accent": string;
}

export const themes: Record<ThemeVariant, ThemeColors> = {
  metro: {
    "metro-bg": "#F7F4EC",
    "metro-ink": "#1A1A1A",
    "metro-ink-dim": "#6B6B6B",
    "metro-panel": "#FFFFFF",
    "metro-border": "#D8D2C4",
    "metro-roundel": "#FFFFFF",
    "metro-accent": "#1A1A1A",
  },
};

const THEME_STORAGE_KEY = "aldrich-theme";
const DEFAULT_THEME: ThemeVariant = "metro";

export function applyTheme(theme: ThemeVariant): void {
  if (typeof window === "undefined") return;

  const colors = themes[theme] ?? themes[DEFAULT_THEME];
  const root = document.documentElement;
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });

  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (themeColorMeta) {
    themeColorMeta.setAttribute("content", colors["metro-bg"]);
  }
}

export function getStoredTheme(): ThemeVariant {
  if (typeof window === "undefined") return DEFAULT_THEME;
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "metro" ? "metro" : DEFAULT_THEME;
}

export function storeTheme(theme: ThemeVariant): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}
