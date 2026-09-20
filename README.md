# GeoCadastre 3D :: ULPIN Prototype

**Problem Statement:** PS 26011 - 3D Property Registration & Validation (SIH 2026)
**Team:** [Your Team Name]
**Project Name:** BHU-3D / GeoCadastre 3D

## Overview
GeoCadastre 3D is a highly interactive, WebGL-powered spatial data registry prototype designed to tackle the complexities of vertically stacked property ownership (apartments, commercial towers, underground infrastructure like metro tunnels). 

It extends the traditional 2D land parcel framework into a hierarchical **3D Volumetric ULPIN** (Unique Land Parcel Identification Number) system, compliant with LADM (Land Administration Domain Model) concepts.

### Key Features Demonstrated
1. **Interactive 3D Cadastre (WebGL/Three.js):** Real-time spatial visualization of extruded buildings, stratified floor units, and underground utility/metro easements on top of 2D base parcels.
2. **Algorithmic Unit Extraction (Simulated):** A visual pipeline demonstrating how raw BIM/IFC geometric data is parsed, checked for manifold watertightness, and exploded into discrete volumetric units.
3. **Automated Spatial Validation:** Simulates the detection of topological conflicts (e.g., overlapping property volumes, Z-range anomalies) to ensure legal registry integrity.
4. **Hierarchical 3D ULPIN Assignment:** Generates unique, cryptographically verifiable 3D property identifiers (e.g., `09-12345-0012-L03-R`).
5. **LADM Property Title Records:** Rich UI dashboards combining ownership encumbrances with precise 3D spatial geometry matrices.

## Tech Stack
* **Frontend Framework:** React 18, Vite
* **Routing:** React Router v6
* **3D Graphics:** Three.js, `@react-three/fiber`, `@react-three/drei`
* **Icons:** Lucide React
* **Styling:** Custom Vanilla CSS (Dark Navy / Glassmorphism Aesthetic)

## Getting Started

### Quick Start (Windows)
Simply double-click the `demo.bat` file located in the root directory. This will automatically install dependencies (if missing) and start the local Vite development server.

### Manual Start
1. Open your terminal.
2. Navigate to the frontend directory: `cd frontend`
3. Install dependencies: `npm install`
4. Start the server: `npm run dev`
5. Open your browser to `http://localhost:5173`

## Judging & Demo Mode
The application includes a built-in "Demo Auto-Play" script designed specifically for presentation environments.

* **To activate:** Click the `[DEMO MODE]` button in the top right Navbar.
* **What happens:** The app will take over and automatically navigate through a predefined script simulating the entire ULPIN generation, spatial validation, and property inspection workflow.
* **To exit:** Press the `ESC` key at any time to regain manual control.

## Disclaimer
> **⚠️ Data Honesty Notice:** All parcel data, measurements, ownership details, Aadhaar hashes, and validation results shown in this prototype are entirely **synthetic and mocked** for demonstration purposes. This system does not interface with any real government databases.

---
*Built for the Smart India Hackathon 2026*
