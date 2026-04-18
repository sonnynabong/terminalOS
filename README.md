# TerminalOS

**TerminalOS** is a retro-futuristic, fully-interactive command-line web operating system. It brings classic terminal vibes (Phosphor green, amber CRTs) directly into the modern browser. All user interaction happens purely via typing commands in an interface designed to mimic classical TTY inputs, complete with simulated screen refresh delays, authentic scanlines, hardware glow, and an immersive UNIX-like environment.

## 🚀 Features

- **Islands Architecture**: Built with Astro 6 in SSG Mode. The entire application is powered by an ultra-fast, isolated React 19 island.
- **Persistent Virtual Filesystem**: A full hierarchical in-memory filesystem tree (`/home/user/...`) seamlessly synced to the browser's `IndexedDB` backend. Create folders and files that survive page refreshes!
- **CRT Aesthetics**: High-fidelity CSS visualizations mimicking classic hardware, including TV power-on sequence, scanlines, barrel distortion vignettes, screen flicker, and multiple phosphor color themes.
- **Buttery Smooth Animations**: Satisfying typing and line generation, block cursor blink simulation, and fluid typewriter text.
- **Command Engine**: A tokenizing command parser that translates commands into robust functional execution. Includes Tab-autocomplete and Arrow Up/Down command history!
- **Windowed Applications**: Break out of standard standard prompt outputs and launch full-featured "windowed" apps inside the terminal.

## 🛠 Tech Stack

- **Framework**: Astro 6.x
- **UI Engine**: React 19 (`client:only`)
- **State Management**: Nanostores (`@nanostores/react`) — fast, decoupled, global state stores.
- **Storage**: `idb-keyval` — lightweight Promise-based wrapper over IndexedDB.
- **Styling**: Vanilla CSS with comprehensive CSS custom properties for theming.

## 💻 Included Commands & Apps

TerminalOS ships with a robust command registry out-of-the-box:

**Filesystem Commands:**
- `ls` / `cd` / `pwd` / `mkdir` / `touch` / `cat`

**System Operations:**
- `help` / `clear` / `whoami` / `date` / `uptime` / `echo`

**Settings & Personalization:**
- `theme [green|amber|blue|white]` — Instantly swaps the CRT beam color theme.
- `fontsize [pt]` — Adjust the entire terminal scale.
- `effects [on|off]` — Toggles CRT noise and scanlines.

**Fun Enhancements:**
- `neofetch` / `matrix` / `cowsay` / `fortune` / `figlet`

**Full Applications:**
Type `open <app_name>` to launch an application!
- `nano`: Fully interactive file editor. Save to the virtual filesystem using `^O` and exit with `^X`. 
- `htop`: Graphical simulated CPU / MEM resource monitor.
- `snake`: Classic 20x20 grid Snake game controlled by arrow keys.
- `calc`: Evaluative inline calculator with history.

## 📦 Getting Started

Since TerminalOS runs perfectly client-side (Static Site Generation), running it is a breeze.

### Prerequisites

- Node.js (v18+)
- npm (v9+)

### Installation

1. Clone the repository and install the NPM packages:
```bash
npm install
```

2. Start the Vite development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:4321`. Let the boot sequence finish, and start typing!

## 🔧 Building for Production

Compile a highly-optimized static bundle into the `/dist` directory.

```bash
npm run build
```

This output can be hosted practically anywhere (Vercel, Netlify, Cloudflare Pages, GitHub pages, or native Nginx servers) without a necessary backend infrastructure.
