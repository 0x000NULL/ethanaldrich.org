import type { ServiceAlert } from "./types";

export const ALERTS: ServiceAlert[] = [
  {
    id: "a-fimil",
    lineCode: "C",
    severity: "info",
    message: "Career Line: Fimil running express — private beta.",
    stationCode: "C-02",
    dismissible: true,
  },
];
