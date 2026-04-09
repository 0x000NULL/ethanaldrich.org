import { NextResponse, NextRequest } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const CONTACT_TO = "ethan@ethanaldrich.net";
const CONTACT_FROM = "Contact Form <e.aldrich@budgetvegas.com>";

const MAX_NAME_LENGTH = 200;
const MAX_EMAIL_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactBody {
  name?: unknown;
  email?: unknown;
  message?: unknown;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const { allowed, remaining, resetIn } = checkRateLimit(ip, {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000,
  });

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(resetIn / 1000)),
          "Retry-After": String(Math.ceil(resetIn / 1000)),
        },
      }
    );
  }

  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (
    name.length > MAX_NAME_LENGTH ||
    email.length > MAX_EMAIL_LENGTH ||
    message.length > MAX_MESSAGE_LENGTH
  ) {
    return NextResponse.json({ error: "Field too long" }, { status: 400 });
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 503 }
    );
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: CONTACT_FROM,
        to: [CONTACT_TO],
        reply_to: email,
        subject: `[ethanaldrich.org] Contact from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "<unreadable>");
      console.error("Resend API error:", res.status, errorText);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 502 }
      );
    }
  } catch (error: unknown) {
    console.error("Failed to call Resend:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 502 }
    );
  }

  return NextResponse.json(
    { ok: true },
    {
      headers: {
        "X-RateLimit-Remaining": String(remaining),
      },
    }
  );
}
