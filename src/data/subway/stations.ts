import type { Station } from "./types";

/**
 * Hand-authored octolinear layout (validated by src/data/subway/index.test.ts).
 *
 * Grid bands: E (Education) gy=4 · P (Projects) gy=6 · C (Career) gy=10–12 ·
 * W (Weekend) gx=3 dashed downward. The E line starts at gx=-1 so the earned
 * certifications fit to the left of the Security+ ↔ P-04 interchange, which is
 * pinned at gx=9 by the peanut spacing rule.
 *
 * Honesty rule: work that actually happened is "operational"; the remaining
 * cert path is "planned"; the degree in flight is "in-progress". A finished
 * role stays "operational" and carries its end date in `dates`.
 */
export const STATIONS: Station[] = [
  // ───────────────────────── E — Education (cyan) ─────────────────────────
  {
    code: "E-01",
    name: "High School",
    nameJa: "高校",
    lineCodes: ["E"],
    grid: { gx: -1, gy: 4 },
    status: "operational",
    dates: "2015 to 2020",
    summary:
      "West Career & Technical Academy, Las Vegas: a Graphic Design diploma, which is where the visual side of this map comes from. The technical line starts after it.",
  },
  {
    code: "E-02",
    name: "A+",
    nameJa: "A＋",
    lineCodes: ["E"],
    grid: { gx: 1, gy: 4 },
    status: "operational",
    dates: "Jun 2026",
    summary:
      "CompTIA A+ (220-1201 and 220-1202): hardware, operating systems, endpoint support and troubleshooting. The first rung of the stack that ends at CSIS.",
    stack: [
      "Hardware",
      "Windows / Linux / macOS",
      "Endpoint support",
      "Troubleshooting",
    ],
  },
  {
    code: "E-03",
    name: "Network+",
    nameJa: "ネットワーク＋",
    lineCodes: ["E"],
    grid: { gx: 3, gy: 4 },
    status: "operational",
    dates: "Jun 2026",
    summary:
      "CompTIA Network+: addressing, routing and switching, and network troubleshooting. The formal credential under the SD-WAN, VLAN segmentation and firewall work on the Career line.",
    stack: [
      "TCP/IP",
      "Routing & switching",
      "VLANs",
      "Network troubleshooting",
    ],
  },
  {
    code: "E-04",
    name: "IT Ops Specialist",
    nameJa: "IT運用専門",
    lineCodes: ["E"],
    grid: { gx: 5, gy: 4 },
    status: "operational",
    dates: "Jun 2026",
    summary:
      "CompTIA IT Operations Specialist (CIOS): the stackable credential awarded for holding A+ and Network+ together. Not a separate exam — it certifies the combination.",
    stack: ["A+", "Network+", "Stackable"],
  },
  {
    code: "E-05",
    name: "ITIL v4",
    nameJa: "ITIL v4",
    lineCodes: ["E"],
    grid: { gx: 7, gy: 4 },
    status: "operational",
    // Deliberately no `dates`: this one is asserted by the resume but no dated
    // certificate was to hand, and an invented date on a verifiable credential
    // is worse than none.
    summary:
      "ITIL v4 Foundations: the service-management vocabulary — incident, problem, change and service request — behind the GLPI ITSM practice run for both companies.",
    stack: [
      "Incident management",
      "Problem management",
      "Change enablement",
      "Service desk",
    ],
  },
  {
    code: "E-06",
    name: "Security+",
    nameJa: "セキュリティ＋",
    lineCodes: ["E"],
    grid: { gx: 9, gy: 4 },
    status: "operational",
    dates: "Sep 2026",
    hasBody: true,
    summary:
      "CompTIA Security+ (SY0-701), earned September 2026: threats and attacks, security architecture, operations and incident response, and governance. The formal credential behind the detection stack it interchanges with.",
    stack: [
      "Threats & attacks",
      "Security architecture",
      "Operations & incident response",
      "Governance & risk",
    ],
  },
  {
    code: "E-07",
    name: "CySA+",
    nameJa: "サイサ＋",
    lineCodes: ["E"],
    grid: { gx: 11, gy: 4 },
    status: "planned",
    summary:
      "CompTIA CySA+: threat detection, behavioural analytics and incident response — the analyst-side counterpart to the stack already running at P-04. Exam sat September 2026; result pending. Transfers to the Malware Analysis Lab.",
    stack: [
      "Threat detection",
      "Behavioural analytics",
      "Vulnerability management",
      "Incident response",
    ],
  },
  {
    code: "E-08",
    name: "PenTest+",
    nameJa: "ペンテスト＋",
    lineCodes: ["E"],
    grid: { gx: 13, gy: 4 },
    status: "planned",
    summary:
      "CompTIA PenTest+: scoping and planning, reconnaissance, exploitation, and — the part that matters most day to day — writing findings up so someone can act on them. Exam sat September 2026; result pending.",
    stack: [
      "Scoping & planning",
      "Reconnaissance",
      "Exploitation",
      "Reporting",
    ],
  },
  {
    code: "E-09",
    name: "Project+",
    nameJa: "プロジェクト＋",
    lineCodes: ["E"],
    grid: { gx: 15, gy: 4 },
    status: "operational",
    dates: "Sep 2026",
    summary:
      "CompTIA Project+ (PK0-005), earned September 2026: project scoping, scheduling, communication and delivery — the discipline behind running a $750K budget and multi-site rollouts.",
    stack: [
      "Project scoping",
      "Scheduling",
      "Stakeholder communication",
      "Delivery",
    ],
  },
  {
    code: "E-10",
    name: "CSIS",
    nameJa: "CSIS",
    lineCodes: ["E"],
    grid: { gx: 17, gy: 4 },
    status: "operational",
    dates: "Sep 2026",
    summary:
      "CompTIA Secure Infrastructure Specialist (CSIS): the stackable credential awarded for holding A+, Network+ and Security+ together — the terminus of the certification run, not a fifth exam.",
    stack: ["A+", "Network+", "Security+", "Stackable"],
  },
  {
    code: "E-12",
    name: "WGU — B.S. Cybersecurity",
    nameJa: "学士課程",
    lineCodes: ["E"],
    grid: { gx: 19, gy: 4 },
    status: "in-progress",
    terminus: true,
    labelSide: "below", // keep the upward master's spur clear of the label
    labelBand: "near", // pull the below-label up off the Projects trunk
    dates: "expected December 2026",
    hasBody: true,
    summary:
      "Western Governors University: B.S. Cybersecurity & Information Assurance, approved for graduation and expected December 2026. Competency-based, so each course is a proctored assessment or a defended project rather than seat time.",
    stack: [
      "Security operations",
      "Network security",
      "Digital forensics",
      "Secure software",
      "Governance & compliance",
    ],
  },
  {
    code: "E-13",
    name: "M.S. Cybersecurity",
    nameJa: "修士号予定",
    lineCodes: ["E"],
    grid: { gx: 19, gy: 2 },
    status: "planned",
    summary:
      "M.S. Cybersecurity & Information Assurance: planned service beyond the bachelor's, on the same competency-based model. Not yet started — the branch is dashed for a reason.",
  },

  // ───────────────────────── P — Projects (magenta) ─────────────────────────
  {
    code: "P-01",
    name: "Proxmox Homelab",
    nameJa: "ホームラボ",
    lineCodes: ["P"],
    grid: { gx: 3, gy: 6 },
    status: "operational",
    labelSide: "above", // keep the downward Weekend spur clear of the label
    hasBody: true,
    summary: "Proxmox VE cluster hosting dozens of self-hosted services.",
    dates: "2020 to Present",
    stack: ["Proxmox VE", "Docker", "LXC", "Tailscale", "Nginx"],
  },
  {
    code: "P-02",
    name: "DGX Spark Cluster",
    nameJa: "DGXクラスタ",
    lineCodes: ["P"],
    grid: { gx: 5, gy: 6 },
    status: "planned",
    summary: "Planned local inference cluster — vLLM + agent orchestration.",
    stack: ["vLLM", "CUDA", "Kubernetes"],
  },
  {
    code: "P-03",
    name: "Yacht AV / UniFi Network",
    nameJa: "ヨットAV網",
    lineCodes: ["P"],
    grid: { gx: 7, gy: 6 },
    status: "operational",
    hasBody: true,
    summary: "Full network + AV integration on Ocean Alexander 32E and Princess Y72.",
    dates: "2025",
    stack: ["UniFi", "Control4", "Dual Starlink", "VLANs", "PoE"],
    relatedPosts: ["yacht-av-network"],
  },
  {
    code: "P-04",
    name: "Security Observability Stack",
    nameJa: "監視基盤",
    lineCodes: ["P"],
    grid: { gx: 9, gy: 6 },
    status: "operational",
    hasBody: true,
    // No `dates` yet: the resume's "since 2023" refers to the uptime figure, not
    // to when this stack went in, and nothing on hand dates the deployment. An
    // inferred date on the marquee station is not worth the risk.
    summary:
      "Detection and monitoring in production across eight sites: Wazuh, Suricata and Zeek feeding Graylog, Elasticsearch and Grafana. Transfer from Security+.",
    stack: [
      "Wazuh",
      "Suricata",
      "Zeek",
      "Graylog",
      "Elasticsearch",
      "Grafana",
    ],
  },
  {
    code: "P-05",
    name: "Malware Analysis Lab",
    nameJa: "マルウェア解析室",
    lineCodes: ["P"],
    grid: { gx: 11, gy: 6 },
    status: "planned",
    summary: "Planned hardened QEMU/KVM detonation lab. Transfer from CySA+.",
    stack: ["QEMU/KVM", "Linux", "Network isolation"],
  },
  {
    code: "P-06",
    name: "Stratux ADS-B",
    nameJa: "ADS-B受信機",
    lineCodes: ["P"],
    grid: { gx: 13, gy: 6 },
    status: "planned",
    summary: "Planned Stratux ADS-B receiver build for aircraft tracking.",
    stack: ["SDR", "Raspberry Pi", "Stratux"],
  },
  {
    code: "P-07",
    name: "Montr Signage",
    nameJa: "モントル",
    lineCodes: ["P"],
    grid: { gx: 15, gy: 6 },
    status: "operational",
    terminus: true,
    hasBody: true,
    summary: "Distributed digital signage — Rust client + Node/TS server, 25+ displays.",
    dates: "2025 to Present",
    stack: ["Rust", "Node.js", "TypeScript", "WebSocket", "mpv"],
    links: [{ label: "github.com/0x000NULL", href: "https://github.com/0x000NULL" }],
    relatedPosts: ["montr-signage"],
  },

  // ───────────────────────── C — Career (red, express) ─────────────────────────
  {
    code: "C-00",
    name: "Starbucks",
    nameJa: "スターバックス",
    lineCodes: ["C"],
    grid: { gx: 7, gy: 12 },
    status: "operational",
    summary:
      "Assistant Store Manager — the four years before the line turned technical.",
    dates: "Jun 2017 to Sep 2021",
  },
  {
    code: "C-01",
    name: "Malco / Budget",
    nameJa: "マルコ社",
    lineCodes: ["C"],
    grid: { gx: 13, gy: 10 },
    status: "operational",
    hasBody: true,
    summary:
      "Chief Technology Officer: security operations, infrastructure and software for 314 employees across eight locations; 99.993% uptime since 2023 on a $750K annual IT budget.",
    dates: "Sep 2021 to Present",
    stack: [
      "Wazuh",
      "Suricata",
      "Microsoft Defender",
      "Sentinel",
      "Kubernetes",
      "SD-WAN",
      "Cisco IOS",
      "Terraform",
      "Node.js",
      "Python/FastAPI",
    ],
    links: [{ label: "Résumé (PDF)", href: "/resume.pdf" }],
  },
  {
    code: "C-03",
    name: "Twelve Management",
    nameJa: "トゥエルブ社",
    lineCodes: ["C"],
    grid: { gx: 17, gy: 10 },
    status: "operational",
    terminus: true,
    express: true,
    hasBody: true,
    summary:
      "Chief Technology Officer: IT built from scratch for nine subsidiaries and a team of 52.",
    dates: "Nov 2021 to Present",
    stack: ["Windows Server", "Active Directory", "Networking", "Security Policy"],
    links: [{ label: "Résumé (PDF)", href: "/resume.pdf" }],
  },

  // ───────────────────────── W — Weekend (dashed spur off P-01) ─────────────────────
  {
    code: "W-01",
    name: "Honda Beat K24",
    nameJa: "ホンダ・ビート",
    lineCodes: ["W"],
    grid: { gx: 3, gy: 8 },
    status: "operational",
    summary: "Mid-engine K24 swap targeting 200+ HP.",
  },
  {
    code: "W-02",
    name: "AE101 Levin",
    nameJa: "カローラ・レビン",
    lineCodes: ["W"],
    grid: { gx: 3, gy: 10 },
    status: "operational",
    summary: "1992 Toyota Corolla Levin SJ — 4A-GE 20V Silvertop, JDM import.",
  },
  {
    code: "W-03",
    name: "Racecar Build",
    nameJa: "レーシングカー",
    lineCodes: ["W"],
    grid: { gx: 3, gy: 12 },
    status: "planned",
    summary: "Twin-charged K24 in a 4130 chromoly space frame — early fabrication.",
  },
];
