"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ERROR_CODES = [
  "0x0000DEAD",
  "0x00000050",
  "0xC0FFEE42",
  "0xDEADBEEF",
  "0x8BADF00D",
  "0xCAFEBABE",
];

export default function Error({ error, reset }: ErrorProps) {
  // Use lazy initialization to pick error code only once per mount
  const [errorCode] = useState(
    () => ERROR_CODES[Math.floor(Math.random() * ERROR_CODES.length)]
  );

  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div
      className="fixed inset-0 bg-[#0000AA] text-white p-8 font-mono flex flex-col"
      role="alert"
      aria-live="assertive"
    >
      <div className="max-w-2xl mx-auto w-full">
        <div className="bg-[#AAAAAA] text-[#0000AA] px-2 py-1 inline-block mb-8 font-bold">
          ALDRICH OS
        </div>

        <div className="space-y-4">
          <p>
            A fatal exception {errorCode} has occurred at 0028:C0011E36. The
            current application will be terminated.
          </p>

          <p>
            * Press <span className="text-[#FFFF00]">[RETRY]</span> to attempt
            recovery of the current operation.
          </p>

          <p>
            * Press <span className="text-[#FFFF00]">[HOME]</span> to return to
            the desktop and lose any unsaved data.
          </p>

          <div className="my-8 text-[#AAAAAA] border border-[#808080] p-4">
            <p className="mb-2">Technical information:</p>
            <p className="text-sm">
              *** STOP: {errorCode} ({error.digest || "UNKNOWN_DIGEST"})
              <br />
              *** {error.name}: {error.message?.slice(0, 100)}
              {error.message && error.message.length > 100 && "..."}
            </p>
          </div>

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={reset}
              className="px-6 py-3 border-2 border-white hover:bg-white hover:text-[#0000AA] transition-colors min-w-[120px] min-h-[44px] font-bold cursor-pointer"
            >
              [ RETRY ]
            </button>
            <Link
              href="/"
              className="px-6 py-3 border-2 border-white hover:bg-white hover:text-[#0000AA] transition-colors min-w-[120px] min-h-[44px] inline-flex items-center justify-center font-bold"
            >
              [ HOME ]
            </Link>
          </div>

          <p className="mt-8">
            Press any key to continue
            <span className="inline-block w-2 h-4 bg-white ml-1 animate-pulse" />
          </p>
        </div>
      </div>
    </div>
  );
}
