import type { ServiceAlert } from "./types";

export const ALERTS: ServiceAlert[] = [
  {
    id: "a-certs",
    lineCode: "E",
    severity: "info",
    message: "Education Line: A+, Network+, IT Ops Specialist & ITIL v4 now in service.",
    stationCode: "E-03",
    dismissible: true,
  },
];
