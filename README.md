# Md. Danish — Portfolio

This is my personal developer portfolio. I am a Systems & Software Engineer (B.Tech CS undergrad at VIT Bhopal, 2024–2028) and open-source software builder specializing in WebAssembly JIT engines, bare-metal MCU emulators (ARM Cortex-M, Xtensa LX6, RISC-V), hardware security tools, and low-level developer toolchains.

---

## 🚀 Key Highlights & Work Experience

### **Software Engineer Intern — FOSSEE, IIT Bombay** *(Remote, 2026)*
- Led an 18-person team over 3 months, architecting the platform across 10 repositories and authoring 554 commits with 236 merged PRs.
- Shipped **OpenHW Studio** from scratch to public production hosted at [openhw-studio.fossee.in](https://openhw-studio.fossee.in).

---

## 🛠️ Featured Engineering Projects

- **OpenHW Studio (Browser-Based Embedded Systems Simulator)**
  - *Tech:* Rust (WASM), TypeScript, React, Node.js, Web Workers, Docker.
  - Rust-WASM Manhattan autowiring & Auto-Fix engine generating dynamic SVG splines and C++ code.
  - Slashed build latency from ~8s to <200ms via SHA-1 cache (IndexedDB/RAM) across Docker AVR/STM32/RP2040 images.
  - Integrated Rust-WASM autograding engine and cycle-budgeted Wi-Fi/WebSocket stack (CYW43 SPI, ESP32/Pico W).

- **Bare-Metal MCU Emulator Suite (ARM Cortex-M, Xtensa & RISC-V)**
  - *Tech:* Rust, WebAssembly, Unicorn (QEMU), C/C++, TypeScript, Node.js.
  - **STM32F103 (Cortex-M3):** Emulates full silicon at 5.1M inst/sec (browser) & 24M/sec (headless) running real STM32duino firmware.
  - **STM32F407 (Cortex-M4):** Paired Unicorn WASM with Rust peripheral model & Ethernet MAC, booting DOOM in-browser at ~25 FPS.
  - **ESP32 (Xtensa LX6):** Dual-core boot ROM & ESP-IDF firmware with zero-overhead Rust-WASM MMIO dispatch.
  - **ESP32-C6 (RISC-V) & NPM:** RV32IMAC SoC emulator for arduino-cli merged.bin images; published all 4 engines on npm.

- **Ankur (CNAMS) Child Growth & Malnutrition Screening System**
  - *Tech:* Embedded C++, BLE, Flutter, Next.js 14, TypeScript.
  - On-device WHO LMS z-scores computation (WAZ/HAZ/WHZ/MUAC) classifying SAM/MAM/normal without network dependency.
  - Automated field measurements by bridging BLE weighing hardware directly into field app records.

- **ESP32-S3 Hardware Security Key, HID Console & KVM Bridge**
  - *Tech:* Embedded C++, FreeRTOS, WebAuthn / CTAP 2.1, AES-256-GCM, TinyUSB, Python.
  - W3C WebAuthn / CTAP 2.1 passkey generator & official YubiKey 5 emulation (recognized by ykman & KeePassXC).
  - AES-256-GCM zero-knowledge password vault (100,000 PBKDF2 iterations) with live TOTP auto-fill.
  - Custom 16-byte UDP KVM protocol with dual-core FreeRTOS architecture achieving sub-frame input latency.

---

## 🧰 Technical Skills

- **Languages:** C, C++, Rust, Python, TypeScript / JavaScript, Java, SQL, ARM/RISC-V Assembly
- **Embedded & Systems:** Embedded C++, STM32duino, FreeRTOS, ARM Cortex-M, Xtensa, RISC-V, BLE, Wi-Fi stacks
- **Web & Tooling:** React, Next.js, Node.js, WebAssembly, Web Workers, Docker, FastAPI, Streamlit, Git, GitHub Actions CI/CD
- **ML & Data:** TensorFlow, TensorFlow Lite, OpenCV, Pandas, NumPy, Matplotlib, Random Forests, Model Deployment

---

## 📄 Resume & Download

- **Resume (PDF):** Downloadable from [`/resume/Md-Danish-Resume.pdf`](public/resume/Md-Danish-Resume.pdf)

---

## 🌐 Connect & Links

- **Email:** [9661346164h@gmail.com](mailto:9661346164h@gmail.com)
- **GitHub:** [@danish9661](https://github.com/danish9661)
- **LinkedIn:** [md-danish966](https://www.linkedin.com/in/md-danish966)
- **npm:** [~danish9661](https://www.npmjs.com/~danish9661)

---

## 💻 Running Locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```
