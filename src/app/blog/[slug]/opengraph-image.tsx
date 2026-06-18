import { ImageResponse } from "next/og";
import { getBlogPost, getAllBlogSlugs } from "@/lib/blog";

export const alt = "Ethan Aldrich — writing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

const LINES: [string, string][] = [
  ["E", "#009BBF"],
  ["C", "#E60012"],
  ["P", "#C9197F"],
  ["W", "#7A8B99"],
];

/** Per-post social card: the post title over the metro roundel motif. */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  const title = post?.title ?? "Ethan Aldrich";

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
        <div style={{ display: "flex", gap: "14px" }}>
          {LINES.map(([letter, color]) => (
            <div
              key={letter}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                border: `7px solid ${color}`,
                background: "#FFFFFF",
                fontSize: "26px",
                fontWeight: "bold",
              }}
            >
              {letter}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "64px",
            fontWeight: "bold",
            lineHeight: 1.12,
            maxWidth: "1000px",
          }}
        >
          {title}
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
          <span>WRITING</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
