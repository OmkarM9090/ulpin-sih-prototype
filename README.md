# 3D ULPIN Generation & Vertical Property Mapping System

**SIH 2026 Prototype · Problem Statement 26011**

This is an end-to-end proof-of-concept demonstrating the transformation of a 2D land parcel (parent ULPIN) into segmented, watertight 3D property volumes, each assigned a mathematically unique hierarchical 3D-ULPIN.

## 🚀 How to Run the Demo

**Pre-requisites:**
- Python 3.10+
- Node.js & npm

### 1. Start the Backend
Open a Windows CMD terminal and run:
```cmd
cd backend
python -m pip install fastapi uvicorn pydantic shapely
python -m uvicorn main:app --reload --port 8000
```

### 2. Start the Frontend
Open a **second** Windows CMD terminal and run:
```cmd
cd frontend
npm install
npm run dev
```
Navigate to **http://localhost:5173** in your web browser.

---

## 🎤 2-Minute Demo Script for Judges

**1. Context Setting (15s)**
> "Welcome judges. For PS 26011, we built an engine that takes a flat 2D land parcel and extrudes it into legal 3D vertical properties. You are currently looking at our raw input: Parcel P001 represented by the cyan outline."

**2. The Engine (30s)**
> *(Click "Run Pipeline")*
> "Our Python geometry engine is now taking the parent 2D ULPIN and footprint rules. It is segmenting floors, computing volumes, and rigorously checking for topological overlaps using geometric algorithms. As you can see, 14 units passed the watertight validation."

**3. The Visualization (30s)**
> "Our interface renders the generated ULPIN cadastral models. Let me adjust the **Explode View** slider. You can physically see the distinct vertical partition of the apartments, ground shop, and underground parking layer."

**4. The Property Card (45s)**
> *(Click on an upper floor apartment block)*
> "Clicking any volumetric unit instantly retrieves its newly generated 3D-ULPIN. It computes exact Z-heights, floor area, and associates it with the registered owner. 
> *(Click "View Property Card")*
> We also generate an instant, printable Property Card ready for the National Land Record database integration."

---

## 🏗️ Scope Note

- **Current Prototype:** Uses representative JSON geometries to guarantee a flawless live demo presentation without unpredictable CAD file parsing delays during judging.
- **36-Hour Hackathon Scope:** Incorporates basic geometric engine, ULPIN string generation logic, topological safeguards, and 3D WebGL rendering.
- **Future Scope:** Integration with actual IFC/BIM file parsers, PostgreSQL/PostGIS spatial databases, and automated drone-survey ingestion.
