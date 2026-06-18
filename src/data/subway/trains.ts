import type { Train } from "./types";

/**
 * Live trains = what Ethan is actively doing now. Kept to a small set so the map
 * feels alive, not frantic (one is shown on mobile). `nowServing` surfaces on hover.
 */
export const TRAINS: Train[] = [
  {
    id: "t-edu",
    lineCode: "E",
    fromCode: "E-01",
    toCode: "E-05",
    nowServing: "Studying for Network+",
    eta: "exam seat pending",
  },
  {
    id: "t-fimil",
    lineCode: "C",
    fromCode: "C-01",
    toCode: "C-02",
    express: true,
    nowServing: "Building Fimil — private beta",
  },
  {
    id: "t-proj",
    lineCode: "P",
    fromCode: "P-06",
    toCode: "P-07",
    nowServing: "Shipping & writing up projects",
  },
];
