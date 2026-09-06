import json
import os
import math
from ulpin_generator import generate_3d_ulpin

def get_rect_coords(x_min, x_max, y_min, y_max):
    return [
        [x_min, y_min],
        [x_max, y_min],
        [x_max, y_max],
        [x_min, y_max],
        [x_min, y_min]
    ]

def get_rotated_rect(cx, cy, width, length, angle_deg):
    # Create rectangle centered at origin
    w2 = width / 2
    l2 = length / 2
    pts = [
        [-w2, -l2],
        [w2, -l2],
        [w2, l2],
        [-w2, l2]
    ]
    
    rad = math.radians(angle_deg)
    cos_a = math.cos(rad)
    sin_a = math.sin(rad)
    
    rotated = []
    for px, py in pts:
        rx = px * cos_a - py * sin_a
        ry = px * sin_a + py * cos_a
        rotated.append([cx + rx, cy + ry])
    
    # Close the loop
    rotated.append(rotated[0])
    return rotated

def calculate_area(coords):
    # Shoelace formula
    area = 0.0
    for i in range(len(coords) - 1):
        area += coords[i][0] * coords[i+1][1] - coords[i+1][0] * coords[i][1]
    return abs(area) / 2.0

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
        layer = level.get('layer', 'S')
        level_str = level.get('level_code', 'LXX')
        unit_type = level.get('type', 'building')
        
        height = z_max - z_min
            
        if unit_type == "building":
            if num_units == 1:
                coords = get_rect_coords(x_min, x_max, y_min, y_max)
                area = calculate_area(coords)
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
                    "volume_cbm": volume,
                    "type": unit_type
                })
                unit_id_counter += 1
                
            elif num_units == 4:
                quadrants = [
                    (x_min, x_mid, y_min, y_mid),
                    (x_mid, x_max, y_min, y_mid),
                    (x_min, x_mid, y_mid, y_max),
                    (x_mid, x_max, y_mid, y_max)
                ]
                for i, (qx1, qx2, qy1, qy2) in enumerate(quadrants):
                    coords = get_rect_coords(qx1, qx2, qy1, qy2)
                    area = calculate_area(coords)
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
                        "volume_cbm": volume,
                        "type": unit_type
                    })
                    unit_id_counter += 1
                    
        elif unit_type == "metro":
            # 6m x 60m rectangle rotated 30 degrees crossing parcel diagonally
            coords = get_rotated_rect(15, 20, 6, 60, 30)
            area = calculate_area(coords)
            volume = area * height
            unit_str = "U001"
            ulpin = generate_3d_ulpin(parent_ulpin, layer, level_str, unit_str)
            units.append({
                "unit_id": f"U{unit_id_counter:03d}",
                "ulpin": ulpin,
                "layer": layer,
                "level": level_str,
                "level_label": name,
                "unit_label": name,
                "footprint": coords,
                "z_min": z_min,
                "z_max": z_max,
                "usage": usage,
                "area_sqm": area,
                "volume_cbm": volume,
                "type": unit_type
            })
            unit_id_counter += 1

        elif unit_type == "utility":
            # 1m x 40m thin strip along one edge of parcel
            # Parcel is 0..30 x 0..40, so let's put it at x=1..2
            coords = get_rect_coords(1, 2, 0, 40)
            area = calculate_area(coords)
            volume = area * height
            unit_str = "U001"
            ulpin = generate_3d_ulpin(parent_ulpin, layer, level_str, unit_str)
            units.append({
                "unit_id": f"U{unit_id_counter:03d}",
                "ulpin": ulpin,
                "layer": layer,
                "level": level_str,
                "level_label": name,
                "unit_label": name,
                "footprint": coords,
                "z_min": z_min,
                "z_max": z_max,
                "usage": usage,
                "area_sqm": area,
                "volume_cbm": volume,
                "type": unit_type
            })
            unit_id_counter += 1

        elif unit_type == "garden":
            # 8m x 8m square on NE corner of parcel (outside building footprint)
            # Parcel is up to 30, 40. Building is up to 25, 32.5.
            # So 22..30 on X and 32..40 on Y works.
            coords = get_rect_coords(22, 30, 32, 40)
            area = calculate_area(coords)
            volume = area * height
            unit_str = "U001"
            ulpin = generate_3d_ulpin(parent_ulpin, layer, level_str, unit_str)
            units.append({
                "unit_id": f"U{unit_id_counter:03d}",
                "ulpin": ulpin,
                "layer": layer,
                "level": level_str,
                "level_label": name,
                "unit_label": name,
                "footprint": coords,
                "z_min": z_min,
                "z_max": z_max,
                "usage": usage,
                "area_sqm": area,
                "volume_cbm": volume,
                "type": unit_type
            })
            unit_id_counter += 1

        elif unit_type == "water_tank":
            # 3m x 3m square centered on terrace
            coords = get_rect_coords(cx - 1.5, cx + 1.5, cy - 1.5, cy + 1.5)
            area = calculate_area(coords)
            volume = area * height
            unit_str = "U001"
            ulpin = generate_3d_ulpin(parent_ulpin, layer, level_str, unit_str)
            units.append({
                "unit_id": f"U{unit_id_counter:03d}",
                "ulpin": ulpin,
                "layer": layer,
                "level": level_str,
                "level_label": name,
                "unit_label": name,
                "footprint": coords,
                "z_min": z_min,
                "z_max": z_max,
                "usage": usage,
                "area_sqm": area,
                "volume_cbm": volume,
                "type": unit_type
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
