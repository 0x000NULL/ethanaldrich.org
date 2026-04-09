"use client";

import { useState, memo } from "react";

type ContactStatus = "idle" | "sending" | "success" | "error";

function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<ContactStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Simple email obfuscation
  const emailParts = ["ethan", "@", "ethanaldrich", ".", "org"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        return;
      }

      let errorText = "Unknown error. Please try email link below.";
      try {
        const data = (await res.json()) as { error?: string };
        if (data?.error) errorText = data.error;
      } catch {
        // fall through to generic error
      }
      if (res.status === 429) {
        errorText = "Too many attempts. Please try again later.";
      }
      setErrorMessage(errorText);
      setStatus("error");
    } catch {
      setErrorMessage("Network error. Please try email link below.");
      setStatus("error");
    }
  };

  const isSending = status === "sending";

  return (
    <div className="space-y-4">
      <div className="text-bios text-lg mb-4">
        ╔══════════════════════════════════════════════════════════╗
        <br />
        ║&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CONTACT SUBSYSTEM&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;║
        <br />
        ╚══════════════════════════════════════════════════════════╝
      </div>

      {/* Contact Information */}
      <div className="border border-[#AAAAAA] p-3">
        <div className="text-[#228B22] mb-2">► CONTACT INFORMATION</div>
        <table className="w-full text-sm">
          <tbody>
            <tr>
              <td className="text-bios pr-4 py-1 w-32">Email:</td>
              <td className="text-bios-highlight py-1">
                <span
                  className="cursor-pointer hover:text-[#228B22]"
                  onClick={() => {
                    window.location.href = `mailto:${emailParts.join("")}`;
                  }}
                >
                  {emailParts.join("")}
                </span>
              </td>
            </tr>
            <tr>
              <td className="text-bios pr-4 py-1">GitHub:</td>
              <td className="text-bios-highlight py-1">
                <a
                  href="https://github.com/0x000NULL"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#228B22]"
                >
                  github.com/0x000NULL
                </a>
              </td>
            </tr>
            <tr>
              <td className="text-bios pr-4 py-1">LinkedIn:</td>
              <td className="text-bios-highlight py-1">
                <a
                  href="https://linkedin.com/in/ethanaldrich"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#228B22]"
                >
                  linkedin.com/in/ethanaldrich
                </a>
              </td>
            </tr>
            <tr>
              <td className="text-bios pr-4 py-1">Location:</td>
              <td className="text-bios-highlight py-1">Las Vegas, NV</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Contact Form (Visual Only) */}
      <div className="border border-[#AAAAAA] p-3">
        <div className="text-[#228B22] mb-2">► MESSAGE INPUT</div>
        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <div className="flex items-center">
            <label className="text-bios w-24">Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled={isSending}
              className="flex-1 bg-[#000040] border border-[#AAAAAA] px-2 py-1 text-bios-highlight focus:border-[var(--bios-success)] focus-visible:ring-2 focus-visible:ring-[var(--bios-accent)] outline-none font-mono disabled:opacity-50"
              placeholder="Enter your name..."
            />
          </div>
          <div className="flex items-center">
            <label className="text-bios w-24">Email:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              disabled={isSending}
              className="flex-1 bg-[#000040] border border-[#AAAAAA] px-2 py-1 text-bios-highlight focus:border-[var(--bios-success)] focus-visible:ring-2 focus-visible:ring-[var(--bios-accent)] outline-none font-mono disabled:opacity-50"
              placeholder="Enter your email..."
            />
          </div>
          <div className="flex items-start">
            <label className="text-bios w-24">Message:</label>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              disabled={isSending}
              rows={4}
              className="flex-1 bg-[#000040] border border-[#AAAAAA] px-2 py-1 text-bios-highlight focus:border-[var(--bios-success)] focus-visible:ring-2 focus-visible:ring-[var(--bios-accent)] outline-none font-mono resize-none disabled:opacity-50"
              placeholder="Enter your message..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setFormData({ name: "", email: "", message: "" });
                setStatus("idle");
                setErrorMessage(null);
              }}
              disabled={isSending}
              className="px-4 py-1 border border-[#AAAAAA] hover:bg-[#AAAAAA] hover:text-[var(--bios-bg)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--bios-accent)] focus-visible:outline-none disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-inherit"
            >
              [ CLEAR ]
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="px-4 py-1 border border-[var(--bios-success)] text-[var(--bios-success)] hover:bg-[var(--bios-success)] hover:text-[var(--bios-bg)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--bios-accent)] focus-visible:outline-none disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[var(--bios-success)]"
            >
              {isSending ? "[ SENDING... ]" : "[ SEND ]"}
            </button>
          </div>
          {status === "sending" && (
            <div className="text-bios-dim text-sm" role="status" aria-live="polite">
              ► ESTABLISHING CONNECTION...
            </div>
          )}
          {status === "success" && (
            <div className="text-bios-success text-sm" role="status" aria-live="polite">
              ► MESSAGE TRANSMITTED. STAND BY FOR RESPONSE.
            </div>
          )}
          {status === "error" && (
            <div className="text-bios-error text-sm" role="alert">
              ► TRANSMISSION FAILED: {errorMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default memo(ContactSection);
