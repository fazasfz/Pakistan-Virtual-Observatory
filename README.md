### Virtual Astronomy Observatory (VAO)
**National Center of GIS and Space Applications (NCGSA) — Space & Astrophysics Research Lab (SARL) - Institute of Space Technology (IST) - Pakistan** 

---

## 🌌 1. Executive Summary & Mission

The **Virtual Astronomy Observatory (VAO)** is an advanced digital astrophysics platform designed to advance astronomical exploration, live space telemetry analysis, planetary observation planning, and AI-assisted astrophysical research.

Developed under the **Space & Astrophysics Research Laboratory (SARL)** within the **National Center of GIS and Space Applications (NCGSA)** at the **Institute of Space Technology (IST)**, VAO bridges the gap between raw scientific datasets and interactive observational astrophysics.

### Key Capabilities:
- **Real-Time Space Weather Monitoring**: Direct feeds from NOAA SWPC and NASA SDO instruments for solar flare indices, coronal loop imagery, planetary Kp indices, and solar wind velocity.
- **Precision Ephemeris & Orbital Mechanics**: High-accuracy planetary and lunar calculations powered by NASA/JPL SPICE kernels (`de440s.bsp`) and Keplerian N-body orbit simulators.
- **High-Resolution 3D Lunar & Planetary Visualization**: Topographic lunar globe with USGS crater gazetteers, real-time libration, and phase illumination.
- **Deep Sky Astrophotography & Catalogs**: Seamless catalog querying across NASA/IPAC Extragalactic Database (NED), Barbara A. Mikulski Archive for Space Telescopes (MAST), and SIMBAD Astronomical Database.
- **AI-Powered AstroCopilot Intelligence**: Real-time server-sent streaming assistant for interactive equation derivation (LaTeX / KaTeX), spectral analysis, and astronomical calculation validation.
- **Dark Sky GIS Planning**: Interactive Bortle dark sky index mapping combined with NASA GIBS near-real-time satellite day/night imagery for ground observation planning.

---

