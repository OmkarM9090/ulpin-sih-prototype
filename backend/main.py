import json
import os
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from geometry_engine import generate_building_units
from topology_validator import validate_units

app = FastAPI(title="3D ULPIN API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

base_dir = os.path.dirname(os.path.abspath(__file__))
data_dir = os.path.join(base_dir, 'data')

def load_json(filename):
    filepath = os.path.join(data_dir, filename)
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            return json.load(f)
    return None

@app.get("/api/parcel")
def get_parcel():
    parcel = load_json('parcel.geojson')
    if not parcel:
        raise HTTPException(status_code=404, detail="Parcel data not found")
    return parcel

@app.get("/api/data-sources")
def get_data_sources():
    return {
        "sources": [
            {"id":"drone","name":"Drone Orthomosaic","format":"GeoTIFF","spec":"5cm GSD","status":"ingested","size_mb":245,"records":1},
            {"id":"lidar","name":"LiDAR Point Cloud","format":"LAZ","spec":"2.4M pts","status":"ingested","size_mb":180,"records":2400000},
            {"id":"dem","name":"Bhuvan CartoDEM","format":"GeoTIFF","spec":"30m res","status":"ingested","size_mb":12,"records":1},
            {"id":"floorplan","name":"Municipal Floor Plans","format":"PDF vectorized","spec":"5 sheets","status":"ingested","size_mb":8,"records":5},
            {"id":"gnss","name":"GNSS / CORS Anchor","format":"RINEX","spec":"±3 cm","status":"ingested","size_mb":2,"records":1},
            {"id":"gis","name":"Municipal GIS Layer","format":"GeoJSON","spec":"Parcel + roads","status":"ingested","size_mb":1,"records":12}
        ],
        "last_sync": "2026-01-15T09:42:11Z"
    }

@app.get("/api/system-status")
def get_system_status():
    return {
        "backend": "online",
        "database": "in-memory (prototype)",
        "units_registered": 20,
        "topology_status": "VALID",
        "last_pipeline_run": "2026-01-15T09:42:11Z",
        "version": "1.0.0-demo"
    }

@app.get("/api/pipeline/run")
def run_pipeline():
    units = generate_building_units()
    validation = validate_units(units)
    return {
        "status": "success",
        "units": units,
        "validation": validation
    }

@app.get("/api/units")
def get_units():
    units = load_json('generated_units.json')
    if not units:
        raise HTTPException(status_code=404, detail="Units not generated yet")
    return units

@app.get("/api/unit/{ulpin}")
def get_unit(ulpin: str):
    units = load_json('generated_units.json')
    owners = load_json('owners.json')
    
    if not units or not owners:
        raise HTTPException(status_code=404, detail="Data not available")
        
    for idx, unit in enumerate(units):
        if unit['ulpin'] == ulpin:
            owner = next((o for o in owners if o['unit_index'] == idx + 1), None)
            return {
                "unit": unit,
                "owner": owner
            }
            
    raise HTTPException(status_code=404, detail="Unit not found")

@app.get("/api/property-card/{ulpin}")
def get_property_card(ulpin: str):
    unit_data = get_unit(ulpin) # Reuse logic
    parcel = load_json('parcel.geojson')
    
    unit = unit_data['unit']
    owner = unit_data['owner']
    parcel_props = parcel['features'][0]['properties']
    
    return {
        "title": "3D PROPERTY CARD (PROTOTYPE)",
        "generated_at": datetime.now().isoformat(),
        "parent_parcel": {
            "ulpin": parcel_props['parent_ulpin'],
            "area_sqm": parcel_props['area_sqm'],
            "location": parcel_props['location_label']
        },
        "unit_details": {
            "3d_ulpin": unit['ulpin'],
            "level": unit['level_label'],
            "usage": unit['usage'],
            "area_sqm": unit['area_sqm'],
            "volume_cbm": unit['volume_cbm'],
            "z_range": f"{unit['z_min']}m to {unit['z_max']}m"
        },
        "ownership": owner,
        "disclaimer": "Prototype \u2014 Not an Official Government Document"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
