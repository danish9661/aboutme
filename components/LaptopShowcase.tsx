"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "next-view-transitions";
import { PROJECTS, PROJECTS_BY_ID } from "@/lib/projects";
import { useGitHubDirectStats } from "@/lib/githubDirectStats";
import { PORTFOLIO_CONFIG } from "@/config/portfolio";
import Badge from "./Badge";
import Chip from "./Chip";
import Divider from "./Divider";
import DoomPlayer from "./doom/DoomPlayer";

type View = "home" | "cli" | "project" | "doom";
type LineKind = "cmd" | "out" | "sys" | "err" | "list" | "neofetch" | "stats" | "emu" | "matrix" | "danish" | "whoami" | "snake" | "doom";
type TerminalTheme = "default" | "cyberpunk" | "matrix" | "nord";
type TerminalFont = "mono" | "pixel" | "hacker" | "sans";

interface Line {
  kind: LineKind;
  text?: string;
  payload?: any;
}

const PROMPT = PORTFOLIO_CONFIG.terminal.prompt;

const BASE_COMMANDS = [
  "ls",
  "ls -la",
  "danish",
  "doom",
  "snake",
  "neofetch",
  "fastfetch",
  "stats",
  "email",
  "mail",
  "echo",
  "socials",
  "skills",
  "skills lang",
  "skills hw",
  "skills wasm",
  "visit gh",
  "visit github",
  "visit linkedin",
  "visit npm",
  "github",
  "linkedin",
  "npm",
  "uptime",
  "uname -a",
  "uname",
  "matrix",
  "sudo",
  "sudo rm -rf /",
  "theme default",
  "theme cyberpunk",
  "theme matrix",
  "theme nord",
  "theme list",
  "theme random",
  "font mono",
  "font pixel",
  "font hacker",
  "font sans",
  "font list",
  "history",
  "history clear",
  "help theme",
  "help font",
  "help open",
  "help skills",
  "help snake",
  "date",
  "resume",
  "cat resume",
  "whoami",
  "emu",
  "about",
  "stack",
  "contact",
  "clear",
  "help",
  "exit",
];

const AUTOCOMPLETE_LIST = [
  ...BASE_COMMANDS,
  ...PROJECTS.map((p) => `open ${p.id}`),
  ...(PORTFOLIO_CONFIG.terminal.customCommands || []).map((c) => c.command),
];

const SUGGESTIONS = [
  { cmd: "ls", label: "ls" },
  { cmd: "snake", label: "🐍 snake" },
  { cmd: "doom", label: "🎮 doom" },
  { cmd: "danish", label: "danish" },
  { cmd: "email", label: "email" },
  { cmd: PROJECTS[0] ? `open ${PROJECTS[0].id}` : "ls", label: PROJECTS[0] ? `open ${PROJECTS[0].id}` : "ls" },
  { cmd: "neofetch", label: "neofetch" },
  { cmd: "stats", label: "stats" },
  { cmd: "matrix", label: "matrix" },
  { cmd: "theme cyberpunk", label: "theme" },
];

/**
 * High-performance, JIT-optimized interactive terminal showcase for Md. Danish.
 * Features: Direct GitHub API fetching, Tab autocompletion, Up/Down history navigation, Neofetch,
 * OpenHW Studio stats, firmware emu ticker, and zero-allocation execution loops.
 */
