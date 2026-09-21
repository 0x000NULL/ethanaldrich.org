interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

interface RateLimitOptions {
  windowMs?: number;
  maxRequests?: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number;
}

/**
 * Check if a request should be rate limited
 * @param ip - The IP address or identifier to rate limit
 * @param options - Configuration options
 * @returns Object indicating if request is allowed and rate limit info
 */
export function checkRateLimit(
  ip: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const { windowMs = 60000, maxRequests = 5 } = options;
  const now = Date.now();

  // Clean up expired entries periodically (when store gets large)
  if (rateLimitStore.size > 1000) {
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }

  const entry = rateLimitStore.get(ip);

  // No existing entry or entry has expired - allow and start new window
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
  }

  // Entry exists and is within window - check if limit exceeded
  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetIn: entry.resetTime - now };
  }

  // Within limit - increment and allow
  entry.count++;
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetIn: entry.resetTime - now,
  };
}

/**
 * Get the client IP from request headers.
 *
 * `X-Forwarded-For` is `client, proxy1, proxy2, ...` where each hop appends the
 * address it saw. Everything to the LEFT of the entry our own edge added is
 * attacker-controlled: a client can send `X-Forwarded-For: 1.2.3.4` and the
 * proxy simply appends to it. Reading `split(",")[0]` therefore hands the caller
 * a free key per request, which made the rate limit decorative.
 *
 * We run behind exactly one trusted proxy (DigitalOcean App Platform), so the
 * RIGHTMOST entry is the address that proxy observed, and is the only one a
 * client cannot forge. If the trusted-hop count ever changes, this index must
 * change with it.
 */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const hops = forwarded
      .split(",")
      .map((hop) => hop.trim())
      .filter(Boolean);
    if (hops.length > 0) return hops[hops.length - 1];
  }
  return headers.get("x-real-ip") || "unknown";
}
