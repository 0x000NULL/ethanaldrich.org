"use client";

import { useState } from "react";

interface BlogPost {
  id: string;
  filename: string;
  extension: string;
  size: number;
  date: string;
  title: string;
  description: string;
  content: string;
}

// Sample blog posts - in production these would come from MDX files
const blogPosts: BlogPost[] = [
  {
    id: "portfolio-website",
    filename: "PORTFOLIO-DEV",
    extension: "TXT",
    size: 28750,
    date: "02-22-2026",
    title: "Building a Retro AMI BIOS Portfolio Website",
    description: "Deep dive into creating this nostalgic portfolio site",
    content: `
BUILDING A RETRO AMI BIOS PORTFOLIO WEBSITE
===========================================
A Deep Dive into Nostalgia-Driven Web Development

Author: Ethan Aldrich
Date: February 2026
Status: Complete

TABLE OF CONTENTS
-----------------
1. Introduction & Concept
2. Technology Stack Selection
3. Project Architecture
4. The Boot Sequence
5. Desktop Environment
6. Window Management System
7. Section Components
8. Easter Eggs & Hidden Features
9. Styling & Typography
10. Challenges & Solutions
11. Deployment
12. Conclusion

============================================================
1. INTRODUCTION & CONCEPT
============================================================

As someone who grew up in the era of DOS, Windows 3.1, and those
iconic blue BIOS screens, I wanted my personal portfolio to reflect
that nostalgia while still being a modern, functional website.

The goal was to create an immersive experience that transports
visitors back to the late 80s and early 90s PC era, complete with:

- An authentic AMI BIOS POST (Power-On Self-Test) sequence
- A desktop environment reminiscent of early Windows
- Draggable windows with classic chrome styling
- Bitmap fonts and period-accurate color schemes
- Hidden easter eggs for the curious explorer

This isn't just a gimmick - it's a statement about where I come from
as a technologist and the era that shaped my love for computers.

============================================================
2. TECHNOLOGY STACK SELECTION
============================================================

Despite the retro aesthetic, the underlying technology is thoroughly
modern. Here's what powers this site:

FRAMEWORK: Next.js 14 (App Router)
----------------------------------
Next.js was chosen for several reasons:
- Server-side rendering for fast initial loads
- App Router for clean, intuitive routing
- Built-in optimization for fonts and images
- Excellent TypeScript support
- Easy deployment to various platforms

LANGUAGE: TypeScript
--------------------
Type safety was non-negotiable for a project of this complexity.
TypeScript catches errors at compile time and provides excellent
IDE support for refactoring and navigation.

STYLING: Tailwind CSS
---------------------
Tailwind's utility-first approach made it easy to:
- Rapidly prototype the retro aesthetic
- Maintain consistent spacing and sizing
- Create responsive designs without media query spaghetti
- Keep the CSS bundle small through purging

ANIMATION: Framer Motion
------------------------
The boot sequence and window interactions required smooth
animations. Framer Motion provides:
- Declarative animation syntax
- Drag gesture support for windows
- Layout animations for state changes
- Exit animations for closing windows

STATE MANAGEMENT: Zustand
-------------------------
For managing the desktop state (open windows, z-ordering,
positions), Zustand was perfect:
- Minimal boilerplate compared to Redux
- TypeScript-first design
- No providers needed
- Persistent state via middleware

============================================================
3. PROJECT ARCHITECTURE
============================================================

The project follows a clean, modular structure:

src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with fonts
│   ├── page.tsx           # Main entry point
│   └── globals.css        # Global styles & CSS variables
├── components/
│   ├── boot/              # Boot sequence components
│   │   ├── PostScreen.tsx # Main POST display
│   │   └── CmosSetup.tsx  # BIOS setup easter egg
│   ├── desktop/           # Desktop environment
│   │   ├── Desktop.tsx    # Main desktop container
│   │   ├── DesktopIcon.tsx# Clickable program icons
│   │   ├── Window.tsx     # Draggable window component
│   │   └── StatusBar.tsx  # Bottom status bar
│   ├── sections/          # Content sections
│   │   ├── AboutSection.tsx
│   │   ├── CareerSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── ContactSection.tsx
│   │   └── BlogSection.tsx
│   └── games/
│       └── SnakeGame.tsx  # Hidden snake game
├── store/
│   └── desktop-store.ts   # Zustand store for window state
├── data/
│   └── boot-sequence.ts   # Boot text configuration
└── lib/
    └── useBootSequence.ts # Boot sequence hook

============================================================
4. THE BOOT SEQUENCE
============================================================

The boot sequence is the first thing visitors see, and it sets
the tone for the entire experience. Here's how it works:

STRUCTURE
---------
The POST screen displays line-by-line, mimicking a real BIOS:

  AMIBIOS (C) 2025 Ethan Aldrich Systems, Inc.
  ALDRICH BIOS v4.20 - Personal Portfolio BIOS

  Main Processor: Intel Core i7-Brain @ 3.2 GHz
  Memory Test:    1048576 KB OK

  Detecting Primary Master...   [PROJECTS]
  Detecting Primary Slave...    [EXPERIENCE]
  Detecting Secondary Master... [SKILLS]
  Detecting Secondary Slave...  [BLOG]

  Press DEL to enter SETUP, or any key to continue...

IMPLEMENTATION
--------------
The sequence is driven by a custom hook (useBootSequence) that:

1. Maintains state: idle | booting | complete | setup
2. Processes lines with configurable timing delays
3. Handles keyboard events (DEL for setup, any key to skip)
4. Supports a "fast boot" mode for returning visitors

The memory test is particularly fun - it rapidly increments
numbers to simulate the classic RAM check, using requestAnimationFrame
for smooth 60fps updates.

TIMING
------
Each line has configurable delays:
- Standard text: 50-100ms
- Drive detection: 200ms pause before result
- Memory count: Real-time increment animation
- Final prompt: Blinking cursor effect

AUTO-ADVANCE
------------
After 10 seconds of inactivity, the boot automatically completes.
This ensures visitors aren't stuck if they don't know to press
a key, while still giving enthusiasts time to enjoy the show.

============================================================
5. DESKTOP ENVIRONMENT
============================================================

After the boot sequence, users arrive at the desktop - a loving
recreation of early Windows aesthetics.

LAYOUT
------
- Dark blue background (#000040)
- Centered grid of program icons
- Status bar at the bottom
- Title bar showing "ALDRICH OS v1.0"

ICONS
-----
Each icon represents a section of the portfolio:

  ABOUT.EXE    - Personal information
  CAREER.EXE   - Work experience
  PROJECTS.EXE - Portfolio projects
  SKILLS.DAT   - Technical skills
  CONTACT.COM  - Contact information
  BLOG.TXT     - Technical blog posts
  GAMES.EXE    - Hidden snake game (easter egg!)

Icons are custom SVGs designed in a pixel-art style, using a
32x32 grid with crisp-edges rendering for that authentic look.

RESPONSIVENESS
--------------
The desktop adapts to different screen sizes:
- Desktop: Full experience with draggable windows
- Tablet: Simplified layout, larger touch targets
- Mobile: Full-screen windows, vertical icon list

============================================================
6. WINDOW MANAGEMENT SYSTEM
============================================================

The window system is where things get technically interesting.

ZUSTAND STORE
-------------
The desktop-store manages:
- Array of window states (id, isOpen, position, zIndex)
- Actions: openWindow, closeWindow, focusWindow, moveWindow

interface WindowState {
  id: WindowId;
  isOpen: boolean;
  position: { x: number; y: number };
  zIndex: number;
}

Z-ORDERING
----------
When a window is clicked/focused, it gets the highest z-index.
This is tracked globally to ensure proper stacking order.

DRAGGING
--------
Windows are draggable via Framer Motion's drag gesture:
- drag={true} enables dragging
- dragMomentum={false} prevents "throw" behavior
- dragConstraints keeps windows on screen
- onDragEnd persists the new position to state

WINDOW CHROME
-------------
The classic Windows 3.1 look is achieved through CSS:
- 3D beveled borders (highlight top/left, shadow bottom/right)
- Blue gradient title bar
- Centered title text
- Close button with hover/active states

The "chrome-raised" and "chrome-sunken" CSS classes create
the characteristic 3D button effects using box-shadows and
border colors.

============================================================
7. SECTION COMPONENTS
============================================================

Each section is designed to feel like a different DOS program
or BIOS utility screen.

ABOUT SECTION
-------------
Styled like a README.TXT file with ASCII art header:

  ███████╗████████╗██╗  ██╗ █████╗ ███╗   ██╗
  ██╔════╝╚══██╔══╝██║  ██║██╔══██╗████╗  ██║
  █████╗     ██║   ███████║███████║██╔██╗ ██║
  ...

Personal information displayed in a clean table format.

CAREER SECTION
--------------
Mimics a BIOS hardware information screen with:
- Current position details in table format
- Responsibilities as bullet points
- Education section
- Download CV button styled as a DOS command

SKILLS SECTION
--------------
Styled after BIOS "Advanced Chipset Features":
- Categories as collapsible sections
- Skills with ASCII progress bars: [████████░░] 80%
- Over 75 skills across 8 categories

PROJECTS SECTION
----------------
Uses a tabbed interface like BIOS boot priority:
- Categories: Homelab, Cars, Racing, etc.
- Each project with description and status

CONTACT SECTION
---------------
Features a visual-only contact form:
- Monospaced input fields
- Retro button styling
- Email obfuscation for spam prevention
- Links to GitHub and LinkedIn

BLOG SECTION
------------
Displays as a DOS DIR listing:
- Filename, extension, size, date columns
- Click to open posts in reader view
- Posts stored as content within the component

============================================================
8. EASTER EGGS & HIDDEN FEATURES
============================================================

No retro site would be complete without easter eggs!

CMOS SETUP (DEL during boot)
----------------------------
Pressing DEL during the POST sequence opens a full AMI BIOS
setup replica:
- Standard CMOS Features (personal stats)
- Advanced Settings (theme toggles coming soon)
- Boot Priority (reorder sections)
- Load Optimized Defaults
- Save & Exit

Navigation works with arrow keys and Enter, just like real BIOS.

SNAKE GAME (GAMES.EXE)
----------------------
A fully playable snake game hidden in the Games icon:
- Classic gameplay mechanics
- Monochrome retro styling
- Keyboard controls (arrow keys)
- High score tracking via localStorage
- Pause functionality

The game uses requestAnimationFrame for smooth animation and
stores the game state (snake position, food, score) in React
state with useReducer.

============================================================
9. STYLING & TYPOGRAPHY
============================================================

FONTS
-----
The authentic look required period-accurate bitmap fonts.
After much research, I settled on:

Primary: DOS/V re. JPN19
- Japanese DOS font with excellent character coverage
- Clean rendering at small sizes
- Available in WOFF format for web use

The font is self-hosted to avoid external dependencies and
ensure consistent rendering across browsers.

COLOR PALETTE
-------------
The color scheme is based on classic VGA colors:

--bios-bg: #0000AA        (Classic BIOS blue)
--bios-text: #AAAAAA      (Light grey text)
--bios-highlight: #FFFFFF (White highlights)
--bios-accent: #000000    (Black for contrast)
--bios-success: #228B22   (Forest green)
--chrome-base: #C0C0C0    (Windows chrome grey)
--chrome-shadow: #808080  (3D shadow)
--chrome-highlight: #FFFFFF (3D highlight)
--desktop-bg: #000040     (Dark blue desktop)

CSS TECHNIQUES
--------------
Several CSS tricks create the authentic look:

1. Box shadows for 3D beveled effects
2. Linear gradients for title bars
3. shape-rendering: crispEdges for pixel-perfect icons
4. Custom scrollbars styled to match the theme
5. Selection colors matching the palette

============================================================
10. CHALLENGES & SOLUTIONS
============================================================

CHALLENGE: Font Rendering
-------------------------
Bitmap fonts can look blurry on modern high-DPI displays.

Solution: Careful font-size selection (multiples of the base
size), -webkit-font-smoothing: none where supported, and
fallback to system monospace fonts.

CHALLENGE: Window Dragging on Mobile
------------------------------------
Touch dragging conflicted with scroll behavior.

Solution: Full-screen windows on mobile devices, eliminating
the need for dragging entirely while maintaining usability.

CHALLENGE: Boot Sequence Timing
-------------------------------
Getting the timing "right" was subjective and required
extensive testing.

Solution: Configurable delays per line type, with faster
defaults for returning visitors (detected via localStorage).

CHALLENGE: Color Contrast
-------------------------
The original VGA colors had poor contrast on light backgrounds.

Solution: Iteratively adjusted colors based on actual usage,
darkening yellows to black and bright greens to forest green.

CHALLENGE: Table Spacing
------------------------
CSS table layouts with Tailwind padding weren't working.

Solution: Used border-collapse: separate with border-spacing
for reliable column gaps.

============================================================
11. DEPLOYMENT
============================================================

The site is deployed on DigitalOcean App Platform:

CONFIGURATION (.do/app.yaml)
----------------------------
- Node.js environment
- Automatic builds on push to main
- Custom domain support
- SSL certificate auto-provisioning

BUILD PROCESS
-------------
1. npm install - Install dependencies
2. npm run build - Next.js production build
3. npm run start - Start production server

The build process is straightforward thanks to Next.js's
excellent production optimization.

PERFORMANCE
-----------
Despite the animations and complexity:
- First Contentful Paint: < 1s
- Time to Interactive: < 2s
- Lighthouse Performance: 90+

============================================================
12. CONCLUSION
============================================================

Building this portfolio was a labor of love that combined my
passion for retro computing with modern web development skills.

The project taught me:
- The importance of attention to detail in creating atmosphere
- How to balance nostalgia with usability
- Creative problem-solving within self-imposed constraints
- That sometimes the "wrong" approach is the most fun

If you've made it this far, thank you for reading! Feel free
to explore the site, find the easter eggs, and reach out if
you have questions about the implementation.

The source code is available on GitHub for those who want to
dig deeper into the implementation details.

Happy computing!

- Ethan

============================================================
END OF FILE
============================================================
    `,
  },
  {
    id: "homelab-setup",
    filename: "HOMELAB-SETUP",
    extension: "TXT",
    size: 12450,
    date: "01-15-2026",
    title: "Setting up Proxmox from Scratch",
    description: "Complete guide to Proxmox homelab setup",
    content: `
HOMELAB INFRASTRUCTURE SETUP GUIDE
==================================

This guide covers setting up a Proxmox-based homelab from scratch,
including network configuration, storage setup, and container deployment.

Prerequisites:
- Dedicated server or workstation hardware
- Proxmox VE ISO
- Network connectivity

Step 1: Install Proxmox VE
--------------------------
Download the latest Proxmox VE ISO and create a bootable USB drive.
Boot from the USB and follow the installation wizard.

Step 2: Network Configuration
-----------------------------
Configure your network interfaces for VLAN support if needed.
Set up bridge interfaces for VM connectivity.

Step 3: Storage Configuration
-----------------------------
Set up ZFS pools for redundancy and performance.
Configure local-lvm for container storage.

[Content continues...]
    `,
  },
  {
    id: "glpi-deploy",
    filename: "GLPI-DEPLOY",
    extension: "TXT",
    size: 8200,
    date: "12-20-2025",
    title: "Deploying GLPI for IT Service Management",
    description: "Guide to deploying GLPI ITSM platform",
    content: `
GLPI DEPLOYMENT GUIDE
=====================

GLPI (Gestionnaire Libre de Parc Informatique) is a powerful
open-source IT service management platform.

This guide covers deployment on a Proxmox LXC container.

Requirements:
- Proxmox VE host
- Debian/Ubuntu container
- MySQL/MariaDB database
- Apache/Nginx web server
- PHP 7.4+ with required extensions

[Content continues...]
    `,
  },
  {
    id: "k24-swap",
    filename: "K24-SWAP-LOG",
    extension: "TXT",
    size: 15300,
    date: "11-10-2025",
    title: "Honda Beat K24 Swap Progress Log",
    description: "Documentation of K24 engine swap into Honda Beat",
    content: `
HONDA BEAT K24 SWAP PROJECT LOG
===============================

Project: K24 Engine Swap into 1991 Honda Beat PP1
Status: In Progress

OVERVIEW
--------
The Honda Beat is a mid-engine kei car with the engine behind
the seats. Swapping in a K24 requires significant modification
to the rear subframe and custom fabrication.

CURRENT PROGRESS
----------------
- Engine and transmission sourced (K24A + 6-speed)
- Rear subframe removal complete
- Custom engine mount design in progress

[Content continues...]
    `,
  },
];