export default function LaptopShowcase() {
  const reduce = useReducedMotion();
  const gitHubStats = useGitHubDirectStats(PORTFOLIO_CONFIG.githubUsername);

  const [view, setView] = useState<View>("home");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [history, setHistory] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [minimized, setMinimized] = useState(false);
  const [terminalTheme, setTerminalTheme] = useState<TerminalTheme>("default");
  const [terminalFont, setTerminalFont] = useState<TerminalFont>("mono");
  const [doomPreload, setDoomPreload] = useState(false);
  const [doomReady, setDoomReady] = useState(false);
  const [showDoomHelp, setShowDoomHelp] = useState(false);

  // Automatically switch view to DOOM only when both logs have finished and WASM graphics are 100% ready
  useEffect(() => {
    if (doomPreload && doomReady) {
      setView("doom");
    }
  }, [doomPreload, doomReady]);

  // Command history buffer for Up / Down arrow navigation
  const cmdHistoryRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const sessionStartTimeRef = useRef<number>(Date.now());

  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [history, view]);

  useEffect(() => {
    if (view === "cli") {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [view]);

  const openProject = useCallback((id: string) => {
    setActiveId(id);
    setView("project");
    setMinimized(false);
  }, []);

  const closeWindow = useCallback(() => {
    setMinimized(false);
    setDoomPreload(false);
    setShowDoomHelp(false);
    setView("home");
  }, []);

  const minimizeWindow = useCallback(() => setMinimized(true), []);
  const restoreWindow = useCallback(() => setMinimized(false), []);

  const goto = useCallback(
    (id: string) => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    },
    [reduce]
  );

  const run = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;

      // Push to command history buffer
      cmdHistoryRef.current.push(trimmed);
      historyIndexRef.current = -1;

      const cmd = trimmed.toLowerCase();
      const [head, ...rest] = cmd.split(/\s+/);
      const arg = rest.join(" ");
      const next: Line[] = [{ kind: "cmd", text: raw }];

      if (cmd === "clear") {
        setHistory([]);
        setInput("");
        return;
      }

      if (cmd === "home" || cmd === "exit") {
        setView("home");
        setInput("");
        return;
      }

      if (head === "ls" || cmd === "ll" || cmd === "dir") {
        next.push({ kind: "list" });
      } else if (head === "open" || head === "cat" || head === "know") {
        const isLive = rest[0] === "--live" || rest[0] === "-l";
        const targetId = isLive ? rest[1] : arg;

        if (targetId === "resume" || targetId === "md-danish-resume.pdf" || targetId === "resume.pdf") {
          next.push({
            kind: "sys",
            text: `📄 ${PORTFOLIO_CONFIG.name} — Resume & Deliverables. Downloading PDF...`,
          });
          if (typeof window !== "undefined") {
            window.open(PORTFOLIO_CONFIG.resumePdfPath, "_blank");
          }
        } else {
          const proj = PROJECTS_BY_ID[targetId];
          if (proj) {
            if (isLive && proj.link) {
              next.push({ kind: "sys", text: `↗ Opening live link for ${proj.title}...` });
              if (typeof window !== "undefined") {
                const bp = process.env.NEXT_PUBLIC_BASE_PATH || "";
                const targetUrl =
                  proj.link.href.startsWith("/") && bp && !proj.link.href.startsWith(bp)
                    ? `${bp}${proj.link.href}`
                    : proj.link.href;
                window.open(targetUrl, "_blank", "noopener,noreferrer");
              }
            } else {
              next.push({ kind: "sys", text: `opening ${proj.id}…` });
              setHistory((h) => [...h, ...next]);
              setInput("");
              openProject(proj.id);
              return;
            }
          } else {
            next.push({
              kind: "err",
              text: `no such project: ${targetId || "—"} — try \`ls\` or \`open openhw-studio\``,
            });
          }
        }
      } else if (cmd === "socials" || cmd === "links" || cmd === "social") {
        next.push({
          kind: "out",
          text: `GitHub:   ${PORTFOLIO_CONFIG.socials.github}\nLinkedIn: ${PORTFOLIO_CONFIG.socials.linkedin}\nnpm:      ${PORTFOLIO_CONFIG.socials.npm}\nEmail:    ${PORTFOLIO_CONFIG.email}`,
        });
      } else if (cmd === "visit gh" || cmd === "visit github" || cmd === "github" || cmd === "gh") {
        next.push({
          kind: "sys",
          text: `↗ Opening GitHub profile (${PORTFOLIO_CONFIG.socials.github}) in a new tab...`,
        });
        if (typeof window !== "undefined") {
          window.open(PORTFOLIO_CONFIG.socials.github, "_blank", "noopener,noreferrer");
        }
      } else if (cmd === "visit linkedin" || cmd === "linkedin") {
        next.push({
          kind: "sys",
          text: `↗ Opening LinkedIn profile (${PORTFOLIO_CONFIG.socials.linkedin}) in a new tab...`,
        });
        if (typeof window !== "undefined") {
          window.open(PORTFOLIO_CONFIG.socials.linkedin, "_blank", "noopener,noreferrer");
        }
      } else if (cmd === "visit npm" || cmd === "npm") {
        next.push({
          kind: "sys",
          text: `↗ Opening npm profile (${PORTFOLIO_CONFIG.socials.npm}) in a new tab...`,
        });
        if (typeof window !== "undefined") {
          window.open(PORTFOLIO_CONFIG.socials.npm, "_blank", "noopener,noreferrer");
        }
      } else if (cmd === "email" || cmd === "mail" || cmd === "contact email") {
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          navigator.clipboard.writeText(PORTFOLIO_CONFIG.email).catch(() => {});
        }
        next.push({
          kind: "sys",
          text: `📧 ${PORTFOLIO_CONFIG.email} (Copied to clipboard!)`,
        });
        if (typeof window !== "undefined") {
          window.open(`mailto:${PORTFOLIO_CONFIG.email}`, "_blank");
        }
      } else if (head === "echo") {
        const echoText = raw.trim().slice(4).trim();
        next.push({
          kind: "out",
          text: echoText,
        });
      } else if (head === "sudo") {
        if (cmd.includes("rm") || cmd.includes("kill")) {
          next.push({
            kind: "err",
            text: PORTFOLIO_CONFIG.terminal.sudoDeniedText,
          });
        } else {
          next.push({
            kind: "out",
            text: PORTFOLIO_CONFIG.terminal.sudoGrantedText,
          });
        }
      } else if (cmd === "uptime") {
        const elapsedSec = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
        const mins = Math.floor(elapsedSec / 60);
        const secs = elapsedSec % 60;
        const timeFormatted = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
        
        next.push({
          kind: "out",
          text: `portfolio uptime: ${timeFormatted} (active session) · 99.99% availability · WASM JIT Core online`,
        });
      } else if (cmd === "uname -a" || cmd === "uname") {
        next.push({
          kind: "out",
          text: PORTFOLIO_CONFIG.terminal.uname,
        });
      } else if (cmd === "danish") {
        next.push({ kind: "danish" });
      } else if (cmd === "doom") {
        setDoomPreload(true);
        setDoomReady(false);

        const INSTALL_LOGS: Line[] = [
          { kind: "cmd", text: "sudo apt-get update && apt-get install -y doom-engine-wasm doom-wad" },
          { kind: "sys", text: "Hit:1 https://deb.danish.dev/danishos stable InRelease" },
          { kind: "sys", text: "Get:2 https://deb.danish.dev/danishos stable/main wasm-emulators [1,808 kB]" },
          { kind: "sys", text: "Get:3 https://deb.danish.dev/danishos stable/main doom-wad-shareware [5,482 kB]" },
          { kind: "out", text: "Fetched 7,290 kB in 0.3s (24.3 MB/s)\nReading package lists... Done\nBuilding dependency tree... Done\nSelecting previously unselected package doom-engine-wasm." },
          { kind: "sys", text: "Unpacking doom-engine-wasm (1.9-jit-x86) ..." },
          { kind: "sys", text: "Setting up wdosbox-jit-runtime (6.22.60) ..." },
          { kind: "out", text: "[  OK  ] Initialized WebAssembly SoundBlaster16 & OPL3 synthesizer.\n[  OK  ] Allocated 16 MB virtual EMS/XMS memory bank.\n[  OK  ] Mounted /dev/vga0 SDL2 hardware surface (320x200 @ 60 FPS)." },
          { kind: "sys", text: "Extracting DOOM.WAD : [▓▓▓░░░░░░░░░░░░░░░░░░░░░] 12%  ETA 0.8s" },
          { kind: "sys", text: "Extracting DOOM.WAD : [▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░] 38%  ETA 0.5s" },
          { kind: "sys", text: "Extracting DOOM.WAD : [▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░] 65%  ETA 0.3s" },
          { kind: "sys", text: "Extracting DOOM.WAD : [▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓] 100% (5.3 MB unpacked)" },
          { kind: "out", text: "C:\\> DOOM.EXE\nDOOM Shareware Startup v1.9 (id Software)\nV_Init: allocate screens (320x200 8-bit VGA).\nZ_Init: 8.0MB zone memory.\nW_Init: adding doom1.wad ... OK\nS_Init: sound initialized (SB16 44.1kHz Stereo)\nP_Init: playloop initialized." },
          { kind: "sys", text: "🚀 JIT Core ready! Opening DOOM graphics display..." },
        ];

        // Stream lines into the CLI terminal history
        let currentIdx = 0;
        let logsFinished = false;

        const streamNext = () => {
          if (currentIdx < INSTALL_LOGS.length) {
            const item = INSTALL_LOGS[currentIdx];
            setHistory((prev) => [...prev, item]);
            currentIdx++;
            setTimeout(streamNext, currentIdx === INSTALL_LOGS.length ? 500 : 180);
          } else {
            logsFinished = true;
          }
        };

        setInput("");
        streamNext();
        return;
      } else if (cmd === "snake" || cmd === "game" || cmd === "play") {
        next.push({ kind: "snake" });
      } else if (cmd === "matrix") {
        next.push({ kind: "matrix" });
      } else if (head === "theme") {
        const sub = (rest[0] || "").toLowerCase();
        const availableThemes: TerminalTheme[] = ["default", "cyberpunk", "matrix", "nord"];

        if (sub === "list") {
          next.push({
            kind: "out",
            text: `Available themes: default · cyberpunk · matrix · nord (current: ${terminalTheme})`,
          });
        } else if (sub === "random") {
          const others = availableThemes.filter((t) => t !== terminalTheme);
          const picked = others[Math.floor(Math.random() * others.length)];
          setTerminalTheme(picked);
          next.push({ kind: "sys", text: `🎲 Random theme set to '${picked}'` });
        } else {
          const choice = (sub === "set" ? rest[1] : sub) || "default";
          if (availableThemes.includes(choice as TerminalTheme)) {
            setTerminalTheme(choice as TerminalTheme);
            next.push({
              kind: "sys",
              text: `🎨 Terminal theme set to '${choice}'. Options: default · cyberpunk · matrix · nord`,
            });
          } else {
            next.push({
              kind: "err",
              text: `Unknown theme '${choice}'. Use \`theme list\` or choose: default · cyberpunk · matrix · nord`,
            });
          }
        }
      } else if (head === "font") {
        const sub = (rest[0] || "").toLowerCase();
        const availableFonts: TerminalFont[] = ["mono", "pixel", "hacker", "sans"];

        if (sub === "list") {
          next.push({
            kind: "out",
            text: `Available fonts: mono (default) · pixel · hacker · sans (current: ${terminalFont})`,
          });
        } else {
          const choice = (sub === "set" ? rest[1] : sub) || "mono";
          if (availableFonts.includes(choice as TerminalFont)) {
            setTerminalFont(choice as TerminalFont);
            next.push({
              kind: "sys",
              text: `🔤 Terminal font set to '${choice}'. Options: mono · pixel · hacker · sans`,
            });
          } else {
            next.push({
              kind: "err",
              text: `Unknown font '${choice}'. Use \`font list\` or choose: mono · pixel · hacker · sans`,
            });
          }
        }
      } else if (head === "skills" || head === "skill") {
        const cat = (rest[0] || "").toLowerCase();
        if (cat === "lang" || cat === "languages") {
          next.push({ kind: "out", text: "• Languages: C, C++20, Rust, TypeScript, Python, ARM/RISC-V ASM" });
        } else if (cat === "hw" || cat === "hardware") {
          next.push({ kind: "out", text: "• Hardware & MCU: STM32 (Cortex-M3/M4), ESP32-S3, RP2040, USB HID/FIDO2" });
        } else if (cat === "wasm" || cat === "systems") {
          next.push({ kind: "out", text: "• Systems & Web: WebAssembly (WASM), Web Workers, SharedArrayBuffer, Docker" });
        } else {
          next.push({
            kind: "out",
            text: "• Languages: C, C++20, Rust, TypeScript, Python, ARM/RISC-V ASM\n• Systems: WebAssembly, Web Workers, SharedArrayBuffer, Docker\n• Hardware: STM32 (Cortex-M3/M4), ESP32-S3, RP2040, USB HID/FIDO2\n• Protocols: UART, SPI, I2C, BLE, LwIP Ethernet\n(Tip: use `skills lang`, `skills hw`, or `skills wasm` to filter)",
          });
        }
      } else if (head === "history") {
        if (rest[0] === "clear") {
          cmdHistoryRef.current = [];
          historyIndexRef.current = -1;
          next.push({ kind: "sys", text: "✓ Command history buffer cleared." });
        } else {
          const recorded = cmdHistoryRef.current;
          if (recorded.length === 0) {
            next.push({ kind: "out", text: "No commands in session history yet." });
          } else {
            const list = recorded.map((c, idx) => `  ${idx + 1}  ${c}`).join("\n");
            next.push({ kind: "out", text: list });
          }
        }
      } else if (cmd === "date" || cmd === "time") {
        const now = new Date();
        next.push({
          kind: "out",
          text: `Current time: ${now.toUTCString()} · Local: ${now.toLocaleString()}`,
        });
      } else if (cmd === "neofetch" || cmd === "fastfetch") {
        next.push({ kind: "neofetch" });
      } else if (cmd === "stats" || cmd === "metrics") {
        next.push({ kind: "stats" });
      } else if (cmd === "resume") {
        next.push({
          kind: "sys",
          text: `📄 Opening ${PORTFOLIO_CONFIG.name} Resume & Deliverables...`,
        });
        if (typeof window !== "undefined") {
          window.open(PORTFOLIO_CONFIG.resumePdfPath, "_blank");
        }
      } else if (cmd === "emu" || cmd === "firmware" || cmd === "boot") {
        next.push({ kind: "emu" });
      } else if (head === "whoami") {
        next.push({ kind: "whoami" });
      } else if (cmd === "about" || cmd === "stack" || cmd === "contact") {
        next.push({ kind: "sys", text: `→ navigating to #${cmd}` });
        goto(cmd);
      } else if (head === "help") {
        const topic = (rest[0] || "").toLowerCase();
        if (topic === "theme") {
          next.push({ kind: "out", text: "theme [default|cyberpunk|matrix|nord|list|random] — change terminal palette" });
        } else if (topic === "font") {
          next.push({ kind: "out", text: "font [mono|pixel|hacker|sans|list] — change terminal font style" });
        } else if (topic === "open") {
          next.push({ kind: "out", text: "open <project-id> (e.g. `open openhw-studio`) or `open --live <project-id>`" });
        } else if (topic === "skills") {
          next.push({ kind: "out", text: "skills [lang|hw|wasm] — view full or filtered skillset matrix" });
        } else {
          const customCmdList = (PORTFOLIO_CONFIG.terminal.customCommands || []).map((c) => c.command).join(" · ");
          next.push({
            kind: "out",
            text: `commands: ls · open <project> · doom · snake · socials · email · skills [lang|hw|wasm] · danish · neofetch · stats · matrix · font <name|list> · theme <name|list|random> · history [clear] · uptime · uname -a · sudo <cmd> · date · emu · resume · whoami${customCmdList ? ` · ${customCmdList}` : ""} · clear · home\n(Type \`help <command>\` for detailed usage)`,
          });
        }
      } else {
        // Check for any user-defined custom commands in PORTFOLIO_CONFIG
        const matchedCustom = (PORTFOLIO_CONFIG.terminal.customCommands || []).find(
          (c) => c.command.toLowerCase() === cmd
        );
        if (matchedCustom) {
          next.push({
            kind: matchedCustom.kind || "out",
            text: matchedCustom.output,
          });
        } else {
          next.push({
            kind: "err",
            text: `zsh: command not found: ${raw} — try \`help\` or \`neofetch\``,
          });
        }
      }

      setHistory((h) => [...h, ...next]);
      setInput("");
    },
    [goto, openProject, terminalTheme, terminalFont]
  );

  // Tab autocompletion & Up/Down history handlers
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(input);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const current = input.trimStart().toLowerCase();
      if (!current) return;
      const match = AUTOCOMPLETE_LIST.find((c) => c.startsWith(current));
      if (match) {
        setInput(match);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const len = cmdHistoryRef.current.length;
      if (len === 0) return;
      let nextIdx = historyIndexRef.current === -1 ? len - 1 : historyIndexRef.current - 1;
      if (nextIdx < 0) nextIdx = 0;
      historyIndexRef.current = nextIdx;
      setInput(cmdHistoryRef.current[nextIdx] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const len = cmdHistoryRef.current.length;
      if (len === 0 || historyIndexRef.current === -1) return;
      let nextIdx = historyIndexRef.current + 1;
      if (nextIdx >= len) {
        historyIndexRef.current = -1;
        setInput("");
      } else {
        historyIndexRef.current = nextIdx;
        setInput(cmdHistoryRef.current[nextIdx] || "");
      }
    }
  };

  const lineColor: Record<Exclude<LineKind, "cmd" | "list" | "neofetch" | "stats" | "emu" | "matrix" | "danish" | "whoami" | "snake" | "doom">, string> =
    useMemo(
      () => ({
        out: "text-[#b9cbe0]",
        sys: "text-accent-bright",
        err: "text-accent",
      }),
      []
    );

  const THEME_STYLES: Record<TerminalTheme, { bg: string; border: string; text: string; prompt: string; accent: string }> = {
    default: {
      bg: "bg-term",
      border: "border-term-line",
      text: "text-[#e7f0f9]",
      prompt: "text-accent-bright",
      accent: "bg-[#2a2438] text-accent-bright hover:bg-accent hover:text-white",
    },
    cyberpunk: {
      bg: "bg-[#0b0813]",
      border: "border-[#1d4ed8]/40",
      text: "text-[#00f0ff]",
      prompt: "text-[#1d4ed8]",
      accent: "bg-[#1f002b] text-[#00f0ff] hover:bg-[#1d4ed8] hover:text-black",
    },
    matrix: {
      bg: "bg-[#050e07]",
      border: "border-[#28c840]/40",
      text: "text-[#28c840]",
      prompt: "text-[#a2f0b0]",
      accent: "bg-[#0a200f] text-[#28c840] hover:bg-[#28c840] hover:text-black",
    },
    nord: {
      bg: "bg-[#2e3440]",
      border: "border-[#4c566a]",
      text: "text-[#eceff4]",
      prompt: "text-[#88c0d0]",
      accent: "bg-[#3b4252] text-[#88c0d0] hover:bg-[#88c0d0] hover:text-[#2e3440]",
    },
  };

  const FONT_CLASSES: Record<TerminalFont, string> = {
    mono: "font-mono",
    pixel: "font-mono tracking-wider [font-family:monospace]",
    hacker: "font-mono tracking-tight font-medium",
    sans: "font-sans tracking-normal",
  };

  const activeTheme = THEME_STYLES[terminalTheme] || THEME_STYLES.default;
  const activeFont = FONT_CLASSES[terminalFont] || FONT_CLASSES.mono;
  const activeProject = activeId ? PROJECTS_BY_ID[activeId] : null;
  const showWindow = view !== "home" && !minimized;
  const showHome = view === "home" || minimized;

  return (
    <section id="terminal" className="scroll-mt-[120px] pb-20 sm:pb-28">
      <Divider />
      <div className="mx-auto mt-20 w-full max-w-page px-6 sm:mt-28 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
            <span className="text-accent" aria-hidden>
              ∿
            </span>
            {PORTFOLIO_CONFIG.terminal.sectionEyebrow}
          </p>
          <h2 className="mt-4 text-[28px] font-semibold tracking-tightest text-ink sm:text-[36px]">
            {PORTFOLIO_CONFIG.terminal.sectionTitle}
          </h2>
          <p className="mt-3 text-[15px] text-ink-2">
            {PORTFOLIO_CONFIG.terminal.sectionDescription}
          </p>
        </div>

        {/* ── MacBook ── */}
        <div className="mx-auto mt-12 max-w-[880px] [perspective:2000px]">
          <motion.div
            initial={{ rotateX: reduce ? 0 : -88, opacity: reduce ? 1 : 0.5 }}
            whileInView={{ rotateX: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "center bottom" }}
            className="relative rounded-[20px] border border-[#3a3a3c] bg-[#1c1c1e] p-2.5 shadow-[0_40px_90px_-30px_rgba(56,189,248,0.5)] sm:p-3"
          >
            {/* camera notch */}
            <div className="absolute left-1/2 top-2.5 z-20 h-4 w-28 -translate-x-1/2 rounded-b-xl bg-[#1c1c1e] sm:top-3">
              <span className="absolute left-1/2 top-1.5 h-1 w-1 -translate-x-1/2 rounded-full bg-[#3a3a3c]" />
            </div>

            {/* display */}
            <div className={`relative h-[440px] overflow-hidden rounded-[12px] transition-colors duration-300 ${activeTheme.bg} sm:h-[480px]`}>
              {showHome && (
                <HomeScreen
                  onStart={() => {
                    setMinimized(false);
                    setView("cli");
                  }}
                  onOpen={openProject}
                  minimizedLabel={
                    minimized
                      ? view === "project" && activeProject
                        ? activeProject.title
                        : "Terminal"
                      : null
                  }
                  onRestore={restoreWindow}
                />
              )}

              {showWindow && (
                <div className="flex h-full flex-col">
                  {/* window title bar */}
                  <div className={`flex h-[30px] shrink-0 items-center justify-between border-b px-4 transition-colors ${activeTheme.border}`}>
                    <div className="flex items-center gap-2">
                      <div className="group/tl flex items-center gap-2">
                        <button
                          type="button"
                          onClick={closeWindow}
                          aria-label="Close — back to home"
                          title="Close"
                          className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#ff5f57] text-[9px] font-bold leading-none text-black/55 transition-colors hover:bg-[#ff7b74]"
                        >
                          <span className="opacity-0 group-hover/tl:opacity-100">×</span>
                        </button>
                        <button
                          type="button"
                          onClick={minimizeWindow}
                          aria-label="Minimize"
                          title="Minimize"
                          className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#febc2e] text-[10px] font-bold leading-none text-black/55 transition-colors hover:bg-[#ffce5a]"
                        >
                          <span className="-mt-px opacity-0 group-hover/tl:opacity-100">–</span>
                        </button>
                        <span className="h-3.5 w-3.5 rounded-full bg-[#28c840]" aria-hidden />
                      </div>
                      <span className="ml-3 truncate font-mono text-[11px] text-[#7b93ad]">
                        {view === "project" && activeProject
                          ? `~/projects/${activeProject.id}`
                          : view === "doom"
                          ? "🎮 DOOM (1993) — WASM JIT"
                          : "danish — zsh — projects"}
                      </span>
                    </div>

                    {/* Right-side actions */}
                    {view === "doom" ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowDoomHelp((prev) => !prev)}
                          className={`flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-bold transition-all ${
                            showDoomHelp
                              ? "border-[#ffd166] bg-[#ffd166] text-black"
                              : "border-[#ff4e9b]/40 bg-[#1f0d28] text-[#ff74b1] hover:bg-[#ff4e9b] hover:text-black"
                          }`}
                        >
                          <span>ℹ Help</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDoomPreload(false);
                            setView("cli");
                          }}
                          className="flex items-center gap-1 rounded border border-[#ff4e9b] bg-[#ff4e9b] px-2 py-0.5 text-[10px] font-bold text-black shadow-[0_0_8px_rgba(255,78,155,0.4)] transition-transform hover:bg-white active:scale-95"
                        >
                          <span>Exit</span>
                          <kbd className="rounded bg-black/30 px-1 text-[9px] text-white">ESC</kbd>
                        </button>
                      </div>
                    ) : view === "project" ? (
                      <button
                        type="button"
                        onClick={() => setView("cli")}
                        className="font-mono text-[11px] text-accent-bright transition-colors hover:text-white"
                      >
                        ← back
                      </button>
                    ) : null}
                  </div>

                  {/* DOOM Help Drawer Overlay */}
                  {view === "doom" && showDoomHelp && (
                    <div className="absolute inset-x-0 top-[30px] z-40 max-h-[85%] overflow-y-auto no-scrollbar border-b border-[#ffd166]/40 bg-[#0e0717]/95 p-4 text-[12px] shadow-2xl backdrop-blur-md">
                      <div className="flex items-center justify-between border-b border-[#ffd166]/30 pb-2">
                        <span className="font-bold text-[#ffd166]">📖 DOOM Controls &amp; Gameplay Guide</span>
                        <button
                          type="button"
                          onClick={() => setShowDoomHelp(false)}
                          className="rounded bg-[#ffd166] px-2 py-0.5 text-[10px] font-bold text-black hover:bg-white"
                        >
                          Close
                        </button>
                      </div>
                      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 text-[#e2d9eb]">
                        <div className="space-y-1.5 rounded border border-white/10 bg-black/50 p-2.5">
                          <div className="font-semibold text-[#ff74b1]">🎮 Movement &amp; Action</div>
                          <div className="text-[11px] space-y-1">
                            <div><strong className="text-white">Arrow Keys / WASD</strong> : Move forward, backward, turn</div>
                            <div><strong className="text-white">Ctrl / Mouse Left</strong> : Fire weapon / Shoot</div>
                            <div><strong className="text-white">Space / E</strong> : Open doors &amp; activate switches</div>
                            <div><strong className="text-white">Shift + Move</strong> : Turbo sprint</div>
                          </div>
                        </div>

                        <div className="space-y-1.5 rounded border border-white/10 bg-black/50 p-2.5">
                          <div className="font-semibold text-[#38ef7d]">🔫 Weapons &amp; Combat</div>
                          <div className="text-[11px] space-y-1">
                            <div><strong className="text-white">1</strong> : Fist / Chainsaw</div>
                            <div><strong className="text-white">2</strong> : Pistol</div>
                            <div><strong className="text-white">3</strong> : Shotgun / Super Shotgun</div>
                            <div><strong className="text-white">4</strong> : Chaingun · <strong className="text-white">5</strong> : Rocket Launcher</div>
                            <div><strong className="text-white">6</strong> : Plasma Rifle · <strong className="text-white">7</strong> : BFG9000</div>
                          </div>
                        </div>

                        <div className="space-y-1.5 rounded border border-white/10 bg-black/50 p-2.5 sm:col-span-2">
                          <div className="font-semibold text-[#ffd166]">💡 Pro Tips &amp; Sound</div>
                          <div className="text-[11px] space-y-1 text-[#b9cbe0]">
                            <div>• Click inside the game window once to lock mouse/keyboard focus.</div>
                            <div>• Press <strong className="text-white">ESC</strong> in-game for the options/save menu, or click <strong className="text-[#ff74b1]">Exit</strong> above to return to the terminal.</div>
                            <div>• Powered by DOSBox WebAssembly JIT with SoundBlaster 16 stereo emulation.</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* DOOM Full Screen inside Laptop — Mounted in background during preload, made visible when ready */}
                  {(view === "doom" || doomPreload) && (
                    <div className={`flex-1 overflow-hidden bg-black ${view === "doom" ? "block" : "hidden"}`}>
                      <DoomPlayer
                        onExit={() => {
                          setDoomPreload(false);
                          setDoomReady(false);
                          setShowDoomHelp(false);
                          setView("cli");
                        }}
                        onReady={() => {
                          setDoomReady(true);
                          setView("doom");
                        }}
                      />
                    </div>
                  )}

                  {/* CLI */}
                  {view === "cli" && (
                    <div
                      ref={bodyRef}
                      onClick={() => inputRef.current?.focus({ preventScroll: true })}
                      className={`flex-1 overflow-y-auto no-scrollbar px-4 py-4 text-[13px] leading-relaxed transition-all duration-200 sm:text-[14px] ${activeFont}`}
                    >
                      <p className="text-[#b9cbe0]">
                        DanishOS v2.4 (x86_64-wasm) · {PROJECTS.length} systems &amp; emulator builds.
                      </p>
                      <p className="mt-1 text-[#5f7590]">
                        # Quick commands: <code className="text-accent-bright">ls</code> · <code className="text-accent-bright">neofetch</code> · <code className="text-accent-bright">stats</code> · <code className="text-accent-bright">emu</code>
                      </p>

                      {/* Interactive suggestion pills */}
                      <div className={`mt-3 flex flex-wrap items-center gap-1.5 border-b pb-3 transition-colors ${activeTheme.border}`}>
                        <span className="text-[11px] text-[#7b93ad] mr-1">Suggestions:</span>
                        {SUGGESTIONS.map((s) => (
                          <button
                            key={s.cmd}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              run(s.cmd);
                            }}
                            className={`rounded px-2 py-0.5 text-[11px] transition-colors ${activeTheme.accent}`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>

                      {history.map((line, i) => {
                        if (line.kind === "cmd") {
                          return (
                            <div key={i} className="mt-3 flex flex-wrap items-center gap-x-2">
                              <span className={activeTheme.prompt}>{PROMPT}</span>
                              <span className={`font-semibold ${activeTheme.text}`}>{line.text}</span>
                            </div>
                          );
                        }
                        if (line.kind === "list") {
                          return (
                            <ul key={i} className="mt-2 space-y-1">
                              {PROJECTS.map((p) => (
                                <li
                                  key={p.id}
                                  className={`flex flex-col gap-0.5 border-l-2 py-1.5 pl-3 transition-colors sm:flex-row sm:items-center sm:gap-3 ${activeTheme.border}`}
                                >
                                  <button
                                    type="button"
                                    onClick={() => openProject(p.id)}
                                    className={`text-left font-medium hover:underline ${activeTheme.prompt}`}
                                  >
                                    {p.id}
                                  </button>
                                  <span className="text-[#96abc4] text-[12px]">{p.tag}</span>
                                  <button
                                    type="button"
                                    onClick={() => openProject(p.id)}
                                    className="font-mono text-[12px] text-accent hover:text-white sm:ml-auto"
                                  >
                                    inspect →
                                  </button>
                                </li>
                              ))}
                            </ul>
                          );
                        }
                        if (line.kind === "neofetch") {
                          return <NeofetchOutput key={i} />;
                        }
                        if (line.kind === "stats") {
                          return <StatsOutput key={i} stats={gitHubStats} />;
                        }
                        if (line.kind === "emu") {
                          return <EmuOutput key={i} />;
                        }
                        if (line.kind === "matrix") {
                          return <MatrixOutput key={i} />;
                        }
                        if (line.kind === "danish") {
                          return <DanishOutput key={i} />;
                        }
                        if (line.kind === "whoami") {
                          return <WhoamiOutput key={i} />;
                        }
                        if (line.kind === "snake") {
                          return <SnakeGame key={i} onExit={() => run("clear")} />;
                        }
                        if (line.kind === "doom") {
                          return <DoomPlayer key={i} onExit={() => run("clear")} />;
                        }
                        return (
                          <div key={i} className={`mt-1.5 ${lineColor[line.kind]}`}>
                            {line.text}
                          </div>
                        );
                      })}

                      {/* live input */}
                      <div className="mt-3 flex flex-wrap items-center gap-x-2">
                        <span className={activeTheme.prompt}>{PROMPT}</span>
                        <input
                          ref={inputRef}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          spellCheck={false}
                          autoComplete="off"
                          autoCapitalize="off"
                          aria-label="Terminal command input"
                          className={`min-w-[8ch] flex-1 bg-transparent caret-accent-bright outline-none placeholder:text-[#5f7590] ${activeTheme.text}`}
                          placeholder="type a command or press Tab…"
                        />
                      </div>
                    </div>
                  )}

                  {/* Project detail window */}
                  {view === "project" && activeProject && (
                    <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-[22px] font-semibold tracking-tightest text-white">
                          {activeProject.title}
                        </h3>
                        {activeProject.badge && (
                          <Badge
                            label={activeProject.badge.label}
                            variant={activeProject.badge.variant}
                            pulse={activeProject.badge.pulse}
                          />
                        )}
                      </div>

                      <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-[#b9cbe0]">
                        {activeProject.description}
                      </p>

                      {activeProject.why && (
                        <div className="mt-4 rounded-xl border border-line/40 bg-surface/30 p-4 text-[14px] leading-relaxed text-[#96abc4]">
                          <p className="font-mono text-[11px] uppercase tracking-wider text-accent mb-1">
                            Why it matters
                          </p>
                          {activeProject.why}
                        </div>
                      )}

                      <div className="mt-5 flex flex-wrap gap-2">
                        {activeProject.chips.map((chip) => (
                          <Chip key={chip}>{chip}</Chip>
                        ))}
                      </div>

                      <div className="mt-7 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setView("cli")}
                          className="inline-flex items-center gap-2 rounded-full border border-term-line px-4 py-2 font-mono text-[13px] text-[#b9cbe0] transition-colors hover:border-accent-bright hover:text-white"
                        >
                          ← back to terminal
                        </button>
                        {activeProject.link &&
                          (activeProject.link.href.startsWith("/") ? (
                            <Link
                              href={activeProject.link.href}
                              className="inline-flex items-center gap-2 rounded-full bg-candy px-4 py-2 font-mono text-[13px] text-white"
                            >
                              {activeProject.link.label}
                            </Link>
                          ) : (
                            <a
                              href={activeProject.link.href}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="inline-flex items-center gap-2 rounded-full bg-candy px-4 py-2 font-mono text-[13px] text-white"
                            >
                              {activeProject.link.label}
                            </a>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* base / hinge */}
          <div
            className="relative mx-auto h-3.5 w-[110%] -translate-x-[4.5%] rounded-b-2xl bg-gradient-to-b from-[#c8ccd2] to-[#9aa0a8] shadow-xl"
            aria-hidden
          >
            <div className="absolute left-1/2 top-0 h-1.5 w-28 -translate-x-1/2 rounded-b-lg bg-[#7e858d]" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Custom Neofetch Component ── */
function NeofetchOutput() {
  const n = PORTFOLIO_CONFIG.terminal.neofetch;
  return (
    <div className="my-2 grid grid-cols-1 gap-4 rounded-lg bg-[#0b1220]/80 p-3.5 sm:grid-cols-[140px_1fr]">
      <pre className="font-mono text-[10px] leading-tight text-accent select-none">
{n.asciiArt}
      </pre>
      <div className="space-y-0.5 font-mono text-[12px]">
        <p className="font-bold text-accent-bright">{PORTFOLIO_CONFIG.githubUsername}@portfolio</p>
        <p className="text-[#5f7590]">-----------------------</p>
        <p><span className="text-[#2563eb]">OS:</span> {n.os}</p>
        <p><span className="text-[#2563eb]">Host:</span> {n.host}</p>
        <p><span className="text-[#2563eb]">Kernel:</span> {n.kernel}</p>
        <p><span className="text-[#2563eb]">Commits:</span> {n.commits}</p>
        <p><span className="text-[#2563eb]">Languages:</span> {n.languages}</p>
        <p><span className="text-[#2563eb]">Hardware:</span> {n.hardware}</p>
        <div className="mt-1.5 flex gap-1.5 pt-1">
          <span className="h-3 w-4 rounded-sm bg-[#2563eb]" />
          <span className="h-3 w-4 rounded-sm bg-[#3b82f6]" />
          <span className="h-3 w-4 rounded-sm bg-[#38bdf8]" />
          <span className="h-3 w-4 rounded-sm bg-[#0284c7]" />
          <span className="h-3 w-4 rounded-sm bg-[#28c840]" />
        </div>
      </div>
    </div>
  );
}

/* ── Dynamic GitHub Live Stats Component ── */
function StatsOutput({ stats }: { stats: import("@/lib/githubDirectStats").GitHubDirectStats }) {
  return (
    <div className="my-2 space-y-2 font-mono text-[12px]">
      <div className="rounded-lg border border-accent/20 bg-[#0b1526] p-3.5">
        <div className="flex items-center justify-between">
          <p className="font-bold text-accent-bright">GitHub Activity &amp; Streaks (@{PORTFOLIO_CONFIG.githubUsername})</p>
        </div>
        <div className="mt-2.5 grid grid-cols-1 gap-2 text-[#b9cbe0] sm:grid-cols-3">
          <div className="rounded bg-black/40 p-2.5 text-center">
            <p className="text-[18px] font-bold text-[#2563eb]">
              {stats.loading ? "..." : stats.totalContributions}
            </p>
            <p className="text-[10px] text-[#7b93ad]">Total Contributions</p>
          </div>
          <div className="rounded bg-black/40 p-2.5 text-center">
            <p className="text-[18px] font-bold text-[#28c840]">
              {stats.loading ? "..." : `${stats.currentStreak} Days`}
            </p>
            <p className="text-[10px] text-[#7b93ad]">Current Streak</p>
          </div>
          <div className="rounded bg-black/40 p-2.5 text-center">
            <p className="text-[18px] font-bold text-[#38bdf8]">
              {stats.loading ? "..." : `${stats.longestStreak} Days`}
            </p>
            <p className="text-[10px] text-[#7b93ad]">Longest Streak</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Custom Virtual Firmware Emu Ticker ── */
function EmuOutput() {
  return (
    <div className="my-2 rounded-lg border border-[#28c840]/30 bg-[#0d1611] p-3 font-mono text-[11px] leading-relaxed text-[#28c840]">
      <p className="text-[#a2f0b0] font-bold">▶ [BOOT] Initializing virtual Cortex-M3 (STM32F103) &amp; RV32 runner...</p>
      <p>[WASM] Memory mapped: 0x08000000 - 0x08020000 (128 KB Flash)</p>
      <p>[UART] Baud 115200 · Virtual Host Controller Interface: OK</p>
      <p>[LwIP] Wi-Fi packet frame padded (0 drop rate)</p>
      <p className="text-white font-semibold">✓ Core running at 72 MHz · All 9 peripheral hooks operational.</p>
    </div>
  );
}

/* ── Real Animated Matrix Digital Rain Component ── */
function MatrixOutput() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const chars = "01DANISHWASM0101RISCVSTM32ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ".split("");
    const fontSize = 12;
    
    // Set fixed internal resolution
    canvas.width = canvas.offsetWidth || 500;
    canvas.height = 200;

    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array.from({ length: columns }, () => Math.floor(Math.random() * -20));

    let lastDraw = 0;
    const fpsInterval = 1000 / 24; // Smooth 24 FPS for classic retro Matrix feel

    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render);
      if (time - lastDraw < fpsInterval) return;
      lastDraw = time;

      // Translucent black background for trailing effect
      ctx.fillStyle = "rgba(10, 14, 12, 0.25)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Head character is bright white-green, tail is classic terminal green
        ctx.fillStyle = drops[i] > 1 && Math.random() > 0.8 ? "#a2f0b0" : "#28c840";
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.96) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="my-2 overflow-hidden rounded-lg border border-[#28c840]/40 bg-black/90 p-2 font-mono text-[11px] select-none">
      <div className="flex items-center justify-between px-2 pb-1.5 text-[10px] text-[#28c840]/70">
        <span>▶ MATRIX DIGITAL RAIN [DANISH_WASM_CORE]</span>
        <span>STREAM ACTIVE</span>
      </div>
      <canvas
        ref={canvasRef}
        className="h-[200px] w-full rounded bg-black"
        style={{ display: "block" }}
      />
    </div>
  );
}

/* ── Custom Danish Face Art Component ── */
function DanishOutput() {
  return (
    <div className="my-2 rounded-lg border border-accent/30 bg-[#0b1526] p-3 font-mono text-[12px]">
      <pre className="font-mono text-[11px] leading-tight text-[#2563eb] select-none">
{PORTFOLIO_CONFIG.terminal.danishFaceArt}
      </pre>
      <div className="mt-2 flex flex-wrap items-center justify-between border-t border-term-line/60 pt-2 text-[11px] text-[#b9cbe0]">
        <span>👤 {PORTFOLIO_CONFIG.name}</span>
        <span>⚡ {PORTFOLIO_CONFIG.role}</span>
        <span className="text-accent">@{PORTFOLIO_CONFIG.githubUsername}</span>
      </div>
    </div>
  );
}

/* ── Custom WhoAmI ASCII Banner & Bio Component ── */
function WhoamiOutput() {
  return (
    <div className="my-2 rounded-lg border border-accent/30 bg-[#0b1526] p-4 font-mono text-[12px]">
      <pre className="font-mono text-[10px] leading-tight text-accent-bright sm:text-[12px] select-none overflow-x-auto">
{PORTFOLIO_CONFIG.terminal.whoamiBanner}
      </pre>
      <p className="mt-2 text-[#e7f0f9] leading-relaxed">
        {PORTFOLIO_CONFIG.terminal.whoami}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-term-line/60 pt-2 text-[11px] text-[#96abc4]">
        <span>Location: India</span>
        <span>•</span>
        <span>Focus: Emulators, WASM, Firmware &amp; Full-Stack Toolchains</span>
      </div>
    </div>
  );
}

/* ── Interactive Retro Snake Game Component ── */
function SnakeGame({ onExit }: { onExit?: () => void }) {
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 },
  ]);
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 12, y: 5 });
  const [direction, setDirection] = useState<"UP" | "DOWN" | "LEFT" | "RIGHT">("RIGHT");
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [paused, setPaused] = useState(false);

  const gridWidth = 26;
  const gridHeight = 13;

  const dirRef = useRef(direction);
  dirRef.current = direction;

  const moveSnake = useCallback(() => {
    if (gameOver || paused) return;

    setSnake((prev) => {
      const head = { ...prev[0] };
      const currentDir = dirRef.current;

      if (currentDir === "UP") head.y -= 1;
      if (currentDir === "DOWN") head.y += 1;
      if (currentDir === "LEFT") head.x -= 1;
      if (currentDir === "RIGHT") head.x += 1;

      // Wrap around grid boundaries for smooth arcade play
      if (head.x < 0) head.x = gridWidth - 1;
      if (head.x >= gridWidth) head.x = 0;
      if (head.y < 0) head.y = gridHeight - 1;
      if (head.y >= gridHeight) head.y = 0;

      // Self-collision detection
      for (let i = 0; i < prev.length; i++) {
        if (prev[i].x === head.x && prev[i].y === head.y) {
          setGameOver(true);
          return prev;
        }
      }

      const newSnake = [head, ...prev];

      // Food eaten
      if (head.x === food.x && head.y === food.y) {
        setScore((s) => {
          const next = s + 10;
          setHighScore((h) => Math.max(h, next));
          return next;
        });
        setFood({
          x: Math.floor(Math.random() * gridWidth),
          y: Math.floor(Math.random() * gridHeight),
        });
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, gameOver, paused]);

  useEffect(() => {
    const interval = setInterval(moveSnake, 110);
    return () => clearInterval(interval);
  }, [moveSnake]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "arrowup" || k === "w") {
        if (dirRef.current !== "DOWN") setDirection("UP");
        e.preventDefault();
      } else if (k === "arrowdown" || k === "s") {
        if (dirRef.current !== "UP") setDirection("DOWN");
        e.preventDefault();
      } else if (k === "arrowleft" || k === "a") {
        if (dirRef.current !== "RIGHT") setDirection("LEFT");
        e.preventDefault();
      } else if (k === "arrowright" || k === "d") {
        if (dirRef.current !== "LEFT") setDirection("RIGHT");
        e.preventDefault();
      } else if (k === " " || k === "p") {
        setPaused((p) => !p);
      } else if (k === "r" && gameOver) {
        setSnake([
          { x: 5, y: 5 },
          { x: 4, y: 5 },
          { x: 3, y: 5 },
        ]);
        setDirection("RIGHT");
        setScore(0);
        setGameOver(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameOver]);

  const restartGame = () => {
    setSnake([
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
    ]);
    setDirection("RIGHT");
    setScore(0);
    setGameOver(false);
    setPaused(false);
  };

  return (
    <div className="my-2 rounded-lg border border-[#28c840]/40 bg-[#0a120c] p-3.5 font-mono text-[12px] select-none text-[#28c840]">
      {/* Game Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#28c840]/30 pb-2 text-[11px]">
        <span className="font-bold text-[#a2f0b0]">🐍 DANISH_WASM_SNAKE v1.0</span>
        <div className="flex items-center gap-3">
          <span>Score: <strong className="text-white">{score}</strong></span>
          <span>Best: <strong className="text-[#a2f0b0]">{highScore}</strong></span>
        </div>
      </div>

      {/* ASCII Grid View */}
      <div className="my-3 flex justify-center overflow-x-auto">
        <div
          className="grid gap-[2.5px] rounded-md border border-[#28c840]/30 bg-black/90 p-2.5 shadow-inner"
          style={{
            gridTemplateColumns: `repeat(${gridWidth}, 16px)`,
            gridTemplateRows: `repeat(${gridHeight}, 16px)`,
          }}
        >
          {Array.from({ length: gridHeight }).map((_, y) =>
            Array.from({ length: gridWidth }).map((_, x) => {
              const isHead = snake[0].x === x && snake[0].y === y;
              const isBody = snake.slice(1).some((s) => s.x === x && s.y === y);
              const isFood = food.x === x && food.y === y;

              let cellColor = "bg-[#0f1f13]";
              let cellContent = "";

              if (isHead) {
                cellColor = "bg-[#a2f0b0] shadow-sm";
                cellContent = "•";
              } else if (isBody) {
                cellColor = "bg-[#28c840]";
              } else if (isFood) {
                cellColor = "bg-[#ff4e9b] animate-pulse";
                cellContent = "★";
              }

              return (
                <div
                  key={`${x}-${y}`}
                  className={`flex h-[16px] w-[16px] items-center justify-center rounded-[3px] text-[10px] font-bold text-black ${cellColor}`}
                >
                  {cellContent}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Game State Overlay & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
        {gameOver ? (
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#ff4e9b]">💥 GAME OVER!</span>
            <button
              type="button"
              onClick={restartGame}
              className="rounded bg-[#28c840] px-2 py-0.5 font-bold text-black hover:bg-[#a2f0b0]"
            >
              Play Again (R)
            </button>
          </div>
        ) : (
          <span className="text-[#8c7ba0]">
            Controls: <code className="text-[#a2f0b0]">WASD</code> or <code className="text-[#a2f0b0]">Arrows</code> · <code className="text-[#a2f0b0]">Space</code> pause
          </span>
        )}

        {/* Mobile On-Screen D-Pad */}
        <div className="flex items-center gap-1 sm:hidden">
          <button
            type="button"
            onClick={() => dirRef.current !== "RIGHT" && setDirection("LEFT")}
            className="rounded bg-[#1a3320] px-2 py-1 text-white active:bg-[#28c840]"
          >
            ◀
          </button>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => dirRef.current !== "DOWN" && setDirection("UP")}
              className="rounded bg-[#1a3320] px-2 py-0.5 text-white active:bg-[#28c840]"
            >
              ▲
            </button>
            <button
              type="button"
              onClick={() => dirRef.current !== "UP" && setDirection("DOWN")}
              className="rounded bg-[#1a3320] px-2 py-0.5 text-white active:bg-[#28c840]"
            >
              ▼
            </button>
          </div>
          <button
            type="button"
            onClick={() => dirRef.current !== "LEFT" && setDirection("RIGHT")}
            className="rounded bg-[#1a3320] px-2 py-1 text-white active:bg-[#28c840]"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── bright home display ── */
function HomeScreen({
  onStart,
  onOpen,
  minimizedLabel,
  onRestore,
}: {
  onStart: () => void;
  onOpen: (id: string) => void;
  minimizedLabel: string | null;
  onRestore: () => void;
}) {
  return (
    <div className="bg-candy relative flex h-full flex-col items-center justify-center px-6 text-center text-white">
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/80">
        {PORTFOLIO_CONFIG.terminal.osName}
      </span>
      <h3 className="mt-3 text-[30px] font-semibold tracking-tightest sm:text-[40px]">
        {PROJECTS.length} systems &amp; emulator builds.
      </h3>

      <div className="mt-6 flex max-w-lg flex-wrap items-center justify-center gap-2">
        {PROJECTS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onOpen(p.id)}
            className="rounded-full bg-white/15 px-3 py-1.5 font-mono text-[12px] text-white backdrop-blur transition-colors hover:bg-white/30"
          >
            {p.title}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onStart}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-mono text-[14px] font-medium text-accent shadow-lg transition-transform hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
      >
        ▶ Click to view projects
      </button>
      <p className="mt-3 font-mono text-[11px] text-white/70">
        opens a terminal — supports Tab completion &amp; neofetch
      </p>

      {/* minimized window dock */}
      {minimizedLabel && (
        <button
          type="button"
          onClick={onRestore}
          className="absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/25 px-4 py-2 font-mono text-[12px] text-white backdrop-blur transition-colors hover:bg-black/40"
        >
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" aria-hidden />
          {minimizedLabel} — click to restore
        </button>
      )}
    </div>
  );
}
