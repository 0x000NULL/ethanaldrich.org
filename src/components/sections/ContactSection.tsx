"use client";

import { useState } from "react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Simple email obfuscation
  const emailParts = ["ethan", "@", "ethanaldrich", ".", "org"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Visual-only form - no actual submission
    alert("This is a visual demo. For real contact, please use the email or social links below.");
  };

  return (
    <div className="space-y-4">
      <div className="text-[#000000] text-lg mb-4">
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
              <td className="text-[#000000] pr-4 py-1 w-32">Email:</td>
              <td className="text-black py-1">
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
              <td className="text-[#000000] pr-4 py-1">GitHub:</td>
              <td className="text-black py-1">
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
              <td className="text-[#000000] pr-4 py-1">LinkedIn:</td>
              <td className="text-black py-1">
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
              <td className="text-[#000000] pr-4 py-1">Location:</td>
              <td className="text-black py-1">Las Vegas, NV</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Contact Form (Visual Only) */}
      <div className="border border-[#AAAAAA] p-3">
        <div className="text-[#228B22] mb-2">► MESSAGE INPUT</div>
        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <div className="flex items-center">
            <label className="text-[#000000] w-24">Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="flex-1 bg-[#000040] border border-[#AAAAAA] px-2 py-1 text-black focus:border-[#228B22] outline-none font-mono"
              placeholder="Enter your name..."
            />
          </div>
          <div className="flex items-center">
            <label className="text-[#000000] w-24">Email:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="flex-1 bg-[#000040] border border-[#AAAAAA] px-2 py-1 text-black focus:border-[#228B22] outline-none font-mono"
              placeholder="Enter your email..."
            />
          </div>
          <div className="flex items-start">
            <label className="text-[#000000] w-24">Message:</label>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              rows={4}
              className="flex-1 bg-[#000040] border border-[#AAAAAA] px-2 py-1 text-black focus:border-[#228B22] outline-none font-mono resize-none"
              placeholder="Enter your message..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setFormData({ name: "", email: "", message: "" })}
              className="px-4 py-1 border border-[#AAAAAA] hover:bg-[#AAAAAA] hover:text-[#0000AA] transition-colors"
            >
              [ CLEAR ]
            </button>
            <button
              type="submit"
              className="px-4 py-1 border border-[#228B22] text-[#228B22] hover:bg-[#228B22] hover:text-[#0000AA] transition-colors"
            >
              [ SEND ]
            </button>
          </div>
        </form>
      </div>

      <div className="text-[#606060] text-xs text-center">
        Note: Contact form is for demonstration only. Please use email or social links for actual inquiries.
      </div>
    </div>
  );
}
