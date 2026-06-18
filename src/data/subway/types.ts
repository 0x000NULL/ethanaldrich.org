import type { GridPoint } from "@/lib/subway/geometry";

export type LineCode = "E" | "C" | "P" | "W";

/** A station's lifecycle state. Carried by `data-status` + ring style, never color alone. */
export type StationStatus =
  | "operational" // real, shipped work
  | "in-progress" // actively underway (e.g. studying for an exam)
  | "planned"; // future / not started

export interface StationLink {
  label: string;
  href: string;
}

export interface Station {
  /** Permalink-stable code, e.g. "P-09". */
  code: string;
  name: string;
  nameJa: string;
  /** Lines this station physically sits on (usually one). */
  lineCodes: LineCode[];
  grid: GridPoint;
  status: StationStatus;
  terminus?: boolean;
  express?: boolean;
  /** Override the default (line-based) label placement, e.g. to dodge a branch. */
  labelSide?: "above" | "below" | "right";
  /** Override the default (alternating) label row. */
  labelBand?: "near" | "far";
  /** One-line summary — drives the strip map, tooltips, and the a11y `<ol>`. */
  summary: string;
  /** True when a long case study exists at src/content/stations/<code>.mdx. */
  hasBody?: boolean;
  dates?: string;
  stack?: string[];
  links?: StationLink[];
  /** Blog slugs surfaced as "related writing" in the panel. */
  relatedPosts?: string[];
}

/** A via corner forces a specific octolinear route between two trunk stations. */
export interface Via {
  from: string;
  to: string;
  points: GridPoint[];
}

/** A dashed offshoot from a trunk station (e.g. the MSCSIA spur off E-12). */
export interface Branch {
  fromCode: string;
  stationCodes: string[];
  dashed?: boolean;
}

export interface Line {
  code: LineCode;
  name: string;
  nameJa: string;
  color: string;
  /** Dashed = "future service" (the whole line is a roadmap). */
  dashed?: boolean;
  express?: boolean;
  /** Ordered trunk station codes. May begin at a junction station from another line. */
  stationCodes: string[];
  vias?: Via[];
  branches?: Branch[];
}

/** A transfer ("peanut") between two stations on different lines. */
export interface Transfer {
  a: string;
  b: string;
  marquee?: boolean;
}

export interface Train {
  id: string;
  lineCode: LineCode;
  /** Direction of travel: currently moving from `fromCode` toward `toCode`. */
  fromCode: string;
  toCode: string;
  express?: boolean;
  /** Human label: "Studying for Network+". */
  nowServing: string;
  eta?: string;
}

export type AlertSeverity = "info" | "minor" | "construction";

export interface ServiceAlert {
  id: string;
  lineCode: LineCode;
  severity: AlertSeverity;
  message: string;
  /** Click target — pans/zooms to this station. */
  stationCode?: string;
  /** The S-line construction notice is permanent (non-dismissible). */
  dismissible: boolean;
}

export interface NetworkConfig {
  lines: Line[];
  stations: Station[];
  transfers: Transfer[];
  trains: Train[];
  alerts: ServiceAlert[];
}