## 🏗️ 2. System Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                PVAO Frontend Client                                    │
│       React 18 • Vite • Vanilla CSS Modules • Three.js WebGL • KaTeX • Recharts        │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ Unified REST APIs & SSE Streams (:8000)
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        VAO Unified Central Backend & SPA Host                          │
│               FastAPI • JPL Horizons • Gemini / Groq • Beanie / Motor ODM              │
├──────────────────────────────────────────────────────────┬─────────────────────────────┤
│ 🛰️ Observatory Science Modules                          │ 🤖 AstroCopilot Core        │
├──────────────────────────────────────────────────────────┼─────────────────────────────┤
│ • NOAA SWPC Space Weather Feeds                          │ • Streaming Gemini LLM      │
│ • NASA Open APIs (APOD, EPIC, Horizons ephemeris)        │ • Groq Llama Fallback       │
│ • SIMBAD & MAST Deep Sky Query Engine                    │ • Instant Glossary Caching  │
│ • USGS Lunar Gazetteer & 3D Ephemeris                    │ • MongoDB Query Cache       │
│ • Single Monolithic Static SPA Hosting (/ & /assets)     │ • Token Stream Generators   │
└──────────────────────────────────────────────────────────┴─────────────────────────────┘
```

---

## 📂 3. Complete Repository Structure & File Directory Map

```
ncgsa-virtual-observatory/
│
├── README.md                                 # Master documentation (Virtual Astronomy Observatory)
│
├── pvao-backend/                             # Central FastAPI server & scientific computing engine
│   ├── main.py                               # Root ASGI entry point (uvicorn main:app)
│   ├── app/
│   │   ├── core/                             # Core configuration & database layer
│   │   │   ├── config.py                     # App settings, API prefixes, and environment variables
│   │   │   └── database.py                   # MongoDB initialization via Beanie ODM
│   │   ├── integrations/                     # External scientific API integrations
│   │   │   ├── nasa_client.py                # NASA Open APIs client (APOD, Horizons ephemeris)
│   │   │   └── noaa_client.py                # NOAA SWPC live solar wind and geomagnetic client
│   │   ├── modules/                          # Domain-specific backend modules
│   │   │   ├── astro_copilot/                # AI copilot reasoning and streaming engine
│   │   │   │   ├── router.py                 # Streaming endpoint (/api/ask, /api/v1/astrocopilot)
│   │   │   │   ├── schemas.py                # Pydantic models for query requests
│   │   │   │   ├── llm_service.py            # Gemini 2.5 streaming & Groq fallback
│   │   │   │   ├── knowledge_service.py      # Local astrophysics glossary lookup
│   │   │   │   ├── db_service.py             # MongoDB async query response caching
│   │   │   │   └── data/glossary.json        # Curated astronomical knowledge dictionary
│   │   │   ├── astronomical_probe_tracker/   # Deep-space probe telemetry & state vectors
│   │   │   │   ├── router.py                 # Probe tracking endpoints (/api/v1/astronomical-probe-tracker)
│   │   │   │   ├── schemas.py                # Pydantic schemas for trajectories and telemetry
│   │   │   │   └── service.py                # Live NASA JPL Horizons state vector telemetry
│   │   │   ├── deep_sky_explorer/            # Deep-sky celestial search & imagery proxy
│   │   │   │   ├── router.py                 # Deep sky endpoints (/api/v1/deep-sky-explorer)
│   │   │   │   └── service.py                # SIMBAD / MAST catalog resolution and coordinate lookup
│   │   │   ├── lunar_observatory/            # Lunar surface features & phase calculations
│   │   │   │   ├── router.py                 # Lunar endpoints (/api/v1/lunar-observatory)
│   │   │   │   ├── schemas.py                # Crater models and surface geology schemas
│   │   │   │   └── service.py                # USGS dataset querying and lunar phase computations
│   │   │   └── solar_observatory/            # Live space weather & solar cycle telemetry
│   │   │       ├── router.py                 # Solar endpoints (/api/v1/solar-observatory)
│   │   │       ├── schemas.py                # Sunspot, solar wind, and geomagnetic schemas
│   │   │       └── service.py                # NOAA SWPC data fetching and cycle smoothing
│   │   ├── api_router.py                     # Master API router mounting all module routers under /api/v1
│   │   └── main.py                           # FastAPI ASGI entry point, CORS configuration, static SPA mounting
│   ├── scripts/                              # Backend data ingest and processing utilities
│   │   ├── generate_hotspots.py              # Computes 3D coordinates for major lunar landing sites
│   │   └── parse_usgs_gazetteer.py           # Parser for USGS planetary nomenclature CSV/JSON datasets
│   ├── tests/                                # Automated unit and integration test suite
│   │   └── conftest.py                       # Pytest fixtures and mock client configurations
│   ├── requirements.txt                      # Python dependencies for central backend & AstroCopilot
│   ├── .env.example                          # Backend environment variable template
│   └── .gitignore                            # Backend Git ignore rules
│
├── pvao-frontend/                            # High-performance React 18 single page application
│   ├── public/                               # Public assets, 3D glTF models, fonts, and favicon
│   ├── src/
│   │   ├── api/                              # Central API callers
│   │   │   ├── axiosClient.js                # Axios instance dynamically pointing to VITE_API_URL
│   │   │   └── nasaApi.js                    # NASA APOD fetcher with fallback cosmic imagery
│   │   ├── app/                              # Next.js App Router compatibility layer
│   │   │   └── astrocopilot/
│   │   │       └── page.jsx                  # Full-viewport workspace route wrapper
│   │   ├── assets/                           # Compressed imagery, space textures, and institute branding
│   │   ├── components/                       # Reusable visual components
│   │   │   └── common/
│   │   │       ├── AstroCopilot/             # Floating trigger button component
│   │   │       │   ├── AstroCopilotTrigger.jsx        # Floating robot action button
│   │   │       │   ├── AstroCopilotTrigger.module.css  # Ambient glow pulse rings & tooltips
│   │   │       │   ├── astroCopilotApi.js             # Native Fetch Streams API caller
│   │   │       │   └── index.jsx                      # Component barrel export
│   │   │       ├── Footer/                   # Global observatory footer with SARL/NCGSA links
│   │   │       ├── Navbar/                   # Top navigation bar, search modal & mobile drawer
│   │   │       ├── LoadingOverlay/           # Cosmic starfield loader with fun facts
│   │   │       └── SectionHeading/           # Standardized observatory section headings
│   │   ├── context/                          # React context providers
│   │   │   └── AstroCopilotContext.jsx       # Global copilot navigation state
│   │   ├── data/                             # Curated astronomical datasets
│   │   │   └── glossaryData.json             # 100+ astronomical terms, formulas, and definitions
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx                # Primary layout shell (Navbar, Main Content, Footer, Floating Trigger)
│   │   ├── modules/                          # Primary observatory modules
│   │   │   ├── astronomicalProbeTracker/     # Real-time probe telemetry visualizer
│   │   │   ├── deepSkyExplorer/              # Deep sky celestial catalog and imagery viewer
│   │   │   ├── earthView/                    # Bortle dark sky index map & NASA GIBS satellite overlay
│   │   │   ├── exora/                        # Exoplanet discovery & habitability analyzer
│   │   │   ├── lunarObservatory/             # Interactive 3D lunar globe with USGS crater search
│   │   │   ├── observationPlanner/           # Telescope observation scheduler and target planner
│   │   │   ├── solarObservatory/             # Live solar wind telemetry, sunspots, and SDO view
│   │   │   ├── solarSystemSimulator/         # 3D Keplerian planetary motion simulator
│   │   │   └── zenith/                       # Virtual planetarium sky portal with star charts
│   │   ├── pages/                            # Top-level application views
│   │   │   ├── astroCopilot/                 # Dedicated AstroCopilot Workspace page
│   │   │   │   ├── AstroCopilotWorkspace.jsx          # Full-canvas chat layout & stream handler
│   │   │   │   ├── AstroCopilotWorkspace.module.css   # Dark obsidian workspace styling
│   │   │   │   ├── ChatMessage.jsx                   # Markdown + KaTeX formula message bubble
│   │   │   │   └── ChatMessage.module.css            # Bubble typography, math display, cursor animation
│   │   │   ├── astrocopilot.jsx              # Next.js Pages Router route wrapper
│   │   │   ├── credits/                      # SARL & NCGSA research supervisor and intern credits
│   │   │   ├── dataSources/                  # Academic citations and astronomical data sources
│   │   │   ├── glossary/                     # Interactive astrophysics glossary search page
│   │   │   └── landing/                      # Observatory home landing page with module previews
│   │   ├── routes/
│   │   │   ├── AppRoutes.jsx                 # Centralized React Router v6 configuration
│   │   │   └── routePaths.js                 # Central route path constants
│   │   ├── styles/                           # Global stylesheets & design system
│   │   │   ├── breakpoints.css               # Responsive media query mixins
│   │   │   ├── globals.css                   # Global resets, Inter font loading, KaTeX imports
│   │   │   └── variables.css                 # Design tokens (obsidian, brass, starlight, lunar blue)
│   │   ├── utils/                            # Astronomy math & coordinate conversion utilities
│   │   ├── App.jsx                           # Root React entry component
│   │   └── main.jsx                          # Vite mount point with KaTeX CSS integration
│   ├── .npmrc                                # NPM config with legacy-peer-deps for seamless deployment
│   ├── package.json                          # Frontend package configuration and scripts
│   ├── vite.config.js                        # Vite bundler configuration
│   ├── .env.example                          # Frontend environment variable template
│   └── .gitignore                            # Frontend Git ignore rules
│
└── scripts/                                  # Repository maintenance and data preparation utilities
    ├── crop_map.py                           # Satellite and celestial texture map cropping tool
    └── dedupe_lunar_curated.py               # Lunar crater dataset validation and deduplication
