export type BadgeVariant = "live" | "warm" | "candy" | "muted";

export interface ProjectData {
  id: string;
  title: string;
  /** Short monogram shown in the card's tile (2-3 ASCII chars, no emoji). */
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
  /** Secondary repo link shown under the primary demo link (demo-first cards) */
  sourceUrl?: string;
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
  // Layout contract (see app/page.tsx): OpenHW Studio stays the org flagship,
  // then the 10-repo emulator fleet grid, then the hardware-security row.
  projects: [
    {
      id: "openhw-studio",
      title: "OpenHW Studio",
      glyph: "OH",
      tag: "Org flagship · Core Contributor · In-browser hardware simulation & compiler engine (FOSSEE, IIT Bombay)",
      description:
        "Full-stack in-browser hardware simulation platform for FOSSEE, IIT Bombay. Engineered Web Worker execution threads, WASM ESP32 networking engine, dual-layer compilation caching (<200ms latency), and auto-wiring BFS routing algorithms across 550+ commits and 480k+ lines of code.",
      chips: ["TypeScript", "Rust", "WASM", "Web Workers", "Docker", "Node.js"],
      badge: { label: "550+ Commits · Live at IIT Bombay", variant: "live" as BadgeVariant, pulse: true },
      link: { href: "/work/openhw-studio", label: "Full case study & architecture →" },
    },
    // ── Emulator fleet (10) — demo first, repo linked via sourceUrl ──
    {
      id: "stm32f4-emulator",
      title: "STM32F4 Emulator",
      glyph: "F4",
      tag: "STM32F407 Cortex-M4F + Ethernet · Rust WASM core · 268 commits · DOOM @35fps",
      description:
        "STM32F407 emulator: Rust Thumb-2 + VFPv4-SP FPU core with a Rust peripheral model (RCC, USART, GPIO, DMA, ETH, TIM, NVIC) in one WASM module. Boots real firmware headless in Node or a browser tab — DHCP + TCP + HTTP over simulated or gVisor-backed Ethernet, LwIP 2.2.1, 223 bundled binaries, DOOM 1 shareware at 35fps with save/load.",
      chips: ["Rust", "WASM", "Cortex-M4F", "Ethernet", "DOOM"],
      link: { href: "https://danish9661.github.io/STM32F4-emulator/", label: "Try Live Demo →", external: true },
      sourceUrl: "https://github.com/danish9661/STM32F4-emulator",
    },
    {
      id: "stm32f1-emulator",
      title: "STM32F1 Bluepill Emulator",
      glyph: "F1",
      tag: "STM32F103C8 Cortex-M3 · ~70M IPS headless · 39/39 firmware checks · npm stm32f1-emu",
      description:
        "Full-system STM32F1 emulator (Blue Pill, GD32F103, Maple Mini, Nucleo-F103RB) running real unmodified Arduino/STM32Cube firmware in Node or the browser. Native Rust CPU + peripherals in one WASM module with MPU enforcement, GDB + SWD/JTAG debug, 8 chip variants, 764 unit checks.",
      chips: ["Rust", "WASM", "Cortex-M3", "Arduino", "GDB"],
      link: { href: "https://danish9661.github.io/STM32F1-emulator/", label: "Try Live Demo →", external: true },
      sourceUrl: "https://github.com/danish9661/STM32F1-emulator",
    },
    {
      id: "picoemu",
      title: "Picoemu",
      glyph: "RP",
      tag: "RP2040 + RP2350 (M0+/M33/RV32) · 426/426 tests · UF2/ELF · npm picoemu",
      description:
        "From-scratch RP2040/RP2350 emulator: Cortex-M0+, Cortex-M33 and Hazard3 RV32IMAC cores with UF2/ELF auto-detect, dual-core, PIO, CYW43 Wi-Fi, W5500 Ethernet, MicroPython REPL, and a browser UI with serial monitor and GPIO viewer.",
      chips: ["C", "WASM", "RP2040", "RP2350", "RISC-V"],
      link: { href: "https://danish9661.github.io/picoemu/", label: "Try Live Demo →", external: true },
      sourceUrl: "https://github.com/danish9661/picoemu",
    },
    {
      id: "esp32-emulator",
      title: "ESP32 Emulator",
      glyph: "E32",
      tag: "Xtensa LX6 dual-core · Rust WASM engine · 53 Arduino firmwares · npm esp32emu",
      description:
        "ESP32 emulator with a Rust-compiled WASM Xtensa LX6 core and native-Rust peripherals (UART, GPIO, SPI, I2C, Wi-Fi, EMAC, SHA/AES). Boots the real boot ROM plus 53 prebuilt Arduino images with live UART and MIPS readout; MicroPython REPL works out of the box.",
      chips: ["Rust", "WASM", "Xtensa LX6", "Wi-Fi", "MicroPython"],
      link: { href: "https://danish9661.github.io/esp32-emulator/", label: "Try Live Demo →", external: true },
      sourceUrl: "https://github.com/danish9661/esp32-emulator",
    },
    {
      id: "esp32s3-emulator",
      title: "ESP32-S3 Emulator",
      glyph: "S3",
      tag: "Xtensa LX7 dual-core · 111/111 firmware proofs · browser serial + GPIO",
      description:
        "From-scratch ESP32-S3 emulator in Rust → WASM. LX7 core with windowed registers and exceptions, full SoC (UART, GPIO, timers, interrupt matrix, SPI/I2C flash, PSRAM/cache MMU), ROM stubs + partition-table boot, validated by 111 real arduino-cli firmware proofs plus Playwright browser E2E.",
      chips: ["Rust", "WASM", "Xtensa LX7", "ESP-IDF", "Arduino"],
      link: { href: "https://danish9661.github.io/esp32s3-emulator/", label: "Try Live Demo →", external: true },
      sourceUrl: "https://github.com/danish9661/esp32s3-emulator",
    },
    {
      id: "esp-rv32",
      title: "ESP RV32 Emulator",
      glyph: "RV",
      tag: "ESP32-C3/C6/H2/P4 RISC-V · one binary, runtime chip select · WASM",
      description:
        "RISC-V ESP32 emulator extending rv32emu with per-chip SoC models (memory maps, ROM hooks, SYSTIMER, UART, GPIO, SPI flash cache, PLIC/INTC/CLIC). One binary serves C3, C6, H2 and P4/P4-SMP with runtime chip selection.",
      chips: ["C", "WASM", "RISC-V", "ESP32-C3/C6/H2/P4"],
      link: { href: "https://github.com/danish9661/esp-rv32-in-C", label: "View Source Code →", external: true },
    },
    {
      id: "8086emu",
      title: "8086emu Multi-CPU",
      glyph: "86",
      tag: "8086/8088/8085/8051/6502/Z80/RV32 · one Rust crate → one WASM module · npm",
      description:
        "Single Rust crate emulating six classic CPUs — 8086/8088 (8259 PIC + 8253 PIT, timer IRQs end-to-end), 8085, 8051, 6502, Z80 and RV32IM — each with a matching assembler, compiling to one WASM module plus a dependency-free web IDE for students.",
      chips: ["Rust", "WASM", "x86", "6502", "Z80"],
      link: { href: "https://danish9661.github.io/8086emu/", label: "Try Live Demo →", external: true },
      sourceUrl: "https://github.com/danish9661/8086emu",
    },
    {
      id: "microbit-emulator",
      title: "micro:bit Emulator",
      glyph: "uB",
      tag: "nRF52833 Cortex-M4 · 220/220 proofs · BLE + 802.15.4 · browser demo",
      description:
        "micro:bit v2.2 (nRF52833) emulator: all 39 SVD peripherals cross-checked against the models, 220 passing proofs (crypto, QSPI, SPIM, UARTE, RTC, BLE pairing legs), firmware-proven drivers, and a live browser demo.",
      chips: ["Rust", "WASM", "Cortex-M4", "nRF52", "BLE"],
      link: { href: "https://danish9661.github.io/microbit-emulator/", label: "Try Live Demo →", external: true },
      sourceUrl: "https://github.com/danish9661/microbit-emulator",
    },
    {
      id: "uno-r4-emulator",
      title: "UNO R4 Emulator",
      glyph: "R4",
      tag: "RA4M1 Cortex-M33 · 127 + 90 proofs · browser demo",
      description:
        "Arduino UNO R4 (Renesas RA4M1, Cortex-M33) emulator with a 127-proof peripheral suite plus 90 R4 board proofs, browser demo, and a hardware-exact bus model shared with the STM32F4 CPU lineage.",
      chips: ["Rust", "WASM", "Cortex-M33", "Arduino", "Renesas"],
      link: { href: "https://danish9661.github.io/uno-r4-emulator/", label: "Try Live Demo →", external: true },
      sourceUrl: "https://github.com/danish9661/uno-r4-emulator",
    },
    {
      id: "wasm-game",
      title: "Starfall (WASM Game)",
      glyph: "SF",
      tag: "Rust WebGPU isometric RPG · client sim + authoritative co-op server",
      description:
        "2.5D isometric survival RPG in pure Rust (wasm-pack + wgpu): procedural chunks, day/night, gathering, crafting, combat with an enraging boss, quests, gamepad + touch, IndexedDB saves. Same simulation runs client-side solo or on an authoritative co-op server with room codes.",
      chips: ["Rust", "WASM", "WebGPU", "Multiplayer", "Game"],
      link: { href: "https://danish9661.github.io/wasm-game/", label: "Try Live Demo →", external: true },
      sourceUrl: "https://github.com/danish9661/wasm-game",
    },
    // ── Hardware security (separate row, not an emulator) ──
    {
      id: "es32s3-hid",
      title: "ESP32-S3 HID Console & KVM",
      glyph: "SK",
      tag: "FIDO2 + YubiKey emulation · encrypted vault · HID injection & KVM bridge",
      description:
        "Professional USB HID injection engine and ultra-low-latency KVM bridge on the ESP32-S3 N16R8: Ducky HID + mass storage, FIDO2 passkeys, YubiKey 5 emulation (ykman/OATH-TOTP/OTP), action recorder, web OTA, and a cross-platform KVM client.",
      chips: ["C++", "ESP-IDF", "FIDO2", "USB HID", "KVM"],
      link: { href: "https://danish9661.github.io/es32s3-hid", label: "Try Live Console →", external: true },
      sourceUrl: "https://github.com/danish9661/es32s3-hid",
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
      "Permission denied: Root override protected. DanishOS kernel prevented filesystem destruction.",

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
