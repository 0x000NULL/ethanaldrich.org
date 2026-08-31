import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Ethan Aldrich — career rendered as a subway map";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#F7F4EC",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          color: "#1A1A1A",
        }}
      >
        <div style={{ display: "flex", gap: "16px", marginBottom: "48px" }}>
          {[
            ["E", "#009BBF"],
            ["C", "#E60012"],
            ["P", "#C9197F"],
            ["W", "#7A8B99"],
          ].map(([letter, color]) => (
            <div
              key={letter}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                border: `8px solid ${color}`,
                background: "#FFFFFF",
                fontSize: "34px",
                fontWeight: "bold",
              }}
            >
              {letter}
            </div>
          ))}
        </div>
        <div style={{ fontSize: "76px", fontWeight: "bold", marginBottom: "16px" }}>
          ETHAN ALDRICH
        </div>
        <div style={{ fontSize: "32px", color: "#6B6B6B" }}>
          Software, Infrastructure &amp; Security Engineering
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            fontSize: "18px",
            color: "#6B6B6B",
          }}
        >
          ethanaldrich.org · all lines, all stops
        </div>
      </div>
    ),
    { ...size }
  );
}
