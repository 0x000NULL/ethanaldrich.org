import type { ServiceAlert } from "./types";

export const ALERTS: ServiceAlert[] = [
  {
    id: "a-certs",
    lineCode: "E",
    severity: "info",
    message:
      "Education Line: CySA+ now in service; B.S. complete, M.S. Cybersecurity underway.",
    stationCode: "E-03",
    dismissible: true,
  },
];
