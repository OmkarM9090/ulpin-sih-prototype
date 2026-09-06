import re

def compute_checksum(base_string: str) -> int:
    """
    Computes a single digit checksum as the sum of all digits in the string mod 10.
    """
    total = sum(int(char) for char in base_string if char.isdigit())
    return total % 10

def generate_3d_ulpin(parent_ulpin: str, layer: str, level: str, unit: str) -> str:
    """
    Generates a 3D ULPIN string.
    Format: {parent_ulpin}-{layer}-{level}-{unit}-{checksum}
    """
    base_string = f"{parent_ulpin}-{layer}-{level}-{unit}"
    checksum = compute_checksum(base_string)
    return f"{base_string}-{checksum}"

def parse_3d_ulpin(ulpin_string: str) -> dict:
    """
    Parses a 3D ULPIN string back into its components.
    """
    pattern = r"^(\d+)-([US])-(L-?\d+)-(U\d{3})-(\d)$"
    match = re.match(pattern, ulpin_string)
    if not match:
        raise ValueError(f"Invalid 3D ULPIN format: {ulpin_string}")
        
    return {
        "parent_ulpin": match.group(1),
        "layer": match.group(2),
        "level": match.group(3),
        "unit": match.group(4),
        "checksum": int(match.group(5))
    }

if __name__ == "__main__":
    parent = "23140701001001"
    
    # 1. Basement
    ulpin1 = generate_3d_ulpin(parent, "U", "L-01", "U001")
    print(f"Basement Unit: {ulpin1}")
    print(f"Parsed: {parse_3d_ulpin(ulpin1)}\n")
    
    # 2. Ground Floor Shop
    ulpin2 = generate_3d_ulpin(parent, "S", "L00", "U001")
    print(f"Ground Floor Unit: {ulpin2}")
    print(f"Parsed: {parse_3d_ulpin(ulpin2)}\n")
    
    # 3. Floor 2 Apartment 3
    ulpin3 = generate_3d_ulpin(parent, "S", "L02", "U003")
    print(f"Upper Floor Unit: {ulpin3}")
    print(f"Parsed: {parse_3d_ulpin(ulpin3)}")
