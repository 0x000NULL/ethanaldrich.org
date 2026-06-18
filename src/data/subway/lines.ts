import type { Line, Transfer } from "./types";

export const LINES: Line[] = [
  {
    code: "E",
    name: "Education Line",
    nameJa: "教育線",
    color: "#009BBF",
    stationCodes: ["E-01", "E-05", "E-06", "E-07", "E-08", "E-09", "E-12"],
    branches: [{ fromCode: "E-12", stationCodes: ["E-13"], dashed: true }],
  },
  {
    code: "C",
    name: "Career Line",
    nameJa: "経歴線",
    color: "#E60012",
    express: true,
    stationCodes: ["C-01", "C-02"],
    // C-01 → C-02 is (13,10)→(17,8): a 45° diagonal then a horizontal run.
    vias: [{ from: "C-01", to: "C-02", points: [{ gx: 15, gy: 8 }] }],
  },
  {
    code: "P",
    name: "Projects Line",
    nameJa: "制作線",
    color: "#C9197F",
    stationCodes: [
      "P-01",
      "P-02",
      "P-03",
      "P-04",
      "P-05",
      "P-06",
      "P-07",
      "P-09",
    ],
  },
  {
    code: "W",
    name: "Weekend Line",
    nameJa: "週末線",
    color: "#7A8B99",
    dashed: true,
    // Begins at the P-01 junction so the spur reads as a branch off Projects.
    stationCodes: ["P-01", "W-01", "W-02", "W-03"],
  },
];

export const TRANSFERS: Transfer[] = [
  // Marquee: the founder (Career terminus) and the platform (Projects) are one node.
  { a: "C-02", b: "P-09", marquee: true },
  // Certs → applied builds.
  { a: "E-06", b: "P-04" },
  { a: "E-07", b: "P-05" },
];
