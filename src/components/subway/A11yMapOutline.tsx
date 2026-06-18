"use client";

import { useMemo } from "react";
import { LINES, getStationsForLine } from "@/data/subway";
import { transfersForStation } from "@/lib/subway/selectors";
import {
  useRovingStations,
  type RovingGroup,
} from "@/hooks/useRovingStations";

interface A11yMapOutlineProps {
  onSelect: (code: string) => void;
  onHover: (code: string | null) => void;
}

/**
 * The parallel, screen-reader / keyboard interface for the map. Visually hidden but
 * fully focusable: one ordered list per line, roving tabindex within a line, Tab
 * between lines, Enter/Space to open a station. Focusing a station mirrors to the
 * visual map via onHover so sighted keyboard users get feedback.
 */
export default function A11yMapOutline({ onSelect, onHover }: A11yMapOutlineProps) {
  const groups: RovingGroup[] = useMemo(
    () =>
      LINES.map((line) => ({
        lineCode: line.code,
        codes: getStationsForLine(line.code).map((s) => s.code),
      })).filter((g) => g.codes.length > 0),
    []
  );

  const { tabIndexFor, onKeyDown, register } = useRovingStations(groups);

  return (
    <nav className="sr-only" aria-label="Subway map station index">
      {groups.map((group, gi) => {
        const line = LINES.find((l) => l.code === group.lineCode)!;
        const stations = getStationsForLine(line.code);
        return (
          <section key={line.code} aria-label={`${line.name} stations`}>
            <h2>{line.name}</h2>
            <ol>
              {stations.map((station, si) => {
                const transfers = transfersForStation(station.code);
                const transferLabel = transfers.length
                  ? `. Transfer to ${transfers
                      .map((t) => `${t.partnerName} (${t.lineCodes.join(", ")})`)
                      .join(", ")}`
                  : "";
                return (
                  <li key={station.code}>
                    <button
                      ref={register(station.code)}
                      tabIndex={tabIndexFor(gi, si)}
                      onKeyDown={onKeyDown(gi)}
                      onClick={() => onSelect(station.code)}
                      onFocus={() => onHover(station.code)}
                      onBlur={() => onHover(null)}
                    >
                      {`${station.code} ${station.name}. ${station.status}. ${station.summary}${transferLabel}`}
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </nav>
  );
}
