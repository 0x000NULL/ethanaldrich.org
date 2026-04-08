import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Ethan Aldrich Portfolio - Retro BIOS Theme";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0000AA",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
          color: "#AAAAAA",
        }}
      >
        <div
          style={{
            background: "#AAAAAA",
            color: "#0000AA",
            padding: "8px 24px",
            marginBottom: "48px",
            fontSize: "28px",
            fontWeight: "bold",
          }}
        >
          ALDRICH OS v1.0
        </div>
        <div
          style={{
            fontSize: "72px",
            color: "#FFFFFF",
            marginBottom: "24px",
            fontWeight: "bold",
          }}
        >
          ETHAN ALDRICH
        </div>
        <div
          style={{
            fontSize: "36px",
            marginBottom: "48px",
          }}
        >
          CTO & IT Infrastructure Specialist
        </div>
        <div
          style={{
            fontSize: "24px",
            color: "#228B22",
          }}
        >
          ethanaldrich.org
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            fontSize: "16px",
            color: "#808080",
          }}
        >
          Press any key to continue...
        </div>
      </div>
    ),
    { ...size }
  );
}
