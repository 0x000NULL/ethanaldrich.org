"use client";

import { memo } from "react";

function AboutSection() {
  return (
    <div className="space-y-4">
      <div className="text-[#000000] text-lg mb-4">
        ══════════════════════════════════════════════════════════
      </div>

      <div className="text-center mb-6">
        <pre className="text-[#228B22] text-xs leading-tight inline-block">
{`
    ███████╗████████╗██╗  ██╗ █████╗ ███╗   ██╗
    ██╔════╝╚══██╔══╝██║  ██║██╔══██╗████╗  ██║
    █████╗     ██║   ███████║███████║██╔██╗ ██║
    ██╔══╝     ██║   ██╔══██║██╔══██║██║╚██╗██║
    ███████╗   ██║   ██║  ██║██║  ██║██║ ╚████║
    ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝
`}
        </pre>
      </div>

      <div className="text-[#000000] text-lg mb-4">
        ══════════════════════════════════════════════════════════
      </div>

      <table className="w-full text-sm">
        <tbody>
          <tr>
            <td className="text-[#000000] pr-4 py-1 align-top w-40">Name:</td>
            <td className="text-black py-1">Ethan Aldrich</td>
          </tr>
          <tr>
            <td className="text-[#000000] pr-4 py-1 align-top">Title:</td>
            <td className="text-black py-1">Chief Technology Officer</td>
          </tr>
          <tr>
            <td className="text-[#000000] pr-4 py-1 align-top">Company:</td>
            <td className="text-black py-1">
              Malco Enterprises of Nevada, LLC
              <br />
              <span className="text-[#444444]">(DBA Budget Rent a Car Las Vegas)</span>
            </td>
          </tr>
          <tr>
            <td className="text-[#000000] pr-4 py-1 align-top">Age:</td>
            <td className="text-black py-1">24</td>
          </tr>
          <tr>
            <td className="text-[#000000] pr-4 py-1 align-top">Location:</td>
            <td className="text-black py-1">Las Vegas, NV</td>
          </tr>
        </tbody>
      </table>

      <div className="text-[#000000] my-4">
        ──────────────────────────────────────────────────────────
      </div>

      <div className="space-y-3 text-sm">
        <p>
          <span className="text-[#000000]">&gt;</span> Technology leader with a
          passion for building robust IT infrastructure and solving complex
          technical challenges.
        </p>

        <p>
          <span className="text-[#000000]">&gt;</span> Managing IT operations
          across 8 rental car locations in the Las Vegas metropolitan area,
          specializing in database administration, business intelligence, and
          network infrastructure.
        </p>

        <p>
          <span className="text-[#000000]">&gt;</span> Outside of work, I&apos;m
          an avid homelab enthusiast running a Proxmox-based infrastructure
          hosting dozens of self-hosted services. When I&apos;m not behind a
          keyboard, you&apos;ll find me wrenching on JDM cars or designing my
          dream racecar build.
        </p>

        <p>
          <span className="text-[#000000]">&gt;</span> Amateur radio operator,
           3D printing hobbyist, and lifelong tinkerer.
        </p>
      </div>

      <div className="text-[#000000] my-4">
        ──────────────────────────────────────────────────────────
      </div>

      <div className="text-[#228B22] text-xs">
        README.TXT — Last modified: {new Date().toLocaleDateString()}
      </div>
    </div>
  );
}

export default memo(AboutSection);
