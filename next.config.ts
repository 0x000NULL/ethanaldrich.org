import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const isProd = process.env.NODE_ENV === "production";

/**
 * Production-only transport hardening.
 *
 * `upgrade-insecure-requests` must not ship in development: Chrome exempts
 * localhost from it, but WebKit does not, so it rewrites every dev asset to
 * https://localhost, none of which resolve. The page then renders completely
 * unstyled with no JS, which is exactly how it failed the WebKit e2e run.
 * HSTS is equally pointless over plain-http localhost.
 */
const transportHeaders = isProd
  ? [
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
    ]
  : [];

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    // Deliberately 0, not "1; mode=block". The legacy XSS auditor is removed
    // from modern browsers and in the ones that kept it it introduced its own
    // vulnerabilities; CSP is the real control here.
    key: "X-XSS-Protection",
    value: "0",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // 'unsafe-inline' stays on both of these, and it is the weakest part of
      // this policy. Next's App Router inlines its hydration bootstrap, and the
      // build-time Shiki highlighting in mdxOptions emits inline style="color:…"
      // token spans. Removing either needs nonce plumbing through middleware.
      // No 'unsafe-eval' anywhere: the animation layer is hand-rolled rAF.
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      // See transportHeaders: this one breaks WebKit on localhost.
      ...(isProd ? ["upgrade-insecure-requests"] : []),
    ].join("; "),
  },
  ...transportHeaders,
];

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
