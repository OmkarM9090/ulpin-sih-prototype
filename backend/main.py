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
