import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="fixed inset-0 bg-[#0000AA] text-white p-8 font-mono flex flex-col"
      role="main"
    >
      <div className="max-w-2xl mx-auto w-full">
        <div className="bg-[#AAAAAA] text-[#0000AA] px-2 py-1 inline-block mb-8 font-bold">
          ALDRICH OS
        </div>

        <div className="space-y-4">
          <p className="text-xl">
            A file not found exception 0x00000404 has occurred.
          </p>

          <p className="text-lg text-[#FFFF00]">Bad command or file name.</p>

          <div className="my-8 text-[#AAAAAA] border border-[#AAAAAA] p-4">
            <pre className="whitespace-pre-wrap text-sm">
              {`C:\\ALDRICH\\> cd requested_page
The system cannot find the path specified.

C:\\ALDRICH\\> dir *.exe
 Volume in drive C is PORTFOLIO
 Directory of C:\\ALDRICH

ABOUT    EXE     2,048  02-22-26   4:20a
CAREER   EXE     4,096  02-22-26   4:20a
PROJECTS EXE     8,192  02-22-26   4:20a
SKILLS   DAT    16,384  02-22-26   4:20a
CONTACT  COM     1,024  02-22-26   4:20a
BLOG     TXT    32,768  02-22-26   4:20a
GAMES    EXE     4,096  02-22-26   4:20a
         7 file(s)      68,608 bytes
                        640 KB free`}
            </pre>
          </div>

          <p>
            The page you&apos;re looking for has been moved, deleted, or never
            existed.
          </p>

          <div className="flex gap-4 flex-wrap mt-8">
            <Link
              href="/"
              className="px-6 py-3 border-2 border-white hover:bg-white hover:text-[#0000AA] transition-colors min-w-[180px] min-h-[44px] inline-flex items-center justify-center font-bold"
            >
              [ RETURN TO DESKTOP ]
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
