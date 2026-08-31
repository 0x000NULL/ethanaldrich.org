"use client";

import { ALERTS, LINE_MAP, getStation } from "@/data/subway";
import { toPx } from "@/lib/subway/geometry";
import {
  getViewBox,
  transformForBounds,
} from "@/lib/subway/selectors";
import { useNavStore } from "@/store/nav-store";

const SEVERITY_ICON: Record<string, string> = {
  info: "ℹ",
  minor: "△",
  construction: "⚠",
};

/** Stacked, dismissible, color-coded alerts. Clicking one frames its station. */
export default function ServiceAlertBanner() {
  const dismissed = useNavStore((s) => s.dismissedAlerts);
  const dismissAlert = useNavStore((s) => s.dismissAlert);
  const selectStation = useNavStore((s) => s.selectStation);
  const setTransform = useNavStore((s) => s.setTransform);

  const visible = ALERTS.filter((a) => !dismissed.includes(a.id));
  if (visible.length === 0) return null;

  const goTo = (code?: string) => {
    if (!code) return;
    const station = getStation(code);
    if (!station) return;
    const p = toPx(station.grid);
    const pad = 160;
    setTransform(
      transformForBounds(
        { minX: p.x - pad, minY: p.y - pad, maxX: p.x + pad, maxY: p.y + pad },
        getViewBox()
      )
    );
    selectStation(code);
  };

  return (
    <div
      data-alert-banner
      className="mx-auto flex w-full max-w-5xl flex-none flex-col gap-3 px-5 pt-5"
    >
      {visible.map((alert) => {
        const color = LINE_MAP[alert.lineCode]?.color ?? "var(--metro-ink)";
        return (
          <div
            key={alert.id}
            role="status"
            className="flex items-center gap-3 rounded-lg border bg-[var(--metro-panel)]/95 px-4 py-2.5 text-base shadow-lg backdrop-blur"
            style={{ borderColor: "var(--metro-border)", borderLeft: `7px solid ${color}` }}
          >
            <span aria-hidden="true" className="flex-none text-lg">
              {SEVERITY_ICON[alert.severity]}
            </span>
            <button
              onClick={() => goTo(alert.stationCode)}
              className="flex-1 text-left hover:underline"
            >
              {alert.message}
            </button>
            {alert.dismissible && (
              <button
                onClick={() => dismissAlert(alert.id)}
                aria-label="Dismiss alert"
                className="flex-none px-1 text-2xl leading-none text-[var(--metro-ink-dim)] hover:text-[var(--metro-ink)]"
              >
                ×
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
