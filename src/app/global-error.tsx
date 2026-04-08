"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body
        className="bg-[#0000AA] text-white font-mono p-8"
        style={{ fontFamily: "monospace" }}
      >
        <div className="max-w-2xl mx-auto">
          <div
            className="px-2 py-1 inline-block mb-8 font-bold"
            style={{ background: "#AAAAAA", color: "#0000AA" }}
          >
            ALDRICH OS - FATAL ERROR
          </div>

          <div className="space-y-4">
            <p>
              A critical system error 0xFATAL has occurred. The system has been
              halted.
            </p>

            <div
              className="my-8 p-4"
              style={{ border: "1px solid #808080", color: "#AAAAAA" }}
            >
              <p className="mb-2">Technical information:</p>
              <p style={{ fontSize: "14px" }}>
                *** CRITICAL_PROCESS_DIED
                <br />
                *** {error.name}: {error.message?.slice(0, 100)}
              </p>
            </div>

            <button
              onClick={reset}
              className="px-6 py-3 font-bold cursor-pointer"
              style={{
                border: "2px solid white",
                background: "transparent",
                color: "white",
                minWidth: "180px",
                minHeight: "44px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.color = "#0000AA";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "white";
              }}
            >
              [ RESTART SYSTEM ]
            </button>

            <p className="mt-8">
              System halted. Press button to restart
              <span
                className="inline-block w-2 h-4 ml-1"
                style={{
                  background: "white",
                  animation: "pulse 1s infinite",
                }}
              />
            </p>
          </div>
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>
      </body>
    </html>
  );
}