```

---

## 🔭 4. Detailed Module Breakdown

### 1. AstroCopilot Intelligence Workspace (`/astrocopilot`)
- **Native JavaScript Streams API**: Consumes raw server-sent text streams directly from the unified backend using `ReadableStream.getReader()` and `TextDecoder`.
- **Mathematical & Formula Rendering**: Real-time evaluation and rendering of complex mathematical physics formulas using `react-markdown`, `remark-math`, and `rehype-katex`.
- **Observation History & Session Management**: Left-hand sidebar displaying recent observation sessions, telemetry engine status, and quick catalog links.
- **Scoped Auto-Scrolling**: Container-scoped scrolling keeping users anchored to streaming tokens without disrupting page flow.

### 2. Solar Observatory (`/solar-observatory`)
- **Live Space Weather Telemetry**: Tracks real-time Solar Wind Velocity ($km/s$), Proton Density ($p/cm^3$), X-ray Flux Class, and Planetary Kp geomagnetic index.
- **Solar Cycle 25 Progression**: Composed Recharts visualization tracking historical and current smoothed Sunspot Numbers (SSN) with solar maximum projections.
- **Multi-Wavelength Solar Views**: AIA 171 Å extreme ultraviolet imagery showing active coronal loops and magnetic reconnection zones.

### 3. Lunar Observatory (`/lunar-observatory`)
- **3D Topographical Moon Model**: Interactive WebGL lunar globe with accurate normal maps and topographic elevation.
- **Curated USGS Crater Gazetteer**: Search and inspect lunar craters, maria, mountain ranges, and historic Apollo / Luna landing sites.
- **Phase & Libration Telemetry**: Real-time calculation of lunar illumination, phase angle, and apparent altitude.

### 4. Deep Sky Explorer (`/deep-sky-explorer`)
- **Messier & NGC Catalogs**: Categorized database of Nebulae (emission, planetary, dark), Open and Globular Star Clusters, and Galaxies.
- **Astronomical Data Lookup**: Real-time proxy queries to SIMBAD and MAST for celestial coordinates, radial velocity, spectral type, and parallax.

### 5. Zenith Virtual Planetarium (`/zenith`)
- **Interactive Star Chart**: Real-time hemispheric sky dome with constellation boundary lines, Bayer designation star mapping, and equatorial grid coordinates.
- **Live Observer Telemetry**: Computes local sidereal time, altitude, azimuth, and celestial object transit times for Pakistan's coordinates.

### 6. Solar System Simulator (`/solar-system-simulator`)
- **Keplerian Orbital Mechanics**: Accurate orbital simulations of the 8 major planets and dwarf planets around the Sun.
- **Orbital Resonance & Ephemeris**: Semi-major axis, eccentricity, inclination, and orbital period telemetry.

### 7. Astronomical Probe Tracker (`/astronomical-probe-tracker`)
- **Deep Space Trajectories**: Real-time tracking of humanity's furthest voyagers directly through NASA JPL Horizons:
  - *Voyager 1 & Voyager 2* (Interstellar Space)
  - *Parker Solar Probe* (Inner Heliosphere & Perihelion)
  - *James Webb Space Telescope* (Sun-Earth $L_2$ Lagrange Point)
  - *New Horizons* (Kuiper Belt)
  - *International Space Station (ISS)* & *Hubble Space Telescope*

### 8. Earth View & Observation Planner (`/earth-view`, `/observation-planner`)
- **Bortle Dark Sky Rating**: Geographic light pollution mapping to help astronomers find optimal dark-sky observation locations.
- **NASA GIBS Live Layer**: Day/night satellite photography overlay for cloud cover and atmospheric transparency assessment.

### 9. Academic Data Sources & Astronomical Glossary (`/glossary`, `/data-sources`)
- **100+ Astrophysics Definitions**: Searchable glossary covering celestial mechanics, spectroscopy, stellar evolution, and cosmology.
- **Data Integrity**: Transparent citations for all scientific ephemeris models and space agency feeds.

---

## ⚡ 5. Quickstart & Local Execution Guide

### Prerequisites
- **Node.js**: `v18.0.0+` (LTS recommended)
- **Python**: `v3.10+` or `v3.11+`
- **MongoDB**: (Optional, for persistent query caching)

---

### Step 1: Start Central Backend Server (`pvao-backend`)

```bash
# Navigate to backend folder
cd pvao-backend

