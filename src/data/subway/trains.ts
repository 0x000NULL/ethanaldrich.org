import type { Train } from "./types";

/**
 * Live trains = what Ethan is actively doing now. Kept to a small set so the map
 * feels alive, not frantic (one is shown on mobile). `nowServing` surfaces on hover.
 */
export const TRAINS: Train[] = [
  {
    id: "t-edu",
    lineCode: "E",
    fromCode: "E-05",
    toCode: "E-06",
    nowServing: "WGU coursework — Security+ next",
    eta: "degree expected 2029",
  },
  {
    id: "t-career",
    lineCode: "C",
    fromCode: "C-01",
    toCode: "C-03",
    express: true,
    nowServing: "Two CTO seats — Budget LV & Twelve Management",
  },
  {
    id: "t-proj",
    lineCode: "P",
    fromCode: "P-06",
    toCode: "P-07",
    nowServing: "Shipping & writing up projects",
  },
];
