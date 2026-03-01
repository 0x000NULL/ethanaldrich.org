"use client";

import { memo } from "react";

function CareerSection() {
  return (
    <div className="space-y-4">
      <div className="text-[#000000] text-lg mb-4">
        ╔══════════════════════════════════════════════════════════╗
        <br />
        ║&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CAREER CONFIGURATION UTILITY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;║
        <br />
        ╚══════════════════════════════════════════════════════════╝
      </div>

      {/* Current Role */}
      <div className="border border-[#AAAAAA] p-3">
        <div className="text-[#228B22] mb-2">► CURRENT POSITION</div>
        <table className="w-full text-sm">
          <tbody>
            <tr>
              <td className="text-[#000000] pr-4 py-1 w-40 align-top">Title:</td>
              <td className="text-black py-1">Chief Technology Officer</td>
            </tr>
            <tr>
              <td className="text-[#000000] pr-4 py-1 align-top">Company:</td>
              <td className="text-black py-1">
                Malco Enterprises of Nevada, LLC
              </td>
            </tr>
            <tr>
              <td className="text-[#000000] pr-4 py-1 align-top">DBA:</td>
              <td className="text-black py-1">Budget Rent a Car Las Vegas</td>
            </tr>
            <tr>
              <td className="text-[#000000] pr-4 py-1 align-top">Duration:</td>
              <td className="text-black py-1">2020 - Present</td>
            </tr>
            <tr>
              <td className="text-[#000000] pr-4 py-1 align-top">Scope:</td>
              <td className="text-black py-1">8 Locations, Las Vegas Metro</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-3 text-[#000000]">Responsibilities:</div>
        <ul className="text-sm mt-1 space-y-1">
          <li>
            <span className="text-[#228B22]">•</span> SQL Server administration
            and database performance optimization
          </li>
          <li>
            <span className="text-[#228B22]">•</span> Power BI development and
            business intelligence reporting
          </li>
          <li>
            <span className="text-[#228B22]">•</span> Active Directory and Group
            Policy management
          </li>
          <li>
            <span className="text-[#228B22]">•</span> GLPI service management
            system administration
          </li>
          <li>
            <span className="text-[#228B22]">•</span> Network infrastructure
            design and maintenance
          </li>
          <li>
            <span className="text-[#228B22]">•</span> Wizard/WAND rental
            management system support
          </li>
        </ul>
      </div>

      {/* Education */}
      <div className="border border-[#AAAAAA] p-3">
        <div className="text-[#228B22] mb-2">► EDUCATION</div>
        <table className="w-full text-sm">
          <tbody>
            <tr>
              <td className="text-[#000000] pr-4 py-1 w-40 align-top">School:</td>
              <td className="text-black py-1">West Career and Technical Academy</td>
            </tr>
            <tr>
              <td className="text-[#000000] pr-4 py-1 align-top">Duration:</td>
              <td className="text-black py-1">2016 - 2020</td>
            </tr>
            <tr>
              <td className="text-[#000000] pr-4 py-1 align-top">Level:</td>
              <td className="text-black py-1">High School</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Download Resume Button */}
      <div className="mt-6 flex justify-center">
        <a
          href="/resume.pdf"
          download
          className="inline-block px-6 py-2 border-2 border-[#AAAAAA] text-black hover:bg-[#AAAAAA] hover:text-[#0000AA] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--bios-accent)] focus-visible:outline-none"
        >
          [ DOWNLOAD CV.PDF ]
        </a>
      </div>

      <div className="text-[#606060] text-xs mt-4 text-center">
        Press F1 for Help | ESC to Exit
      </div>
    </div>
  );
}

export default memo(CareerSection);
