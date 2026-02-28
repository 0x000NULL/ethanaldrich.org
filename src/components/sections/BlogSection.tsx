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
    id: "yacht-av-network",
    filename: "YACHT-INSTALL",
    extension: "TXT",
    size: 47500,
    date: "02-28-2026",
    title: "Luxury Yacht Network & AV Installation: UniFi, Control4, and Dual Starlink",
    description: "Complete networking and AV integration on Ocean Alexander 32E and Princess Y72",
    content: `
LUXURY YACHT NETWORK & AV INSTALLATION
=======================================
UniFi, Control4, and Dual Starlink Integration

Author: Ethan Aldrich
Date: February 2026
Project Type: Professional Installation
Status: Complete

TABLE OF CONTENTS
-----------------
1. Introduction & Project Overview
2. The Vessels
3. Dual-Starlink Configuration Strategy
4. UniFi Network Infrastructure
5. VLAN Architecture & Network Segmentation
6. Control4 AV System Integration
7. Marine Environment Challenges
8. Cable Routing & Infrastructure
9. Control4 + UniFi Integration Details
10. Lessons Learned & Recommendations
11. Conclusion

============================================================
1. INTRODUCTION & PROJECT OVERVIEW
============================================================

This article documents a professional installation project involving
two luxury yachts: an Ocean Alexander 32E and a Princess Y72. The
scope included complete networking infrastructure, audio-visual
systems, and satellite connectivity for both vessels.

PROJECT SCOPE
-------------
- Ocean Alexander 32E: Retrofit from factory-installed systems
- Princess Y72: New installation on delivery

Both vessels required:
- Enterprise-grade networking with UniFi equipment
- Full Control4 AV integration (audio, video, lighting, shades)
- Dual Starlink satellite connectivity per vessel
- Marine-rated equipment and proper weatherproofing
- Network segmentation for crew, guests, and IoT devices

The unique challenge of this project was implementing a dual-Starlink
strategy per yacht that optimizes both cost and coverage across
different operating scenarios - US coastal cruising versus
international or open-ocean voyaging.

============================================================
2. THE VESSELS
============================================================

OCEAN ALEXANDER 32E
-------------------
The Ocean Alexander 32E is a luxury explorer yacht stretching
approximately 100 feet in length. Known for its robust construction
and long-range cruising capabilities, the 32E presented unique
retrofit challenges:

- Factory-installed networking was consumer-grade and inadequate
- Existing cable runs needed to be traced and evaluated
- Some equipment locations required relocation for optimal coverage
- Integration with existing onboard systems (NMEA 2000, etc.)

The explorer yacht design, with multiple decks and heavy steel
construction, created interesting RF propagation challenges that
required careful access point placement.

PRINCESS Y72
------------
The Princess Y72 is a 72-foot motor yacht from the renowned British
manufacturer. As a new installation, we had the advantage of planning
cable runs and equipment locations from the start:

- Clean slate for network infrastructure design
- Coordination with shipyard during commissioning
- Optimal equipment placement without retrofit constraints
- Integration planning during the build process

Both vessels, despite their size difference, required similar
solutions and equipment configurations. The installation approach
was standardized to maintain consistency and simplify future
maintenance and support.

============================================================
3. DUAL-STARLINK CONFIGURATION STRATEGY
============================================================

One of the most innovative aspects of this installation was the
dual-Starlink per vessel strategy. Each yacht has TWO Starlink
terminals with different service plans optimized for different
operating scenarios.

TERMINAL 1: STANDARD STARLINK WITH ROAM PLAN
--------------------------------------------
The first terminal uses a standard residential Starlink dish with
the Roam plan activated:

Purpose:
- US coastal and inland waterway cruising
- Stateside marina stays
- Primary internet when within US coverage

Advantages:
- Significantly lower monthly cost than maritime plans
- Unlimited data with Roam plan
- Excellent performance in US waters
- Portable between locations

The Roam plan allows the dish to be used anywhere within the US
service area, making it perfect for coastal cruising from Florida
to New England or Pacific Coast routes.

TERMINAL 2: MARITIME STARLINK WITH GLOBAL PRIORITY
--------------------------------------------------
The second terminal uses a proper maritime-rated Starlink dish
with Global Priority service:

Purpose:
- International waters and ocean crossings
- Outside US coverage areas (Caribbean, Mediterranean, etc.)
- Backup connectivity when primary fails
- Priority data allocation

Advantages:
- True global coverage including open ocean
- Maritime-rated hardware for harsh conditions
- Priority network access for consistent speeds
- In-motion capability at higher speeds

FAILOVER CONFIGURATION
----------------------
The UniFi Dream Machine Pro manages both Starlink connections using
multi-WAN load balancing:

Primary WAN: Standard Starlink (when in US waters)
Secondary WAN: Maritime Starlink (failover or primary internationally)

The failover logic is configured to:
1. Prefer the lower-cost Roam terminal when viable
2. Automatically switch to Maritime when Roam loses connectivity
3. Load balance across both for maximum throughput when appropriate
4. Allow manual override via UniFi dashboard for specific scenarios

COST OPTIMIZATION
-----------------
This dual-terminal approach saves significant money compared to
running Maritime Global Priority full-time:

- Maritime Priority: High monthly cost, always-on global coverage
- Roam Plan: Fraction of the cost for US coverage
- Result: Maritime costs only apply when actually needed

For vessels that spend 80% of their time in US waters with
occasional international trips, this strategy can reduce annual
connectivity costs substantially.

MOUNTING CONSIDERATIONS
-----------------------
Installing two Starlink dishes per vessel required careful planning:

Location Selection:
- Clear view of northern sky (for LEO satellite visibility)
- Minimal obstruction from masts, antennas, and radar equipment
- Adequate separation between dishes to prevent interference
- Protected from direct wave impact and salt spray

Mounting Hardware:
- Marine-grade stainless steel mounting brackets
- Vibration dampening to prevent dish movement
- Secure cable routing through weatherproof penetrations
- Accessible for maintenance without scaffold/lift

Both dishes are mounted on the upper deck/flybridge area with
custom fabricated brackets designed for each vessel's specific
superstructure geometry.

============================================================
4. UNIFI NETWORK INFRASTRUCTURE
============================================================

The network backbone for both vessels is built on Ubiquiti's UniFi
ecosystem, chosen for its enterprise features, central management,
and excellent value proposition.

DREAM MACHINE PRO (UDM-PRO)
---------------------------
The UDM-Pro serves as the network core:

- Router/firewall with IDS/IPS capability
- UniFi Network application for device management
- Multi-WAN support for dual Starlink configuration
- 10Gbps SFP+ ports for future expansion
- Built-in 8-port gigabit switch

The UDM-Pro is installed in a climate-controlled equipment room
with proper ventilation. Marine environments are harsh on
electronics, so maintaining appropriate temperature and humidity
is critical.

REDUNDANT POWER SUPPLY (RPS)
----------------------------
Network uptime is critical on a vessel where connectivity may be
the only link to emergency services or weather updates. The UniFi
RPS provides:

- Automatic failover if primary power fails
- Battery backup for graceful shutdown
- Notification alerts for power issues
- Peace of mind during generator switchovers

The RPS is particularly important during anchor or marina stays
where shore power connections can be unstable.

ACCESS POINTS
-------------
WiFi coverage throughout both vessels is provided by UniFi U6/U7
series access points:

Interior APs:
- Salon/main living areas
- Staterooms
- Galley and crew quarters
- Engine room (yes, even there)

Exterior APs:
- Flybridge
- Aft deck
- Bow area

Placement was determined through site surveys considering:
- Steel bulkheads that block RF signals
- High-traffic areas requiring capacity
- Guest vs crew coverage separation
- Outdoor areas where guests congregate

Each vessel has 6-8 access points depending on layout, all
powered via PoE from the central switches.

POE SWITCHES
------------
UniFi PoE switches distribute power and data throughout the vessel:

- 24-port and 16-port models depending on location
- PoE+ for higher-power devices
- Managed switching with VLAN support
- SFP uplinks for backbone connections

Switches are installed in distribution points throughout each
deck, minimizing cable run lengths while maintaining proper
network topology.

============================================================
5. VLAN ARCHITECTURE & NETWORK SEGMENTATION
============================================================

Proper network segmentation is critical for both security and
performance. The VLAN architecture separates traffic into distinct
broadcast domains:

VLAN 1 - MANAGEMENT (Native)
----------------------------
- UniFi devices
- Network infrastructure
- Administrative access only
- Isolated from all guest traffic

VLAN 10 - CREW
--------------
- Crew personal devices
- Crew workstations
- Internal communications
- Access to onboard systems
- Internet access

VLAN 20 - GUEST
---------------
- Guest personal devices
- Captive portal capability
- Internet access only
- No access to internal systems
- Bandwidth limits applied

VLAN 30 - IOT/CONTROL4
----------------------
- Control4 controllers and devices
- Audio/video equipment
- Lighting controls
- HVAC integration
- Shade controls
- Isolated from direct internet access

VLAN 40 - SECURITY
------------------
- UniFi Protect cameras (if installed)
- Access control systems
- Security sensors
- NVR access from VLAN 1 only

INTER-VLAN ROUTING
------------------
Firewall rules control traffic between VLANs:

- Management can access all VLANs
- Crew can access IoT for control purposes
- Guest has no inter-VLAN access
- IoT devices cannot initiate outbound internet

This segmentation ensures that:
1. Guest devices cannot access AV systems directly
2. IoT devices are isolated from the internet
3. Compromised devices cannot traverse networks
4. Management access is properly secured

============================================================
6. CONTROL4 AV SYSTEM INTEGRATION
============================================================

Both vessels feature comprehensive Control4 smart yacht systems
covering audio, video, lighting, and environmental controls.

EA SERIES CONTROLLERS
---------------------
Each vessel has EA-series controllers managing the automation:

- EA-5 as primary controller (larger vessel)
- EA-3 as secondary/zone controllers
- Redundancy for critical functions
- Local processing when internet unavailable

The EA controllers communicate with all endpoints via the
dedicated IoT VLAN, ensuring reliable performance without
interference from guest traffic.

MULTI-ZONE AUDIO
----------------
Audio distribution throughout each vessel includes:

Zones:
- Salon
- Master stateroom
- Guest staterooms (individual zones)
- Galley
- Flybridge
- Aft deck
- Crew quarters

Equipment:
- Control4 audio matrix for distribution
- Triad marine-rated speakers in exterior zones
- High-quality interior speakers in living spaces
- Subwoofers in primary entertainment areas

Sources:
- Streaming services (Spotify, Apple Music, etc.)
- Local media server
- Satellite radio
- TV audio routing

Each zone can play independent sources or be grouped for
whole-vessel audio. Volume limiting is applied to exterior
zones for marina courtesy.

VIDEO DISTRIBUTION
------------------
Video throughout both vessels is distributed via:

- HDBaseT matrix for primary distribution
- 4K capable throughout
- Multiple source inputs (streaming boxes, cable, local media)
- Displays in every cabin and social area
- Exterior-rated TV on flybridge

Sources:
- Apple TV 4K units
- Satellite TV receivers
- Local Plex server
- Security camera feeds

LIGHTING CONTROL
----------------
Integrated lighting control includes:

- Scene-based control (movie mode, entertaining, etc.)
- Dimming capability throughout
- Integration with time-of-day automation
- Pathway lighting for safety
- Exterior accent lighting

SHADE CONTROL
-------------
Motorized shades and blinds are integrated:

- Automated based on sun position
- Scene integration (close for movie mode)
- Individual or group control
- Manual override available

CONTROL INTERFACES
------------------
Guests and crew interact with Control4 via:

- In-wall touch panels at key locations
- Control4 app on personal devices
- Voice control (when connectivity available)
- Physical keypads for common functions

============================================================
7. MARINE ENVIRONMENT CHALLENGES
============================================================

Installing technology on vessels presents unique challenges that
land-based installations never encounter.

CORROSION RESISTANCE
--------------------
Salt air is incredibly corrosive to electronics:

Equipment Selection:
- Marine-rated products where available
- Conformal coating on exposed circuit boards
- Stainless steel hardware only
- Proper drainage for any water intrusion

Installation Practices:
- Sealed cable penetrations
- Drip loops on all cable runs
- Gore-Tex vent plugs for pressure equalization
- Regular inspection and maintenance schedule

MARINE-RATED ENCLOSURES
-----------------------
Not all networking equipment comes in marine versions:

Solutions:
- NEMA 4X enclosures for distribution points
- Climate-controlled equipment rooms
- Desiccant packs in sealed enclosures
- Positive pressure ventilation where possible

The UDM-Pro and core switches reside in climate-controlled
spaces, but distribution equipment throughout the vessel
requires proper protection.

WATERPROOFING
-------------
Even interior spaces can experience moisture:

Strategies:
- IP-rated equipment where exposed
- Sealed cable glands at all penetrations
- Sloped mounting to prevent pooling
- Inspection ports for periodic checks

Exterior installations (access points, speakers, cameras)
require careful attention to mounting orientation and
drainage.

VIBRATION AND MOVEMENT
----------------------
Vessels move constantly, creating stress on:

- Cable connections (use strain relief everywhere)
- Equipment mounting (secure but vibration-dampened)
- Antenna alignment (gimbal mounts for Starlink)
- Rack-mounted equipment (proper rail systems)

All equipment is mounted with appropriate vibration dampening,
and cable runs include service loops to accommodate movement.

POWER QUALITY
-------------
Marine electrical systems can be challenging:

Issues:
- Voltage fluctuations during generator switchover
- Inverter-generated power (modified vs pure sine wave)
- Shore power variations across marinas
- Lightning and surge risks

Solutions:
- UPS/battery backup for critical equipment
- Surge protection at key distribution points
- Power conditioning where necessary
- Proper grounding (challenging on a vessel!)

============================================================
8. CABLE ROUTING & INFRASTRUCTURE
============================================================

Running cables through a yacht is vastly different from
a building installation.

EXISTING PATHWAYS
-----------------
On the retrofit (OA 32E), we worked with existing pathways:

- Traced factory-installed conduit runs
- Identified accessible cable chases
- Worked with naval architect drawings
- Minimized new penetrations

On the new installation (Princess Y72), pathways were
planned during commissioning with shipyard coordination.

CABLE TYPES
-----------
Different cable types for different purposes:

Data:
- Cat6A shielded for backbone runs
- Cat6 for shorter runs to endpoints
- Fiber for longest runs (noise immunity)

Audio/Video:
- HDBaseT cabling to displays
- Speaker wire (marine-rated jacket)
- Control wiring to keypads

Power:
- Properly sized for PoE loads
- Marine-rated jacket material
- Separate from data where possible

PENETRATIONS
------------
Every penetration through a bulkhead is a potential leak point:

Best Practices:
- Minimize penetrations
- Use proper marine-grade cable glands
- Seal with appropriate marine sealant
- Document all penetrations for future reference
- Test for water intrusion after installation

LABELING AND DOCUMENTATION
--------------------------
Marine installations require excellent documentation:

- Every cable labeled at both ends
- Cable schedule with run lengths and purposes
- Network diagram posted in equipment room
- As-built drawings for future reference

Future technicians (or yourself) will thank you when
troubleshooting is needed.

============================================================
9. CONTROL4 + UNIFI INTEGRATION DETAILS
============================================================

Getting Control4 and UniFi to work together seamlessly required
attention to several technical details.

MDNS/BONJOUR
------------
Control4 devices rely heavily on mDNS for discovery:

Configuration:
- Enable mDNS reflector on UDM-Pro
- Configure mDNS to cross VLAN boundaries (selectively)
- Allow Control4 app discovery from guest VLAN
- Block unnecessary mDNS traffic

Without proper mDNS configuration, Control4 apps on guest
devices cannot discover the controllers.

IGMP SNOOPING
-------------
Multicast traffic is important for:

- Audio streaming between zones
- Video distribution
- Control4 device communication

IGMP Configuration:
- Enable IGMP snooping on all VLANs
- Configure IGMP querier on UDM-Pro
- Set appropriate group membership timeouts
- Test multicast routing between VLANs

STATIC IP ASSIGNMENTS
---------------------
All Control4 devices receive static IPs via DHCP reservation:

- Controllers
- Touch panels
- Audio endpoints
- Network-connected sources

This ensures consistent addressing and simplifies firewall
rules and troubleshooting.

FIREWALL RULES
--------------
Specific rules allow Control4 traffic while maintaining security:

Allow:
- Control4 app access from guest VLAN to IoT VLAN
- Controller communication between VLANs
- Remote access via Control4 cloud (outbound only)

Block:
- Direct IoT device internet access
- Inter-device communication across VLANs (unless required)
- Guest access to admin interfaces

QOS CONFIGURATION
-----------------
Quality of Service ensures AV traffic receives priority:

- Audio streams: High priority
- Video streams: High priority
- Control traffic: Medium priority
- General data: Best effort

This prevents guest downloads from impacting AV performance.

============================================================
10. LESSONS LEARNED & RECOMMENDATIONS
============================================================

STARLINK MOUNTING
-----------------
Lesson: Initial mounting locations looked good but had partial
sky obstructions from radar and antenna masts.

Recommendation:
- Use Starlink app's obstruction checker before finalizing
- Test at different vessel orientations (swing at anchor)
- Plan for multiple Starlinks with adequate separation
- Consider dedicated mounting platform for clean sightlines

NETWORK VLAN SETUP
------------------
Lesson: Initial guest network was too restrictive, preventing
some smart devices (phones controlling AV) from functioning.

Recommendation:
- Test all use cases before finalizing firewall rules
- Allow specific paths for control apps
- Document all inter-VLAN rules with justification
- Plan for guest devices that need IoT access

CONTROL4 + UNIFI
----------------
Lesson: Default UniFi settings blocked mDNS between VLANs,
breaking Control4 app discovery completely.

Recommendation:
- Test Control4 app from all VLANs before commissioning
- Configure mDNS reflector early in setup
- Document required multicast traffic
- Have Control4 programmer test from guest network

MARINE-RATED GEAR
-----------------
Lesson: Some "marine-rated" equipment still failed due to
inadequate corrosion protection in tropical conditions.

Recommendation:
- Research actual marine installations, not just ratings
- Apply additional protection (conformal coating)
- Plan for equipment replacement cycles
- Maintain spare parts inventory

CABLE ROUTING
-------------
Lesson: What looks accessible with panels open may be
impossible to reach once the vessel is operational.

Recommendation:
- Document EVERYTHING during open-panel access
- Install pull strings for future cables
- Take photos of every cable pathway
- Test all drops before closing up

GENERAL RECOMMENDATIONS
-----------------------
For anyone planning similar installations:

1. Site Survey First
   - Visit the vessel multiple times
   - Test WiFi coverage with temporary APs
   - Map all existing cable runs
   - Identify equipment location constraints

2. Plan for Maintenance
   - All equipment should be accessible
   - Leave service loops in cable runs
   - Document extensively
   - Train crew on basic troubleshooting

3. Test Everything
   - Before closing any panels
   - In multiple operational scenarios
   - With actual guest devices
   - During sea trials if possible

4. Build Relationships
   - With the vessel crew
   - With the captain
   - With the owner's representative
   - For ongoing support needs

============================================================
11. CONCLUSION
============================================================

This dual-yacht installation project showcased the complexity
and rewards of marine technology integration. The combination
of UniFi networking, Control4 automation, and innovative
dual-Starlink connectivity creates a truly modern vessel
experience while respecting the unique challenges of the
marine environment.

KEY ACHIEVEMENTS
----------------
- Reliable, enterprise-grade networking at sea
- Seamless AV control throughout both vessels
- Cost-optimized satellite connectivity strategy
- Proper network segmentation for security
- Marine-appropriate installation practices

Both the Ocean Alexander 32E and Princess Y72 now provide
their owners and guests with connectivity and entertainment
options that rival or exceed shore-based installations,
all while cruising anywhere in the world.

The dual-Starlink strategy in particular has proven highly
effective - owners enjoy low-cost unlimited connectivity
during US coastal cruising, with automatic failover to
global coverage when venturing further afield.

FUTURE CONSIDERATIONS
---------------------
- Starlink Gen 3 hardware upgrades when available
- Additional UniFi Protect camera integration
- Enhanced voice control with local processing
- Integration with vessel navigation systems

For professionals considering similar projects, the key is
thorough planning, quality equipment, and attention to the
unique demands of the marine environment. The sea is
unforgiving to shortcuts and poor workmanship.

Happy cruising!

- Ethan

============================================================
END OF FILE
============================================================
    `,
  },
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
