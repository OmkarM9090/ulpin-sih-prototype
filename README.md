# GeoCadastre 3D (SIH 26011)

**SIH 2026 Prototype · Problem Statement 26011**

> ⚠️ **Controlled Demo Data** — This prototype uses synthetic/cadastral data for demonstration purposes only. It does not contain real government cadastral records.

This is a proof-of-concept demonstrating the proposed technical workflow for transforming a 2D land parcel (parent ULPIN) into segmented, watertight 3D property volumes, each assigned a proposed hierarchical 3D-ULPIN.

## 🌟 Problem Statement Overview

In densely populated urban areas, vertical property ownership (apartments, underground metros, utilities) is poorly represented by traditional 2D cadastral maps. **Problem Statement 26011** requires a solution to extend the 14-digit Unique Land Parcel Identification Number (ULPIN) into the 3rd dimension. 

Our solution demonstrates ingesting 2D parcels, extruding vertical volumes, validating 3D topological constraints (ensuring no spatial overlaps), and generating proposed hierarchical 3D-ULPINs.

## ✨ Core Features

1. **7-Stage Geometric Pipeline:** A demo engine from footprint extraction and floor segmentation to 3D volume extrusion.
2. **Topological Validation:** Built-in geometric engine ensuring all generated units are watertight and do not overlap.
3. **Proposed 3D-ULPIN Generation:** Demonstrates appending logical floor and unit descriptors to the parent 2D ULPIN base.
4. **Interactive Cadastral Canvas:** 3D WebGL viewer with explode logic, camera presets, layered filtering, and interactive property selection.
5. **Prototype Property Cards:** Generate demo property cards detailing unit data, Z-bounds, and encumbrances.

## 🚀 How to Run the Demo

**Pre-requisites:**
- Python 3.10+
- Node.js & npm

### Quick Start (Windows)
We have provided a convenient launch script. Simply right-click `start.ps1` and select **Run with PowerShell**, or execute it from your terminal:
```powershell
.\start.ps1
```

### Manual Start

**1. Start the Backend**
Open a terminal and run:
```cmd
cd backend
python -m pip install fastapi uvicorn pydantic shapely
python -m uvicorn main:app --reload --port 8000
```

**2. Start the Frontend**
Open a **second** terminal and run:
```cmd
cd frontend
npm install
npm run dev
```

Navigate to **http://localhost:5173** in your web browser.

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Three.js, React Three Fiber (R3F), Drei, Vanilla CSS (Custom Design System)
- **Backend:** Python, FastAPI, Shapely (Computational Geometry)
- **Data Exchange:** GeoJSON, REST APIs
