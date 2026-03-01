"use client";

import { useState, useEffect } from "react";
import { ProgressBar } from "@/components/ui";

interface FdiskStatsProps {
  onBack: () => void;
}

interface VisitorStats {
  visitors: number;
  pageViews: number;
  lastVisit: string;
}

interface Partition {
  label: string;
  drive: string;
  type: string;
  size: string;
  used: string;
  free: string;
  percent: number;
  description: string;
}

const partitions: Partition[] = [
  {
    label: "SYSTEM",
    drive: "C:",
    type: "FAT32",
    size: "100 MB",
    used: "85 MB",
    free: "15 MB",
    percent: 85,
    description: "Core portfolio system files",
  },
  {
    label: "SKILLS",
    drive: "D:",
    type: "NTFS",
    size: "500 MB",
    used: "375 MB",
    free: "125 MB",
    percent: 75,
    description: "75+ technical skills across 8 categories",
  },
  {
    label: "PROJECTS",
    drive: "E:",
    type: "NTFS",
    size: "2 GB",
    used: "1.4 GB",
    free: "600 MB",
    percent: 70,
    description: "Homelab, cars, racing, and more",
  },
  {
    label: "BLOG",
    drive: "F:",
    type: "EXT4",
    size: "1 GB",
    used: "112 MB",
    free: "912 MB",
    percent: 11,
    description: "5 technical write-ups and growing",
  },
  {
    label: "CAREER",
    drive: "G:",
    type: "NTFS",
    size: "250 MB",
    used: "200 MB",
    free: "50 MB",
    percent: 80,
    description: "CTO experience and certifications",
  },
];


export default function FdiskStats({ onBack }: FdiskStatsProps) {
  const [stats, setStats] = useState<VisitorStats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {
        // Silently fail
      });
  }, []);

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Unknown";
    }
  };

  return (
    <div>
      <div className="text-bios-success mb-4">► FDISK - Fixed Disk Partition Info</div>

      <div className="border border-[#AAAAAA] p-4 mb-4">
        <div className="text-[#000000] text-lg mb-4 text-center">
          ╔══════════════════════════════════════════════════════════╗
          <br />
          ║&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DISK PARTITION INFORMATION&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;║
          <br />
          ╚══════════════════════════════════════════════════════════╝
        </div>

        <table className="w-full text-sm mb-4" style={{ borderSpacing: "0.5rem 0.25rem", borderCollapse: "separate" }}>
          <thead>
            <tr className="text-bios-success">
              <th className="text-left">DRIVE</th>
              <th className="text-left">LABEL</th>
              <th className="text-left">TYPE</th>
              <th className="text-right">SIZE</th>
              <th className="text-right">USED</th>
              <th className="text-left pl-4">CAPACITY</th>
            </tr>
          </thead>
          <tbody>
            {partitions.map((p) => (
              <tr key={p.drive} className="text-[#AAAAAA]">
                <td className="text-white">{p.drive}</td>
                <td className="text-[#000000]">{p.label}</td>
                <td>{p.type}</td>
                <td className="text-right">{p.size}</td>
                <td className="text-right">{p.used}</td>
                <td className="pl-4">
                  <ProgressBar value={p.percent} width={20} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border-t border-[#606060] pt-4 mt-4">
          <div className="text-bios-success mb-2">► Partition Details</div>
          <div className="space-y-2 text-sm">
            {partitions.map((p) => (
              <div key={p.drive} className="flex">
                <span className="text-white w-8">{p.drive}</span>
                <span className="text-[#606060]">{p.description}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#606060] pt-4 mt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-[#000000]">Total Disk Space:</span>
            <span className="text-white">3.85 GB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#000000]">Total Used:</span>
            <span className="text-bios-success">2.17 GB (56%)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#000000]">Total Free:</span>
            <span className="text-[#606060]">1.68 GB</span>
          </div>
        </div>

        {stats && (
          <div className="border-t border-[#606060] pt-4 mt-4 text-sm">
            <div className="text-bios-success mb-2">► System Statistics</div>
            <div className="flex justify-between">
              <span className="text-[#000000]">Total Visitors:</span>
              <span className="text-white">{stats.visitors.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#000000]">Page Views:</span>
              <span className="text-bios-success">{stats.pageViews.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#000000]">Last Access:</span>
              <span className="text-[#606060]">{formatDate(stats.lastVisit)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="text-bios-success hover:underline cursor-pointer"
        >
          ← Back to Advanced Settings
        </button>
        <span className="text-[#606060] text-xs">
          FDISK v4.20 - (C) Aldrich Systems
        </span>
      </div>
    </div>
  );
}
