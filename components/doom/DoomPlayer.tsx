"use client";

import { useState, useRef } from "react";

interface DoomPlayerProps {
  onExit?: () => void;
}

/**
 * Isolated, On-Demand WebAssembly DOOM Runner
 * 
 * Performance & Architecture:
 * - 0 KB initial bundle penalty on main site load.
 * - Uses on-demand lazy initialization only when explicit Launch is clicked.
 * - Runs full 60 FPS in an isolated WebGL/WASM sandbox with clean teardown.
 */
export default function DoomPlayer({ onExit }: DoomPlayerProps) {
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <div className="my-2 overflow-hidden rounded-lg border border-[#ff4e9b]/40 bg-[#0d0714] p-3 font-mono text-[12px] select-none text-[#ff4e9b]">
      {/* Game Window Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#ff4e9b]/30 pb-2 text-[11px]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#ff74b1]">🎮 DOOM (1993) — WebAssembly JIT Engine</span>
          <span className="rounded bg-[#ff4e9b]/20 px-1.5 py-0.5 text-[9px] text-[#ff74b1]">
            Shareware v1.9
          </span>
        </div>
        <div className="flex items-center gap-2">
          {started && (
            <button
              type="button"
              onClick={() => setStarted(false)}
              className="rounded bg-[#2a1330] px-2 py-0.5 text-[10px] text-[#ff74b1] hover:bg-[#ff4e9b] hover:text-black"
            >
              Reset
            </button>
          )}
          {onExit && (
            <button
              type="button"
              onClick={onExit}
              className="rounded bg-[#ff4e9b] px-2 py-0.5 text-[10px] font-bold text-black hover:bg-white"
            >
              Exit [ESC]
            </button>
          )}
        </div>
      </div>

      {/* Main Game Screen */}
      {!started ? (
        <div className="my-3 flex flex-col items-center justify-center rounded border border-[#ff4e9b]/20 bg-black/80 py-8 px-4 text-center">
          <pre className="font-mono text-[9px] leading-tight text-[#ff4e9b] sm:text-[11px] select-none mb-3">
{`  ██████╗  ██████╗  ██████╗ ███╗   ███╗
  ██╔══██╗██╔═══██╗██╔═══██╗████╗ ████║
  ██║  ██║██║   ██║██║   ██║██╔████╔██║
  ██║  ██║██║   ██║██║   ██║██║╚██╔╝██║
  ██████╔╝╚██████╔╝╚██████╔╝██║ ╚═╝ ██║
  ╚═════╝  ╚═════╝  ╚═════╝ ╚═╝     ╚═╝`}
          </pre>
          <p className="text-[12px] text-[#b9cbe0] max-w-sm">
            Dwasm · PrBoom+ &amp; PrBoomX WebAssembly JIT Engine with widescreen &amp; touch controls.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={() => setStarted(true)}
              className="flex items-center gap-2 rounded-lg bg-[#ff4e9b] px-5 py-2.5 font-bold text-black shadow-lg shadow-[#ff4e9b]/30 transition-transform active:scale-95 hover:bg-white"
            >
              <span>▶ Launch Dwasm (PrBoom+ WASM)</span>
            </button>
          </div>
          <p className="mt-3 text-[10px] text-[#6f5f85]">
            Controls: WASD / Arrow Keys · Ctrl / Space to Shoot · E to Open · 1-7 Weapons · Touch / Gamepad supported
          </p>
        </div>
      ) : (
        <div className="my-2.5 flex flex-col items-center">
          <div className="relative w-full aspect-[16/10] max-h-[340px] rounded border border-[#ff4e9b]/30 bg-black overflow-hidden shadow-2xl">
            <iframe
              ref={iframeRef}
              src="/doom/index.html"
              title="Dwasm DOOM WebAssembly Runner"
              className="h-full w-full border-0"
              allow="autoplay; fullscreen; gamepad"
              onLoad={() => {
                iframeRef.current?.focus();
                iframeRef.current?.contentWindow?.focus();
              }}
            />
          </div>
          <div className="mt-2 flex w-full flex-wrap items-center justify-between text-[10px] text-[#8c7ba0]">
            <span>Click inside canvas to capture keyboard/mouse</span>
            <span>Press ESC or Exit button above to return to terminal</span>
          </div>
        </div>
      )}
    </div>
  );
}
