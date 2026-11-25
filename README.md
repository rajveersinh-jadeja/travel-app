# Travel & Lifestyle 🗺️✨

> **Mobile-First Social Map & Visual Travel Journal**  
> Connect coordinates, pin photo memories with close friends, and explore collaborative multi-stop trip routes on an Apple Maps-inspired canvas.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF)](https://vitejs.dev/)

---

## 🌟 Overview

Unlike algorithm-driven social feeds or plain text-pin maps, **Travel & Lifestyle** makes your friends' real-world locations and connected trip routes the primary interface for discovery and memory journaling.

### Key Visual & Design Philosophy
- **Apple-Inspired Warm Minimalism**: Warm off-white canvas (`#EFEEEB`), elevated cards (`#FFFFFF`), high-contrast charcoal typography (`#18181B`), and an azure accent (`#1A94FF`) strictly for routes and active highlights.
- **Signature Map Pins**: Rounded-rectangle photo thumbnails (`12px` radius, `2.5px` white border, drop shadow) featuring an overlapping circular user avatar badge.
- **Ultra High-DPI Retina Map**: Pastel blue water, sage green parks, and clean ivory roads with zero POI clutter.
- **Nimbus UI Liquid Glass Navbar ("Waterline")**: Pill of water with custom WebGL shader, fluid drop physics, and Web Audio API synthesized audio tap feedback (`plip`).
- **Glass Folder Cards**: 3-layer frosted glass physical folders with procedural domain-warped noise artwork (Aurora, Ember, Dusk, Glacier, Verdant) that lean forward on hover and fan out photo sheets when tapped.

---

## 📱 Features & Screens

1. **Live World Map (Home Tab)**
   - Full-bleed Retina vector tile map with custom color grading.
   - Connected trip route polyline across San Francisco, Bali, Norway, and Tokyo.
   - Multi-photo bottom sheet with smooth slide-up animation, photo gallery carousel, companion badges, and interactive emoji reactions.
   - Floating Apple Maps search pill with 1-tap location filters (San Francisco, Bali, Lofoten, Tokyo).
   - Apple-style squircle controls: compass button, zoom, and layer style selector.

2. **Travel Passport & Visual Journal (Passport Tab)**
   - Explorer profile header with real-time stats: **14 Countries · 38 Cities · 142 Memory Pins**.
   - **Interactive Glass Folder Albums**:
     - 🌴 *Bali Island Traverse* (`ember` procedural liquid art, 3 photo stops, route deep-link).
     - 🏔️ *Lofoten Roadtrip* (`aurora` liquid art, 4 photo stops, `+` button).
     - 🏮 *Tokyo Neon Nights* (Smoked obsidian glass, `dusk` art).

3. **Mobile & Ergonomic Polish**
   - **Dynamic Viewport Height (`100dvh`)**: Immune to mobile address bar collapse in Safari & Chrome.
   - **iOS Safe-Area Support**: Padding for notch, dynamic island, and home swipe indicator (`pt-safe`, `pb-safe`).
   - **Adaptive Compact Navbar**: Automatically collapses into a 220px icon-only waterline pill on mobile viewports.
   - **Simulated iPhone 16 Pro Frame**: Toggle between desktop Full-Screen and a realistic mobile device frame.

---

## 🛠️ Project Structure

```text
travel-app/
├── components/               # Root shadcn mirror
│   └── ui/
│       ├── demo.tsx
│       ├── glass-folder-cards-demo.tsx
│       ├── glass-folder-cards.tsx
│       └── liquid-glass-navbar.tsx
├── src/
│   ├── components/
│   │   ├── Layout/          # AppShell & device mockup
│   │   ├── Map/             # LiveWorldMap & PinDetailSheet
│   │   ├── Navigation/      # SearchPill & BottomTabBar
│   │   └── ui/              # shadcn UI primitives (LiquidNavbar, GlassFolder)
│   ├── data/                # Mock pins, trips & user data
│   ├── lib/                 # shadcn cn() utility
│   ├── types/               # TypeScript interfaces
│   ├── App.tsx              # Primary state & screen controller
│   ├── index.css            # Tailwind & Apple Maps color grading
│   └── main.tsx             # Entry point & Leaflet CSS bundle
├── components.json          # shadcn CLI configuration
├── tailwind.config.js       # Design tokens & color palettes
├── tsconfig.json            # Path alias (@/* -> ./src/*)
└── vite.config.ts           # Bundler & alias configuration
```

---

## 🚀 Quick Start

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/rajveersinh-jadeja/travel-app.git
cd travel-app
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open **`http://localhost:3000/`** in your browser.

### 3. Build for Production
```bash
npm run build
```
Generates a zero-error, minified bundle in `dist/`.

---

## 📄 License
MIT © Rajveer Jadeja
