"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          background: "#F7F4EC",
          color: "#1A1A1A",
          fontFamily: "sans-serif",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "28rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            System out of service
          </h1>
          <p style={{ color: "#6B6B6B", marginBottom: "1.5rem" }}>
            A critical fault halted the whole network. Please restart.
            {error?.digest ? ` (ref: ${error.digest})` : ""}
          </p>
          <button
            onClick={reset}
            style={{
              minHeight: "44px",
              padding: "0.75rem 1.5rem",
              fontWeight: 700,
              cursor: "pointer",
              border: "2px solid #1A1A1A",
              background: "transparent",
              color: "#1A1A1A",
              borderRadius: "0.375rem",
            }}
          >
            Restart
          </button>
        </div>
      </body>
    </html>
  );
}
