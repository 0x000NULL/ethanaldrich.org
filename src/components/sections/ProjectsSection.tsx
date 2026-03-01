"use client";

import { useState, memo } from "react";

type ProjectCategory = "homelab" | "levin" | "beat" | "racecar" | "other";

interface Project {
  id: ProjectCategory;
  name: string;
  shortName: string;
  description: string;
  status: string;
  specs: string[];
}

const projects: Project[] = [
  {
    id: "homelab",
    name: "Homelab Infrastructure",
    shortName: "HOMELAB",
    description:
      "Proxmox-based virtualization cluster running dozens of self-hosted services for personal use and learning.",
    status: "ACTIVE - Continuously Expanding",
    specs: [
      "Proxmox VE Cluster",
      "Plex Media Server",
      "*Arr Stack (Sonarr, Radarr, etc.)",
      "Paperless-ngx Document Management",
      "Vaultwarden Password Manager",
      "Tailscale VPN Mesh",
      "Pi-hole DNS + DHCP",
      "Nginx Proxy Manager",
      "Docker & LXC Containers",
    ],
  },
  {
    id: "levin",
    name: "1992 Toyota Corolla Levin",
    shortName: "AE101 LEVIN",
    description:
      "AE101 chassis Corolla Levin, SJ Limited edition. A rare JDM sports coupe being restored and modified.",
    status: "IN PROGRESS",
    specs: [
      "Chassis: AE101",
      "Engine: 4A-GE 20V Silvertop",
      "Trim: SJ Limited Edition",
      "Transmission: 5-speed Manual",
      "Market: JDM Import",
    ],
  },
  {
    id: "beat",
    name: "1991 Honda Beat K24 Swap",
    shortName: "BEAT K24",
    description:
      "Mid-engine Honda Beat kei car undergoing a K24 engine swap for significantly more power while maintaining the lightweight chassis.",
    status: "IN PROGRESS",
    specs: [
      "Base: 1991 Honda Beat PP1",
      "Swap Engine: K24A",
      "Layout: Mid-engine RWD",
      "Target Power: 200+ HP",
      "Custom Fabrication Required",
    ],
  },
  {
    id: "racecar",
    name: "Custom Racecar Build",
    shortName: "RACECAR",
    description:
      "Ground-up custom racecar build featuring a twin-charged K24 engine targeting 800-1,200 HP in a lightweight tube chassis.",
    status: "PLANNING / EARLY FABRICATION",
    specs: [
      "Chassis: 4130 Chromoly Space Frame",
      "Engine: K24 Twin-Charged",
      "Turbo + Supercharger Setup",
      "Target: 800-1,200 HP",
      "Fuel: E85",
      "Custom Fuel System Design",
      "Weight Target: Under 2,000 lbs",
    ],
  },
  {
    id: "other",
    name: "Other Projects",
    shortName: "MISC",
    description: "Various side projects and hobbies including 3D printing, amateur radio, and other technical endeavors.",
    status: "ONGOING",
    specs: [
      "3D Printing (FDM/Resin)",
      "Amateur Radio (DMR)",
      "Electronics & Microcontrollers",
      "CAD Design",
      "Custom Tool Fabrication",
    ],
  },
];

function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<ProjectCategory>("homelab");

  const currentProject = projects.find((p) => p.id === selectedProject);

  return (
    <div className="space-y-4">
      <div className="text-[#000000] text-lg mb-4">
        ╔══════════════════════════════════════════════════════════╗
        <br />
        ║&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BOOT DEVICE PRIORITY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;║
        <br />
        ╚══════════════════════════════════════════════════════════╝
      </div>

      {/* Project selector */}
      <div className="border border-[#AAAAAA] p-2">
        <div className="text-[#228B22] mb-2">Select Project:</div>
        <div className="space-y-1">
          {projects.map((project, index) => (
            <button
              key={project.id}
              onClick={() => setSelectedProject(project.id)}
              className={`w-full text-left px-2 py-1 ${
                selectedProject === project.id
                  ? "bg-[#AAAAAA] text-[#0000AA]"
                  : "hover:bg-[#000080]"
              }`}
            >
              <span className="text-[#000000] mr-2">{index + 1}.</span>
              [{project.shortName}]
            </button>
          ))}
        </div>
      </div>

      {/* Project details */}
      {currentProject && (
        <div className="border border-[#AAAAAA] p-3 space-y-3">
          <div className="text-[#228B22] text-lg">{currentProject.name}</div>

          <div>
            <span className="text-[#000000]">Status: </span>
            <span
              className={
                currentProject.status.includes("ACTIVE")
                  ? "text-[#228B22]"
                  : "text-[#000000]"
              }
            >
              {currentProject.status}
            </span>
          </div>

          <div>
            <span className="text-[#000000]">Description:</span>
            <p className="mt-1 text-sm">{currentProject.description}</p>
          </div>

          <div>
            <span className="text-[#000000]">Specifications:</span>
            <ul className="mt-1 text-sm space-y-1">
              {currentProject.specs.map((spec, index) => (
                <li key={index}>
                  <span className="text-[#228B22]">•</span> {spec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="text-[#606060] text-xs text-center">
        Use ↑↓ to navigate | Enter to select | ESC to exit
      </div>
    </div>
  );
}

export default memo(ProjectsSection);
