import json
import os
from shapely.geometry import Polygon

def validate_units(units_list: list) -> dict:
    total_units = len(units_list)
    watertight_ok = True
    overlap_ok = True
    overlaps_found = []
    gaps_found = []
    
    # 1. Watertight check
    for unit in units_list:
        uid = unit['unit_id']
        z_min = unit['z_min']
        z_max = unit['z_max']
        footprint = unit['footprint']
        
        # Check Z bounds
        if z_min >= z_max:
            watertight_ok = False
            gaps_found.append(f"{uid} has invalid Z bounds (z_min >= z_max)")
            
        # Check footprint closed and >= 3 unique points (so len >= 4 with closing point)
        if len(footprint) < 4:
            watertight_ok = False
            gaps_found.append(f"{uid} footprint has less than 4 points")
        elif footprint[0] != footprint[-1]:
            watertight_ok = False
            gaps_found.append(f"{uid} footprint is not closed")

    # 2. Overlap check (only for units on the SAME level)
    levels_map = {}
    for unit in units_list:
        lvl = unit['level']
        if lvl not in levels_map:
            levels_map[lvl] = []
        levels_map[lvl].append(unit)
        
    for lvl, lvl_units in levels_map.items():
        # Compare every pair of units on the same level
        for i in range(len(lvl_units)):
            for j in range(i + 1, len(lvl_units)):
                u1 = lvl_units[i]
                u2 = lvl_units[j]
                
                poly1 = Polygon(u1['footprint'])
                poly2 = Polygon(u2['footprint'])
                
                if poly1.is_valid and poly2.is_valid:
                    intersection = poly1.intersection(poly2)
                    if intersection.area > 0.01:
                        overlap_ok = False
                        overlaps_found.append(f"{u1['unit_id']} and {u2['unit_id']} overlap on level {lvl} (area: {intersection.area:.2f})")
                else:
                    overlap_ok = False
                    overlaps_found.append(f"Invalid polygon found for {u1['unit_id']} or {u2['unit_id']}")
    
    status = "VALID" if (watertight_ok and overlap_ok) else "INVALID"
    
    return {
        "total_units": total_units,
        "watertight_ok": watertight_ok,
        "overlap_ok": overlap_ok,
        "overlaps_found": overlaps_found,
        "gaps_found": gaps_found,
        "status": status
    }

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    units_file = os.path.join(base_dir, 'data', 'generated_units.json')
    
    with open(units_file, 'r') as f:
        units = json.load(f)
        
    report = validate_units(units)
    print("Topology Validation Report:")
    print(json.dumps(report, indent=2))
