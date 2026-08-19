"use client";

import { useState, useEffect, useRef } from "react";

interface DoomPlayerProps {
  onExit?: () => void;
  onReady?: () => void;
}

interface InstallStep {
  text: string;
  delay: number;
  type?: "info" | "success" | "pkg" | "bar";
}

const INSTALL_SCRIPT: InstallStep[] = [
  { text: "$ sudo apt-get update && apt-get install -y doom-engine-wasm doom-wad", delay: 100, type: "pkg" },
  { text: "Hit:1 https://deb.danish.dev/danishos stable InRelease", delay: 250, type: "info" },
  { text: "Get:2 https://deb.danish.dev/danishos stable/main wasm-emulators [1,808 kB]", delay: 350, type: "info" },
  { text: "Get:3 https://deb.danish.dev/danishos stable/main doom-wad-shareware [5,482 kB]", delay: 450, type: "info" },
  { text: "Fetched 7,290 kB in 0.4s (18.2 MB/s)", delay: 300, type: "info" },
  { text: "Reading package lists... Done", delay: 200, type: "info" },
  { text: "Building dependency tree... Done", delay: 200, type: "info" },
  { text: "Selecting previously unselected package doom-engine-wasm.", delay: 200, type: "pkg" },
  { text: "(Reading database ... 24192 files and directories currently installed.)", delay: 200, type: "info" },
  { text: "Preparing to unpack .../doom-engine-wasm_1.9_wasm32.deb ...", delay: 250, type: "info" },
  { text: "Unpacking doom-engine-wasm (1.9-jit-x86) ...", delay: 300, type: "pkg" },
  { text: "Setting up wdosbox-jit-runtime (6.22.60) ...", delay: 300, type: "info" },
  { text: "[  OK  ] Initialized WebAssembly SoundBlaster16 & OPL3 synthesizer.", delay: 250, type: "success" },
  { text: "[  OK  ] Allocated 16 MB virtual EMS/XMS memory bank.", delay: 200, type: "success" },
  { text: "[  OK  ] Mounted /dev/vga0 SDL2 hardware surface (320x200 @ 60 FPS).", delay: 200, type: "success" },
  { text: "Setting up doom-wad (shareware v1.9) ...", delay: 250, type: "info" },
  { text: "Extracting DOOM.EXE and DOOM.WAD to virtual C:\\ ...", delay: 300, type: "bar" },
  { text: "Processing triggers for man-db (2.10.2-1) ...", delay: 200, type: "info" },
  { text: "Installation complete. Starting DOOM in Fullscreen mode...", delay: 400, type: "success" },
];

export default function DoomPlayer({ onExit, onReady }: DoomPlayerProps) {
  const [isGraphicsReady, setIsGraphicsReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Listen for engine events from the DOOM iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === "DOOM_EXIT") {
        console.log("[DoomPlayer] Received DOOM_EXIT event from game core:", e.data);
        if (onExit) onExit();
      } else if (e.data && e.data.type === "DOOM_GRAPHICS_READY") {
        console.log("[DoomPlayer] Received DOOM_GRAPHICS_READY event! Full VGA graphics active.");
        setIsGraphicsReady(true);
        if (onReady) onReady();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onExit, onReady]);

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const iframeSrc = `${basePath}/doom/index.html`;

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-black font-mono text-white">
      <iframe
        ref={iframeRef}
        src={iframeSrc}
        title="DOOM WebAssembly Player"
        className={`h-full w-full border-0 transition-opacity duration-300 ${isGraphicsReady ? "opacity-100" : "opacity-0"}`}
        allow="autoplay; fullscreen; gamepad"
        onLoad={() => {
          iframeRef.current?.focus();
          iframeRef.current?.contentWindow?.focus();
        }}
      />
    </div>
  );
}