# Create and activate Python virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies (FastAPI, Google GenAI, Groq, Astroquery, etc.)
pip install -r requirements.txt

# Start unified server on port 8000
uvicorn main:app --reload --port 8000
```
- **API Base**: `http://localhost:8000`
- **Swagger Documentation**: `http://localhost:8000/docs`
- **ReDoc Documentation**: `http://localhost:8000/redoc`

---

### Step 2: Start Frontend Application (`pvao-frontend`)

```bash
# Navigate to frontend folder
cd ../pvao-frontend

# Install frontend dependencies
npm install

# Start Vite development server
npm run dev
```
Open **`http://localhost:5173`** in your browser.

*(Or build the frontend static files with `npm run build` and access the entire platform directly at `http://localhost:8000/`)*.

---

## 🚀 6. Production Deployment Guide (Single Web Service on Render)

Deploy the entire platform (Frontend UI + Observatory Central APIs + AstroCopilot AI) as **1 Single Web Service** on [Render.com](https://render.com):

1. Create a **New Web Service** pointing to your repository `https://github.com/fazasfz/Pakistan-Virtual-Observatory.git`.
2. Configure service settings:
   - **Environment**: `Python 3`
   - **Build Command**:
     ```bash
     cd pvao-frontend && npm install && npm run build && cd ../pvao-backend && pip install -r requirements.txt
     ```
   - **Start Command**:
     ```bash
     cd pvao-backend && uvicorn main:app --host 0.0.0.0 --port $PORT
     ```
3. Set your **Environment Variables**:
   - `GEMINI_API_KEY`: *(Your Google Gemini API Key)*
   - `GROQ_API_KEY`: *(Your Groq API Key for fallback)*
   - `NASA_API_KEY`: *(DEMO_KEY or your NASA Developer Key)*
   - `MONGODB_URI`: *(Your MongoDB connection string, or mongodb://127.0.0.1:27017)*

Your deployment will be live at a single link: **`https://pvao.onrender.com/`**!

---

## 👥 7. Research Team & Academic Credits

The **Virtual Astronomy Observatory (VAO)** is developed under the auspices of:
- **National Center of GIS and Space Applications (NCGSA)**
- **Space & Astrophysics Research Lab (SARL)**
- **Institute of Space Technology (IST), Islamabad, Pakistan**

### Scientific & Research Supervisors:
- **Yawar Abbas** — *Scientific Supervisor (NCGSA / IST)*
- **Muhammad Junaid** — *Research Supervisor (NCGSA / IST)*

### Core Engineering & Research Team:
- **Syeda Fatima Zahra** — *Engineering Intern (Core Architecture, Frontend Layouts, Zenith, Lunar Observatory, Astro-Copilot Workspace)*
- **Simra Tanveer** — *Engineering Intern (Solar Observatory & Astronomical Probe Tracker Architecture)*
- **Qurat ul Ain** — *Research Intern (Solar Observatory & Astronomical probes research)*
- **Tehreem Azhar** — *Research Intern (Solar Observatory & Astronomical probe tracker)*
- **Mohib** — *Engineering Intern (Solar system Simulator)*
- **Radhiya** — *Research & Development Intern (End-to-end Exora)*
- **Saani-e-Zehra** — *Research Intern (Cosmic Object Cataloging & Earth View)*
- **Amna** — *Research & Development Intern (Deep Sky Explorer & backend & data architecture for Exora)*

---

## 📄 8. Data Sources & Scientific Acknowledgments

We gratefully acknowledge the space agencies, archives, and scientific organizations providing open access to astronomical data:
- **NASA (National Aeronautics and Space Administration)** — APOD, Horizons System, SDO/AIA extreme UV imagery, and GIBS satellite layers.
- **NOAA SWPC (Space Weather Prediction Center)** — Real-time solar wind plasma data, magnetometer telemetry, and geomagnetic Kp indices.
- **NASA/IPAC Extragalactic Database (NED)** & **MAST (Mikulski Archive for Space Telescopes)** — Multi-wavelength celestial imagery and spectral catalogs.
- **CDS (Centre de Données astronomiques de Strasbourg)** — SIMBAD Astronomical Database.
- **USGS Astrogeology Science Center** — Gazetteer of Planetary Nomenclature for lunar topography and nomenclature.
- **NASA JPL (Jet Propulsion Laboratory)** — SPICE Planetary Ephemeris (`de440s.bsp`).
