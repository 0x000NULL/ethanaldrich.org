import type { ServiceAlert } from "./types";

export const ALERTS: ServiceAlert[] = [
  {
    id: "a-certs",
    lineCode: "E",
    severity: "info",
    message:
      "Education Line: M.S. Cybersecurity complete; CSAP now in service.",
    stationCode: "E-13",
    dismissible: true,
  },
];
