import json
import os
import random
from datetime import datetime, timedelta

def seed_units():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(base_dir, 'data')
    
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
        
    names = [
        "Ramesh Kumar Sharma", "Anita Verma", "S. Bhattacharya", "Meera Nair", 
        "Vikram Singh", "Farhan Qureshi", "Kavita Joshi", "Deepak Rathore", 
        "Neha Agarwal", "T. Balasubramanian", "Imran Sheikh", "Sunita Yadav", 
        "Rajesh Iyer", "Priya Menon", "Ajay Kulkarni", "Kiran Desai", "Ravi Patel"
    ]
    
    areas = [1180, 1240, 1310, 1420]
    
    units = []
    
    parent_ulpin = "23140701001001"
    base_x = 542100.00
    base_y = 2971830.00
    
    # Generate for 6 floors (0 to 5) + 2 Basements (-1, -2)
    # 2 units per floor, except basements which are single large units
    
    unit_counter = 1
    
    for level in range(-2, 6):
        if level < 0:
            layer = 'U'
            level_code = f"L{str(abs(level)).zfill(2)}" # L01, L02 (but underground layer)
            level_label = f"Basement {abs(level)}"
            z_min = level * 3.0
            z_max = z_min + 3.0
            num_units = 1
        elif level == 0:
            layer = 'S'
            level_code = "L00"
            level_label = "Ground Floor"
            z_min = 0.0
            z_max = 3.5
            num_units = 1
        else:
            layer = 'S'
            level_code = f"L{str(level).zfill(2)}"
            level_label = f"Floor {level}"
            z_min = (level-1) * 3.5 + 3.5
            z_max = z_min + 3.5
            num_units = 2
            
        for u in range(1, num_units + 1):
            unit_id = f"U{str(level).zfill(2)}-{str(u).zfill(2)}" if level > 0 else (f"U00-01" if level == 0 else f"B{abs(level)}-01")
            
            # Reconstruct the ULPIN specifically (length 28 approx)
            # Just matching the required schema output format
            # Format: {parent}-{layer}-{level}-{unit}-{checksum}
            generated_ulpin = f"3D-MH-PUN-P123456-{layer}-{level_code}-U{str(unit_counter).zfill(2)}-7"
            
            area_sqft = random.choice(areas) if level > 0 else 5000
            area_sqm = round(area_sqft * 0.092903, 1)
            height = round(z_max - z_min, 1)
            volume = round(area_sqm * height, 1)
            
            # Simple length/width approximation
            length = round(math.sqrt(area_sqm * 1.25), 1) if 'math' in globals() else 12.0
            width = round(area_sqm / length, 1)
            
            offset_x = random.uniform(0.5, 5.0)
            offset_y = random.uniform(0.5, 5.0)
            
            unit = {
                "unit_id": unit_id,
                "unit_index": unit_counter,
                "ulpin": generated_ulpin, # Used by existing code
                "generated_3d_ulpin": generated_ulpin,
                "ulpin_status": "generated",
                "parent_ulpin": parent_ulpin,
                "vertical_layer": layer,
                "vertical_layer_label": "Surface" if layer == 'S' else "Underground",
                "floor_code": level_code,
                "floor_label": level_label,
                "property_type": "Commercial Parking" if level < 0 else ("Retail / Lobby" if level == 0 else "Residential Apartment"),
                "dimensions": {
                    "area_sqft": area_sqft,
                    "area_sqm": area_sqm,
                    "volume_m3": volume,
                    "height_m": height,
                    "length_m": length,
                    "width_m": width,
                    "z_min": z_min,
                    "z_max": z_max
                },
                "coordinates": {
                    "crs": "EPSG:32644",
                    "x": round(base_x + offset_x, 2),
                    "y": round(base_y + offset_y, 2)
                },
                "ownership": {
                    "owner_name": random.choice(names),
                    "ownership_type": "Freehold" if level >= 0 else "Leasehold (Society)",
                    "registered_on": (datetime(2026, 1, 1) + timedelta(days=random.randint(0, 30))).strftime("%Y-%m-%d"),
                    "encumbrances": "None" if random.random() > 0.1 else "Bank Mortgage",
                    "aadhaar_hash": hashlib.sha256(str(random.random()).encode()).hexdigest()[:12] if 'hashlib' in globals() else "abc123xyz890"
                },
                "validation": {
                    "geometry_valid": True,
                    "topology_valid": True,
                    "confidence_score": round(random.uniform(92.0, 99.5), 1),
                    "data_source": "Controlled Demo Dataset",
                    "derivation": "Derived Geometry",
                    "verification_status": "Prototype \u2014 Awaiting Surveyor Review"
                },
                # Legacy fields for existing API compatibility
                "level_label": level_label,
                "usage": "Residential",
                "layer": layer,
                "area_sqm": area_sqm,
                "volume_cbm": volume,
                "z_min": z_min,
                "z_max": z_max
            }
            units.append(unit)
            unit_counter += 1

    with open(os.path.join(data_dir, 'generated_units.json'), 'w') as f:
        json.dump(units, f, indent=2)
        
    print(f"Successfully generated {len(units)} detailed units.")

import math
import hashlib
if __name__ == "__main__":
    seed_units()
