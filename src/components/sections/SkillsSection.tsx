"use client";

interface Skill {
  name: string;
  level: number; // 0-10
}

interface SkillCategory {
  name: string;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    name: "Systems & Infrastructure",
    skills: [
      { name: "Windows Server", level: 9 },
      { name: "Linux (Proxmox, Ubuntu, Debian)", level: 8 },
      { name: "Active Directory", level: 9 },
      { name: "Group Policy", level: 8 },
      { name: "Virtualization (Proxmox/VMware)", level: 9 },
      { name: "Hyper-V", level: 7 },
      { name: "ESXi", level: 6 },
      { name: "Ansible", level: 7 },
      { name: "Backup Solutions (Veeam/Acronis)", level: 7 },
      { name: "RAID Configuration", level: 8 },
      { name: "iSCSI/SAN Storage", level: 6 },
    ],
  },
  {
    name: "Databases",
    skills: [
      { name: "SQL Server", level: 9 },
      { name: "SSMS", level: 9 },
      { name: "T-SQL", level: 8 },
      { name: "SSRS", level: 8 },
      { name: "SSIS", level: 7 },
      { name: "Database Performance Tuning", level: 7 },
      { name: "Data Modeling", level: 7 },
      { name: "MySQL/MariaDB", level: 6 },
      { name: "PostgreSQL", level: 5 },
      { name: "MongoDB", level: 5 },
      { name: "Redis", level: 5 },
      { name: "SQLite", level: 6 },
      { name: "InfluxDB", level: 6 },
      { name: "Elasticsearch", level: 5 },
    ],
  },
  {
    name: "Development & BI",
    skills: [
      { name: "Power BI", level: 9 },
      { name: "DAX", level: 8 },
      { name: "PowerShell", level: 8 },
      { name: "Bash Scripting", level: 7 },
      { name: "HTML/CSS", level: 7 },
      { name: "JavaScript", level: 6 },
      { name: "TypeScript", level: 6 },
      { name: "Node.js", level: 6 },
      { name: "React", level: 5 },
      { name: "Python", level: 6 },
      { name: "C#", level: 6 },
      { name: ".NET Framework", level: 6 },
      { name: "ASP.NET", level: 5 },
      { name: "C/C++", level: 5 },
      { name: "Go", level: 5 },
      { name: "Rust", level: 4 },
      { name: "GraphQL", level: 5 },
    ],
  },
  {
    name: "Networking & Security",
    skills: [
      { name: "TCP/IP", level: 8 },
      { name: "VLANs", level: 8 },
      { name: "VPN (Tailscale, WireGuard)", level: 8 },
      { name: "UniFi", level: 8 },
      { name: "Firewall Management", level: 7 },
      { name: "DNS/DHCP", level: 8 },
      { name: "Cisco IOS", level: 5 },
      { name: "SSL/TLS Certificates", level: 7 },
      { name: "Cloudflare", level: 7 },
      { name: "Load Balancing", level: 6 },
      { name: "Penetration Testing", level: 5 },
      { name: "Network Monitoring (PRTG/Nagios)", level: 7 },
    ],
  },
  {
    name: "Tools & Platforms",
    skills: [
      { name: "Docker", level: 8 },
      { name: "LXC Containers", level: 8 },
      { name: "GLPI", level: 9 },
      { name: "Grafana", level: 7 },
      { name: "Prometheus", level: 7 },
      { name: "Git", level: 7 },
      { name: "Nginx", level: 7 },
    ],
  },
  {
    name: "Hardware & Electronics",
    skills: [
      { name: "3D Printing (CAD/Slicing)", level: 7 },
      { name: "Soldering", level: 7 },
      { name: "PCB Design", level: 4 },
      { name: "Amateur Radio (DMR)", level: 6 },
    ],
  },
  {
    name: "Automotive & Fabrication",
    skills: [
      { name: "Automotive Fabrication", level: 6 },
      { name: "Welding", level: 6 },
      { name: "Engine Tuning/ECU", level: 6 },
      { name: "Data Logging/Analysis", level: 7 },
      { name: "Dyno Tuning", level: 6 },
      { name: "Roll Cage Fabrication", level: 5 },
      { name: "Fiberglass/Carbon Fiber", level: 4 },
      { name: "Racing", level: 6 },
      { name: "E85 Fuel Systems", level: 5 },
    ],
  },
  {
    name: "Professional",
    skills: [
      { name: "Technical Documentation", level: 8 },
      { name: "Project Management", level: 7 },
      { name: "Vendor Management", level: 7 },
      { name: "Budget Management", level: 7 },
    ],
  },
];

function ProgressBar({ level }: { level: number }) {
  const filled = Math.round(level);
  const empty = 10 - filled;
  const filledChars = "█".repeat(filled);
  const emptyChars = "░".repeat(empty);

  return (
    <span className="font-mono">
      <span className="text-[#228B22]">[{filledChars}</span>
      <span className="text-[#606060]">{emptyChars}</span>
      <span className="text-[#228B22]">]</span>
      <span className="text-[#000000] ml-2">{level * 10}%</span>
    </span>
  );
}

export default function SkillsSection() {
  return (
    <div className="space-y-4">
      <div className="text-[#000000] text-lg mb-4">
        ╔══════════════════════════════════════════════════════════╗
        <br />
        ║&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ADVANCED CHIPSET FEATURES&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;║
        <br />
        ╚══════════════════════════════════════════════════════════╝
      </div>

      {skillCategories.map((category) => (
        <div key={category.name} className="border border-[#AAAAAA] p-3">
          <div className="text-[#228B22] mb-2">► {category.name}</div>
          <table className="w-full text-sm">
            <tbody>
              {category.skills.map((skill) => (
                <tr key={skill.name}>
                  <td className="text-[#000000] pr-4 py-1 w-56 align-middle">
                    {skill.name}:
                  </td>
                  <td className="py-1">
                    <ProgressBar level={skill.level} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div className="text-[#606060] text-xs text-center mt-4">
        Press F1 for Help | PgUp/PgDn to scroll | ESC to exit
      </div>
    </div>
  );
}
