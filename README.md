# GeoCadastre 3D (SIH 26011)

**SIH 2026 Prototype · Problem Statement 26011**

This is an end-to-end, production-grade proof-of-concept demonstrating the transformation of a 2D land parcel (parent ULPIN) into segmented, watertight 3D property volumes, each assigned a mathematically unique hierarchical 3D-ULPIN.

## 🌟 Problem Statement Overview

In densely populated urban areas, vertical property ownership (apartments, underground metros, utilities) is poorly represented by traditional 2D cadastral maps. **Problem Statement 26011** requires a solution to extend the 14-digit Unique Land Parcel Identification Number (ULPIN) into the 3rd dimension. 

Our solution natively ingests 2D parcels, extrudes vertical volumes, strictly validates 3D topological constraints (ensuring no spatial overlaps), and dynamically generates LADM-compliant hierarchical 3D-ULPINs.

## ✨ Core Features

1. **7-Stage Geometric Pipeline:** A complete automated engine from footprint extraction and floor segmentation to 3D volume extrusion.
2. **Topological Validation:** Built-in geometric engine ensuring all generated units are watertight and do not overlap.
3. **Hierarchical 3D-ULPIN Generation:** Appends logical floor and unit descriptors to the parent 2D ULPIN base.
4. **Interactive Cadastral Canvas:** 3D WebGL viewer with explode logic, camera presets, layered filtering, and interactive property selection.
5. **Print-Ready Property Cards:** Instantly generate official cadastral property cards detailing ownership, exact Z-bounds, and encumbrances (e.g., Public Easements).

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