export default function BlogSection() {
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  const currentPost = blogPosts.find((p) => p.id === selectedPost);

  if (currentPost) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setSelectedPost(null)}
            className="text-[#000000] hover:text-[#228B22]"
          >
            ← Back to Directory
          </button>
          <span className="text-[#606060]">
            {currentPost.filename}.{currentPost.extension}
          </span>
        </div>

        <div className="border border-[#444444] p-4">
          <div className="text-[#228B22] text-lg mb-2">{currentPost.title}</div>
          <div className="text-[#606060] text-xs mb-4">
            Last modified: {currentPost.date} | Size: {currentPost.size.toLocaleString()} bytes
          </div>
          <pre className="text-sm whitespace-pre-wrap font-mono">
            {currentPost.content.trim()}
          </pre>
        </div>

        <div className="text-[#606060] text-xs text-center">
          Press ESC to return to directory | PgUp/PgDn to scroll
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-[#000000] text-lg mb-4">
        ╔══════════════════════════════════════════════════════════╗
        <br />
        ║&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DIRECTORY OF C:\BLOG&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;║
        <br />
        ╚══════════════════════════════════════════════════════════╝
      </div>

      <div className="text-sm mb-2">
        <span className="text-black">Volume in drive C is </span>
        <span className="text-[#000000]">ALDRICH_BLOG</span>
      </div>
      <div className="text-sm mb-4">
        <span className="text-black">Directory of C:\BLOG</span>
      </div>

      <div className="border border-[#444444] p-2 font-mono text-sm overflow-x-auto">
        <table className="w-full" style={{ borderSpacing: '1rem 0.25rem', borderCollapse: 'separate' }}>
          <thead>
            <tr className="text-[#228B22]">
              <th className="text-left whitespace-nowrap">FILENAME</th>
              <th className="text-left">EXT</th>
              <th className="text-right">SIZE</th>
              <th className="text-left">DATE</th>
              <th className="text-left">DESCRIPTION</th>
            </tr>
          </thead>
          <tbody>
            {blogPosts.map((post) => (
              <tr
                key={post.id}
                onClick={() => setSelectedPost(post.id)}
                className="cursor-pointer hover:bg-[#000080] hover:text-white"
              >
                <td className="text-[#000000] whitespace-nowrap">{post.filename}</td>
                <td className="text-black">{post.extension}</td>
                <td className="text-black text-right whitespace-nowrap">
                  {post.size.toLocaleString()}
                </td>
                <td className="text-black whitespace-nowrap">{post.date}</td>
                <td className="text-[#444444]">{post.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-sm">
        <span className="text-black">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{blogPosts.length} file(s)</span>
        <span className="text-[#444444]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{blogPosts.reduce((acc, p) => acc + p.size, 0).toLocaleString()} bytes</span>
      </div>

      <div className="text-[#606060] text-xs text-center mt-4">
        Click on a file to read | Press ESC to exit
      </div>
    </div>
  );
}
