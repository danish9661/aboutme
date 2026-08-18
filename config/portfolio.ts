export type BadgeVariant = "live" | "warm" | "candy" | "muted";

export interface ProjectData {
  id: string;
  title: string;
  /** Emoji glyph shown in the card's gradient icon. */
  glyph: string;
  /** Short one-liner shown in the terminal `ls` listing. */
  tag: string;
  description: string;
  chips: string[];
  badge?: { label: string; variant: BadgeVariant; pulse?: boolean };
  /** Extra accent-washed callout box */
  callout?: string;
  /** Plain muted "why it matters" supporting paragraph */
  why?: string;
  link?: { href: string; label: string; external?: boolean };
  featured?: boolean;
}

export interface CustomTerminalCommand {
  command: string;
  description?: string;
  output: string;
  kind?: "out" | "sys" | "err";
}

/**
 * Central Portfolio & Developer Configuration
 * Edit this single file to personalize the entire portfolio, projects,
 * terminal commands, metadata, contact links, and Neofetch ASCII art.
 */
export const PORTFOLIO_CONFIG = {
  // Personal & Brand Information
  name: "Md. Danish",
  shortName: "Danish.",
  role: "Systems & Software Engineer",
  email: "9661346164h@gmail.com",
  resumePdfPath: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/resume/Md-Danish-Resume.pdf`,

  // Socials & Package Registry Links
  githubUsername: "danish9661",
  socials: {
    github: "https://github.com/danish9661",
    linkedin: "https://www.linkedin.com/in/md-danish966",
    npm: "https://www.npmjs.com/~danish9661",
  },

  // Featured Engineering Projects (rendered on homepage cards and terminal ls/open)
  projects: [
    {
      id: "openhw-studio",
      title: "OpenHW Studio",
      glyph: "⚡",
      tag: "Core Contributor · Full-stack in-browser hardware simulation & compiler engine",
      description:
        "Full-stack in-browser hardware simulation platform for FOSSEE, IIT Bombay. Engineered Web Worker execution threads, WASM ESP32 networking engine, dual-layer compilation caching (<200ms latency), and auto-wiring BFS routing algorithms across 550+ commits and 480k+ lines of code.",
      chips: ["TypeScript", "Rust", "WASM", "Web Workers", "Docker", "Node.js"],
      badge: { label: "550+ Commits · Live at IIT Bombay", variant: "live" as BadgeVariant, pulse: true },
      link: { href: "/work/openhw-studio", label: "Full case study & architecture →" },
    },
    {
      id: "stm32-bluepill-emu",
      title: "STM32 Bluepill Emulator",
      glyph: "🕹️",
      tag: "STM32F103 emulator running real Arduino firmware in the browser",
      description:
        "In-browser Cortex-M3 emulator written in Rust and compiled to WebAssembly via Unicorn engine. Capable of executing raw compiled Arduino binaries and simulating hardware registers at 60fps.",
      why: "Hardware debugging on physical microcontrollers can be slow and brittle. I built this in-browser emulator so developers and students can test STM32 firmware instantly with zero driver installation, complete with cycle-accurate peripheral telemetry.",
      chips: ["Rust", "WASM", "Unicorn", "Cortex-M3", "STM32F103"],
      badge: { label: "Live Demo", variant: "live" as BadgeVariant, pulse: true },
      link: { href: "https://danish9661.github.io/STM32-Bluepill-emu/", label: "Try Emulator Demo →", external: true },
    },
    {
      id: "es32s3-hid",
      title: "ESP32-S3 Hardware Security Suite",
      glyph: "🔒",
      tag: "FIDO2 authenticator, TOTP generator, password manager & Rubber Ducky",
      description:
        "All-in-one hardware security dongle built on the ESP32-S3 with native USB HID emulation, FIDO2/WebAuthn authentication, hardware-encrypted TOTP keys, and programmable keystroke injection.",
      why: "Commercial security keys are closed-source black boxes. This project brings transparency to physical hardware authentication by implementing open-standard FIDO2 protocols, secure enclave key storage, and dual-mode USB/BLE interfaces.",
      chips: ["C++", "ESP-IDF", "FIDO2", "USB HID", "Hardware Crypto"],
      badge: { label: "Hardware Security", variant: "warm" as BadgeVariant },
      link: { href: "https://github.com/danish9661/es32s3-hid", label: "View Source Code →", external: true },
    },
    {
      id: "stm32f4-emulator",
      title: "STM32F4 Simulator & WASM Engine",
      glyph: "⚙️",
      tag: "ARM Cortex-M4 simulator with WebAssembly execution engine",
      description:
        "Emulates STM32F4 hardware architectures in WebAssembly, providing cycle budgeting, memory mapping, interrupt vectors, and peripheral communication over virtual bus protocols.",
      why: "Emulating complex 32-bit ARM cores in browser sandboxes requires strict memory isolation and optimized instruction dispatch loops. This project demonstrates high-performance WASM instruction execution for embedded education.",
      chips: ["C", "WebAssembly", "Unicorn", "ARM Cortex-M4"],
      badge: { label: "Open Source", variant: "muted" as BadgeVariant },
      link: { href: "https://danish9661.github.io/stm32F4-emulator/", label: "Explore Project →", external: true },
    },
  ] as ProjectData[],

  // Terminal & Laptop Showcase Settings
  terminal: {
    sectionEyebrow: "Interactive Console",
    sectionTitle: "Browse my work the coder's way.",
    sectionDescription:
      "A developer CLI terminal — run ls, neofetch, stats, or danish. Supports Tab completion and Up/Down history.",
    prompt: "danish@portfolio projects %",
    osName: "DanishOS",
    osVersion: "DanishOS v2.4 (x86_64-wasm)",
    uname: "Linux DanishOS 6.8.0-wasm-rv32 #42-SMP PREEMPT_DYNAMIC x86_64/arm64 GNU/Linux",
    uptime: "up 554 days, 236 PRs merged, load average: 0.08, 0.04, 0.01 (WASM Core: Active)",
    whoami:
      "Md. Danish · Systems & Software Engineer · Core Contributor @ OpenHW Studio (FOSSEE, IIT Bombay) · Emulators, WebAssembly, Firmware & Low-Level Toolchains.",
    sudoGrantedText:
      "[sudo] password for danish: ********** → Authentication successful. User has full engineer privileges.",
    sudoDeniedText:
      "🚨 Permission denied: Root override protected. DanishOS kernel prevented filesystem destruction.",

    // Custom terminal commands anyone can define
    customCommands: [
      {
        command: "skills",
        description: "List core engineering skillset",
        output: "• Languages: C, C++20, Rust, TypeScript, Python, ARM/RISC-V ASM\n• Systems: WebAssembly, Web Workers, SharedArrayBuffer, Docker\n• Hardware: STM32 (Cortex-M3/M4), ESP32-S3, RP2040, USB HID/FIDO2\n• Protocols: UART, SPI, I2C, BLE, LwIP Ethernet",
      },
      {
        command: "experience",
        description: "Show work history",
        output: "Core Contributor @ OpenHW Studio (FOSSEE, IIT Bombay)\n550+ Commits · 236 Merged PRs · 480k+ Lines of Code\nEngineered in-browser emulator runners, dual compilation cache (<200ms), and WASM ESP32 networking.",
      },
    ] as CustomTerminalCommand[],
    
    // Custom ASCII Face Art for `danish` command
    danishFaceArt: `
     .--------.
    /  .-.  .-. \\
   |  ( O )( O ) |     "Hello, I'm Danish!"
   |     ___     |  Systems & Software Engineer
   \\   '-----'   /   Core @ OpenHW Studio (IIT Bombay)
    '-..______.-'
`,

    // Stylized ASCII Banner for `whoami` command
    whoamiBanner: `
██████╗  █████╗ ███╗   ██╗██╗███████╗██╗  ██╗
██╔══██╗██╔══██╗████╗  ██║██║██╔════╝██║  ██║
██║  ██║███████║██╔██╗ ██║██║███████╗███████║
██║  ██║██╔══██║██║╚██╗██║██║╚════██║██╔══██║
██████╔╝██║  ██║██║ ╚████║██║███████║██║  ██║
╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝╚══════╝╚═╝  ╚═╝
`,

    // Neofetch Hardware / System Profile
    neofetch: {
      asciiArt: `   _____ 
  /     \\
 | () () |  DANISH
  \\  _  /   SYSTEMS
   |||||
   |||||
  [=====]`,
      os: "DanishOS v2.4 (x86_64 / RV32 WASM)",
      host: "OpenHW Studio & Unicorn Simulator",
      kernel: "WebAssembly JIT Core",
      commits: "550+ @ OpenHW Studio (FOSSEE, IIT Bombay)",
      languages: "C, C++, Rust, TypeScript, Python, ASM",
      hardware: "STM32, ESP32-S3, RP2040, FIDO2/HID",
    },
  },
} as const;

export type PortfolioConfig = typeof PORTFOLIO_CONFIG;
