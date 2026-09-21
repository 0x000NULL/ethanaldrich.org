import { ImageResponse } from "next/og";
import { STATIONS, getStation, LINE_MAP } from "@/data/subway";
import { PROFILE } from "@/data/profile";

export const alt = "Ethan Aldrich — station";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return STATIONS.map((s) => ({ code: s.code }));
}

const STATUS_LABEL: Record<string, string> = {
  operational: "IN SERVICE",
  "in-progress": "IN PROGRESS",
  planned: "PLANNED",
};

/**
 * Per-station social card.
 *
 * These pages declared `summary_large_image` but had no image route, so all 25
 * fell back to the generic site card — every station unfurled identically.
 * Leads with the station's own roundel in its line colour.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const station = getStation(code);
  const color = station ? LINE_MAP[station.lineCodes[0]]?.color : undefined;
  const lineColor = color ?? "#1A1A1A";
  const lineName = station ? LINE_MAP[station.lineCodes[0]]?.name : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#F7F4EC",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          fontFamily: "sans-serif",
          color: "#1A1A1A",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "104px",
              height: "104px",
              borderRadius: "50%",
              border: `13px solid ${lineColor}`,
              background: "#FFFFFF",
              fontSize: "30px",
              fontWeight: "bold",
            }}
          >
            {station?.code ?? "—"}
          </div>
          <div style={{ display: "flex", fontSize: "28px", color: "#6B6B6B" }}>
            {lineName ?? PROFILE.title}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              display: "flex",
              fontSize: "64px",
              fontWeight: "bold",
              lineHeight: 1.12,
              maxWidth: "1040px",
            }}
          >
            {station?.name ?? PROFILE.name}
          </div>
          {station?.dates ? (
            <div style={{ display: "flex", fontSize: "26px", color: "#6B6B6B" }}>
              {station.dates}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "24px",
            color: "#6B6B6B",
          }}
        >
          <span>ethanaldrich.org</span>
          <span>{station ? STATUS_LABEL[station.status] : "STATION"}</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
