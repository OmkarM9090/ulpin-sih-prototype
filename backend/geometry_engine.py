import json
import os
from ulpin_generator import generate_3d_ulpin

def get_rect_coords(x_min, x_max, y_min, y_max):
    return [
        [x_min, y_min],
        [x_max, y_min],
        [x_max, y_max],
        [x_min, y_max],
        [x_min, y_min]
    ]

def calculate_area(x_min, x_max, y_min, y_max):
    return (x_max - x_min) * (y_max - y_min)

def generate_building_units():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    with open(os.path.join(base_dir, 'data', 'parcel.geojson'), 'r') as f:
        parcel_data = json.load(f)
    with open(os.path.join(base_dir, 'data', 'building_config.json'), 'r') as f:
        building_config = json.load(f)
        
    parent_ulpin = parcel_data['features'][0]['properties']['parent_ulpin']
    
    footprint = building_config['footprint']
    cx, cy = footprint['center_x'], footprint['center_y']
    sx, sy = footprint['size_x'], footprint['size_y']
    
    x_min, x_max = cx - sx/2, cx + sx/2
    y_min, y_max = cy - sy/2, cy + sy/2
    x_mid, y_mid = cx, cy
    
    units = []
    unit_id_counter = 1
    
    for level in building_config['levels']:
        lvl_id = level['id']
        name = level['name']
        z_min = level['z_min']
        z_max = level['z_max']
        usage = level['usage']
        num_units = level['units']
        
        # Determine layer and level_str for ULPIN
        if lvl_id == 'B1':
            layer = 'U'
            level_str = 'L-01'
        elif lvl_id == 'GF':
            layer = 'S'
            level_str = 'L00'
        elif lvl_id == 'F1':
            layer = 'S'
            level_str = 'L01'
        elif lvl_id == 'F2':
            layer = 'S'
            level_str = 'L02'
        elif lvl_id == 'F3':
            layer = 'S'
            level_str = 'L03'
        else:
            layer = 'S'
            level_str = 'LXX'
            
        height = z_max - z_min
            
        if num_units == 1:
            # Full footprint
            coords = get_rect_coords(x_min, x_max, y_min, y_max)
            area = calculate_area(x_min, x_max, y_min, y_max)
            volume = area * height
            unit_str = "U001"
            ulpin = generate_3d_ulpin(parent_ulpin, layer, level_str, unit_str)
            
            units.append({
                "unit_id": f"U{unit_id_counter:03d}",
                "ulpin": ulpin,
                "layer": layer,
                "level": level_str,
                "level_label": name,
                "unit_label": f"{name} - {usage}",
                "footprint": coords,
                "z_min": z_min,
                "z_max": z_max,
                "usage": usage,
                "area_sqm": area,
                "volume_cbm": volume
            })
            unit_id_counter += 1
            
        elif num_units == 4:
            # 4 quadrants
            quadrants = [
                (x_min, x_mid, y_min, y_mid),
                (x_mid, x_max, y_min, y_mid),
                (x_min, x_mid, y_mid, y_max),
                (x_mid, x_max, y_mid, y_max)
            ]
            for i, (qx1, qx2, qy1, qy2) in enumerate(quadrants):
                coords = get_rect_coords(qx1, qx2, qy1, qy2)
                area = calculate_area(qx1, qx2, qy1, qy2)
                volume = area * height
                unit_str = f"U00{i+1}"
                ulpin = generate_3d_ulpin(parent_ulpin, layer, level_str, unit_str)
                
                units.append({
                    "unit_id": f"U{unit_id_counter:03d}",
                    "ulpin": ulpin,
                    "layer": layer,
                    "level": level_str,
                    "level_label": name,
                    "unit_label": f"{name} - Unit {i+1}",
                    "footprint": coords,
                    "z_min": z_min,
                    "z_max": z_max,
                    "usage": usage,
                    "area_sqm": area,
                    "volume_cbm": volume
                })
                unit_id_counter += 1

    output_file = os.path.join(base_dir, 'data', 'generated_units.json')
    with open(output_file, 'w') as f:
        json.dump(units, f, indent=2)
        
    return units

if __name__ == "__main__":
    units = generate_building_units()
    print(json.dumps(units[:2], indent=2))
    print(f"\nTotal units generated: {len(units)}")
