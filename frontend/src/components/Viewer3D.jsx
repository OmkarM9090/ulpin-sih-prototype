import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Html, Plane, Edges, Instance, Instances } from '@react-three/drei';
import * as THREE from 'three';

const ParcelBoundary = ({ is2D, selectedUnit, onSelect }) => {
  // Synthetic Cadastral Fabric centered around active parcel
  // Active parcel matches backend/data/parcel.geojson dimensions (30x40)
  const parcels = [
    { id: 'P001', isMain: true, pos: [0, 0, 0], size: [30, 40], label: 'MH-PUN-P123456', area: '1,200 m²' },
    { id: 'P002', isMain: false, pos: [-30, 0, 0], size: [30, 40], label: 'Demo Plot A', area: '1,200 m²' },
    { id: 'P003', isMain: false, pos: [30, 0, 0], size: [30, 40], label: 'Demo Plot B', area: '1,200 m²' },
    { id: 'P004', isMain: false, pos: [0, 0, -40], size: [30, 40], label: 'Demo Plot C', area: '1,200 m²' },
    { id: 'P005', isMain: false, pos: [-30, 0, -40], size: [30, 40], label: 'Demo Plot D', area: '1,200 m²' },
    { id: 'P006', isMain: false, pos: [30, 0, -40], size: [30, 40], label: 'Demo Plot E', area: '1,200 m²' },
  ];

  const [hoveredId, setHoveredId] = useState(null);

  return (
    <group>
      {parcels.map((parcel, idx) => {
        const isSelected = selectedUnit === parcel.id || (parcel.isMain && !selectedUnit?.startsWith('ROAD'));
        const isHovered = hoveredId === parcel.id;
        return (
        <group key={parcel.id} position={parcel.pos}>
          {/* Parcel Polygon */}
          <mesh 
            rotation={[-Math.PI / 2, 0, 0]} 
            position={[0, 0.01, 0]}
            onClick={(e) => { e.stopPropagation(); if (is2D) onSelect(parcel.id); }}
            onPointerOver={(e) => { e.stopPropagation(); if (is2D) { setHoveredId(parcel.id); document.body.style.cursor = 'pointer'; } }}
            onPointerOut={(e) => { e.stopPropagation(); if (is2D) { setHoveredId(null); document.body.style.cursor = 'auto'; } }}
          >
            <planeGeometry args={parcel.size} />
            <meshBasicMaterial 
              color={isSelected ? "#06b6d4" : (isHovered ? "#38bdf8" : (parcel.isMain ? "#06b6d4" : "#475569"))} 
              transparent 
              opacity={isSelected ? 0.15 : (isHovered ? 0.1 : (parcel.isMain ? 0.1 : 0.05))} 
              side={THREE.DoubleSide} 
            />
            <Edges scale={1} color={isSelected ? "#22d3ee" : (isHovered ? "#38bdf8" : (parcel.isMain ? "#22d3ee" : "#64748b"))} />
          </mesh>
          
          {/* Parcel Label (Only show main label in 3D, show all in 2D) */}
          {(is2D || parcel.isMain) && (
            <Html 
              position={[0, parcel.isMain ? 19 : 0.2, 0]} 
              center 
              zIndexRange={[100, 0]} 
              style={{ pointerEvents: 'none', transition: 'all 0.3s' }}
            >
              <div style={{
                background: isSelected ? 'rgba(5, 8, 15, 0.85)' : 'rgba(5, 8, 15, 0.5)',
                color: isSelected ? 'var(--accent)' : 'var(--text-3)', 
                padding: isSelected ? '4px 10px' : '2px 6px',
                borderRadius: '4px', 
                fontSize: isSelected ? '11px' : '9px', 
                whiteSpace: 'nowrap',
                border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border-2)', 
                boxShadow: isSelected ? '0 4px 6px rgba(0,0,0,0.3)' : 'none',
                fontFamily: 'var(--mono)', 
                fontWeight: isSelected ? 700 : 500,
                opacity: is2D ? 1 : (parcel.isMain ? 1 : 0)
              }}>
                {parcel.label} {is2D && isSelected && `· ${parcel.area}`}
              </div>
            </Html>
          )}
        </group>
        );
      })}
    </group>
  );
};

const RoadNetwork = ({ is2D, selectedUnit, onSelect }) => {
  const [hoveredRoad, setHoveredRoad] = useState(null);

  const isMainSelected = selectedUnit === 'ROAD-MAIN';
  const isSecSelected = selectedUnit === 'ROAD-SEC';

  return (
    <group>
      {/* Main East-West Road (Front of Parcels) */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0.005, 26]}
        onClick={(e) => { e.stopPropagation(); if (is2D) onSelect('ROAD-MAIN'); }}
        onPointerOver={(e) => { e.stopPropagation(); if (is2D) { setHoveredRoad('MAIN'); document.body.style.cursor = 'pointer'; } }}
        onPointerOut={(e) => { e.stopPropagation(); if (is2D) { setHoveredRoad(null); document.body.style.cursor = 'auto'; } }}
      >
        <planeGeometry args={[120, 12]} />
        <meshBasicMaterial 
          color={isMainSelected ? "#0ea5e9" : (hoveredRoad === 'MAIN' ? "#38bdf8" : "#1e293b")} 
          transparent opacity={isMainSelected ? 0.3 : 1}
          side={THREE.DoubleSide} 
        />
      </mesh>
      {/* Main Road Centerline */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 26]} style={{ pointerEvents: 'none' }}>
        <planeGeometry args={[120, 0.4]} />
        <meshBasicMaterial color="#cbd5e1" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <Html position={[-35, 0.2, 26]} center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
        <div style={{ color: isMainSelected ? 'var(--accent)' : 'var(--text-3)', fontSize: '10px', letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase' }}>Main Access Road</div>
      </Html>

      {/* Secondary North-South Road (Right of Parcels) */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[51, 0.005, -10]}
        onClick={(e) => { e.stopPropagation(); if (is2D) onSelect('ROAD-SEC'); }}
        onPointerOver={(e) => { e.stopPropagation(); if (is2D) { setHoveredRoad('SEC'); document.body.style.cursor = 'pointer'; } }}
        onPointerOut={(e) => { e.stopPropagation(); if (is2D) { setHoveredRoad(null); document.body.style.cursor = 'auto'; } }}
      >
        <planeGeometry args={[8, 84]} />
        <meshBasicMaterial 
          color={isSecSelected ? "#0ea5e9" : (hoveredRoad === 'SEC' ? "#38bdf8" : "#1e293b")} 
          transparent opacity={isSecSelected ? 0.3 : 1}
          side={THREE.DoubleSide} 
        />
      </mesh>
      {/* Secondary Road Centerline */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[51, 0.006, -10]} style={{ pointerEvents: 'none' }}>
        <planeGeometry args={[0.2, 84]} />
        <meshBasicMaterial color="#cbd5e1" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <Html position={[51, 0.2, -10]} center zIndexRange={[100, 0]} style={{ pointerEvents: 'none', transform: 'rotate(-90deg)' }}>
        <div style={{ color: isSecSelected ? 'var(--accent)' : 'var(--text-4)', fontSize: '9px', letterSpacing: '0.1em', fontWeight: 500, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Secondary Road</div>
      </Html>
    </group>
  );
};


const Room = ({ unitId, roomId, label, args, position, selectedId, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const isSelected = selectedId === roomId;

  const meshRef = useRef();
  useFrame(() => {
    if (meshRef.current) {
      const targetY = isSelected ? 0.5 : 0;
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.15;
    }
  });

  return (
    <group position={position} ref={meshRef}>
      <mesh
        onClick={(e) => { e.stopPropagation(); onClick(roomId); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
        castShadow receiveShadow
      >
        <boxGeometry args={args} />
        <meshStandardMaterial 
          color="#94a3b8"
          emissive={isSelected ? "#22d3ee" : (hovered ? "#06b6d4" : "#000000")}
          emissiveIntensity={isSelected ? 0.4 : (hovered ? 0.2 : 0)}
          roughness={0.6}
          transparent opacity={isSelected || hovered ? 0.8 : 0.25}
          depthWrite={false}
        />
        {(isSelected || hovered) && <Edges color="#0284c7" scale={1.01} />}
      </mesh>
      {(isSelected || hovered) && (
        <Html position={[0, args[1]/2 + 0.2, 0]} center style={{ pointerEvents: 'none' }} zIndexRange={[100, 0]}>
          <div style={{
            background: 'rgba(15,23,42,0.9)', color: 'var(--text-1)', border: '1px solid var(--accent)',
            padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600, whiteSpace: 'nowrap'
          }}>
            {label}<br/><span style={{ fontSize: '8px', color: 'var(--text-3)' }}>Illustrative Layout</span>
          </div>
        </Html>
      )}
    </group>
  );
};

const UnitBlock = ({ unitId, level, xOffset, args, selectedId, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  const isSelected = selectedId === unitId;
  const isRoomSelected = selectedId && selectedId.startsWith(`${unitId}-R`);
  const isParentSelected = selectedId === `UNIT-L${level}`;
  const isActive = isSelected || isRoomSelected || isParentSelected;

  useFrame(() => {
    if (meshRef.current) {
      const dir = xOffset < 0 ? -1 : 1;
      const targetX = (isSelected || isRoomSelected) ? xOffset + dir * 1.5 : xOffset;
      meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.15;
    }
  });

  const baseColor = "#cbd5e1"; 
  const glow = isActive ? "#06b6d4" : (hovered ? "#38bdf8" : "#000000");

  return (
    <group position={[xOffset, 0, 0]} ref={meshRef}>
      <mesh
        onClick={(e) => { e.stopPropagation(); onClick(unitId); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
        castShadow receiveShadow
      >
        <boxGeometry args={args} />
        <meshStandardMaterial 
          color={baseColor}
          emissive={glow}
          emissiveIntensity={isSelected ? 0.3 : (hovered ? 0.1 : 0)}
          roughness={0.8}
          transparent={isActive}
          opacity={isActive ? 0.15 : 1}
          depthWrite={!isActive}
        />
        {(isSelected || hovered) && <Edges color="#0ea5e9" scale={1.005} />}
      </mesh>

      {isActive && (
        <group>
          <Room unitId={unitId} roomId={`${unitId}-R01`} label="Living Room" args={[3.8, 2.5, 6]} position={[xOffset < 0 ? 2 : -2, 0, 3.5]} selectedId={selectedId} onClick={onClick} />
          <Room unitId={unitId} roomId={`${unitId}-R02`} label="Bedroom" args={[3.8, 2.5, 5]} position={[xOffset < 0 ? 2 : -2, 0, -3.5]} selectedId={selectedId} onClick={onClick} />
          <Room unitId={unitId} roomId={`${unitId}-R03`} label="Kitchen/Bath" args={[3.8, 2.5, 4]} position={[xOffset < 0 ? -2 : 2, 0, 1.5]} selectedId={selectedId} onClick={onClick} />
        </group>
      )}

      {(isSelected || hovered) && !isRoomSelected && (
        <Html position={[0, 1.5, 0]} center style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'var(--bg-1)', color: 'var(--accent)', border: '1px solid var(--accent)',
            padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700
          }}>
            Unit {unitId}
          </div>
        </Html>
      )}
    </group>
  );
};

const Floor = ({ level, yPos, selectedUnit, selectedLevel, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  const isFloorSelected = selectedUnit === `UNIT-L${level}`;
  // If ANY unit or room in this floor is selected, we consider the floor active for explosion.
  const isFloorActive = selectedLevel === level; 

  useFrame(() => {
    if (meshRef.current) {
      const targetScale = (isFloorSelected || hovered) ? 1.01 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, 1, targetScale), 0.15);

      const targetY = (selectedLevel !== null && level > selectedLevel) ? yPos + 12 : yPos;
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.1;
    }
  });

  const baseColor = "#e2e8f0"; // Light neutral
  const slabColor = "#94a3b8";
  const glow = isFloorSelected ? "#22d3ee" : (hovered ? "#0ea5e9" : "#000000");
  const displayLabel = level === 0 ? "Ground Floor" : `Floor ${level}`;

  return (
    <group position={[0, yPos, 0]} ref={meshRef}>
      {/* Floor Slab separator */}
      <mesh position={[0, -1.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[18.4, 0.2, 14.4]} />
        <meshStandardMaterial color={slabColor} roughness={0.8} />
      </mesh>
      
      {/* Main Core / Units */}
      {level === 0 ? (
        <mesh
          onClick={(e) => { e.stopPropagation(); onClick(`UNIT-L${level}`); }}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
          onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
          castShadow receiveShadow
        >
          <boxGeometry args={[17.8, 2.6, 13.8]} />
          <meshStandardMaterial 
            color={baseColor}
            emissive={glow}
            emissiveIntensity={isFloorSelected ? 0.3 : (hovered ? 0.15 : 0)}
            roughness={0.7}
            transparent={isFloorSelected}
            opacity={isFloorSelected ? 0.15 : 1}
            depthWrite={!isFloorSelected}
          />
          {(isFloorSelected || hovered) && <Edges color="#22d3ee" scale={1.01} />}
        </mesh>
      ) : (
        <group>
          {/* Central Corridor Solid */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.0, 2.6, 13.8]} />
            <meshStandardMaterial color={baseColor} roughness={0.7} />
          </mesh>
          <UnitBlock unitId={`U0${level}-01`} level={level} xOffset={-4.7} args={[8.4, 2.6, 13.8]} selectedId={selectedUnit} onClick={onClick} />
          <UnitBlock unitId={`U0${level}-02`} level={level} xOffset={4.7} args={[8.4, 2.6, 13.8]} selectedId={selectedUnit} onClick={onClick} />
        </group>
      )}

      {/* Front Balcony */}
      <mesh position={[0, -0.6, 7.1]} castShadow>
        <boxGeometry args={[17.8, 0.1, 1]} />
        <meshStandardMaterial color={slabColor} />
      </mesh>
      {/* Balcony Glass/Railing */}
      <mesh position={[0, 0, 7.55]} castShadow>
        <boxGeometry args={[17.8, 1.2, 0.05]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.3} roughness={0.1} metalness={0.8} />
      </mesh>

      {(isFloorSelected || hovered) && (
        <Html position={[0, 1.5, 0]} center style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'var(--bg-1)', color: 'var(--accent)', border: '1px solid var(--accent)',
            padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700
          }}>
            {displayLabel}
          </div>
        </Html>
      )}
      {/* Ground Floor Lobby */}
      {level === 0 && (
        <group position={[0, 0, 0]}>
          <mesh position={[0, -0.1, 7.02]} castShadow receiveShadow>
            <boxGeometry args={[4, 2.8, 0.2]} />
            <meshStandardMaterial color="#475569" roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.3, 7.13]} castShadow>
            <boxGeometry args={[2, 2.2, 0.05]} />
            <meshStandardMaterial color="#38bdf8" transparent opacity={0.4} roughness={0.1} metalness={0.9} />
          </mesh>
        </group>
      )}

      {/* Floor Windows */}
      <Instances limit={24} castShadow>
        <boxGeometry args={[1.2, 1.8, 0.05]} />
        <meshStandardMaterial color="#020617" roughness={0.1} metalness={0.9} emissive="#0ea5e9" emissiveIntensity={0.1} />
        {[-7, -4.5, 4.5, 7].map((x, j) => (
          <React.Fragment key={`fb-${j}`}>
            <Instance position={[x, 0, 6.91]} />
            <Instance position={[x, 0, -6.91]} />
          </React.Fragment>
        ))}
        {[-4, -1.5, 1.5, 4].map((z, j) => (
          <React.Fragment key={`side-${j}`}>
            <Instance position={[8.91, 0, z]} rotation={[0, Math.PI / 2, 0]} />
            <Instance position={[-8.91, 0, z]} rotation={[0, Math.PI / 2, 0]} />
          </React.Fragment>
        ))}
      </Instances>

    </group>
  );
};

const Roof = ({ selectedLevel }) => {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      const targetY = (selectedLevel !== null) ? 18 + 12 : 18;
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.1;
    }
  });

  return (
  <group position={[0, 18, 0]} ref={meshRef}>
    {/* Roof Slab */}
    <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
       <boxGeometry args={[18.4, 0.2, 14.4]} />
       <meshStandardMaterial color="#0f172a" />
    </mesh>
    {/* Parapet Walls */}
    <mesh position={[0, 0.2, 7.1]} castShadow>
       <boxGeometry args={[18.4, 1.0, 0.2]} />
       <meshStandardMaterial color="#1e293b" />
    </mesh>
    <mesh position={[0, 0.2, -7.1]} castShadow>
       <boxGeometry args={[18.4, 1.0, 0.2]} />
       <meshStandardMaterial color="#1e293b" />
    </mesh>
    <mesh position={[9.1, 0.2, 0]} castShadow>
       <boxGeometry args={[0.2, 1.0, 14.4]} />
       <meshStandardMaterial color="#1e293b" />
    </mesh>
    <mesh position={[-9.1, 0.2, 0]} castShadow>
       <boxGeometry args={[0.2, 1.0, 14.4]} />
       <meshStandardMaterial color="#1e293b" />
    </mesh>

    {/* Elevator / Service Core */}
    <mesh position={[0, 1.0, 0]} castShadow>
      <boxGeometry args={[4, 2.5, 4]} />
      <meshStandardMaterial color="#1e293b" />
    </mesh>

    {/* Water Tanks */}
    <mesh position={[6, 1.0, -4]} castShadow>
      <cylinderGeometry args={[0.8, 0.8, 2.5, 16]} />
      <meshStandardMaterial color="#0284c7" roughness={0.6} metalness={0.2} />
    </mesh>
    <mesh position={[4, 1.0, -4]} castShadow>
      <cylinderGeometry args={[0.8, 0.8, 2.5, 16]} />
      <meshStandardMaterial color="#0284c7" roughness={0.6} metalness={0.2} />
    </mesh>
  </group>
  );
};

const RealisticBuilding = ({ selectedUnit, onSelect, is2D }) => {
  let selectedLevel = null;
  if (selectedUnit) {
    if (selectedUnit.startsWith('UNIT-L')) {
      selectedLevel = parseInt(selectedUnit.replace('UNIT-L', ''), 10);
    } else if (selectedUnit.startsWith('U0')) {
      // U03-01 -> Level 3
      const match = selectedUnit.match(/U0(\d+)/);
      if (match) selectedLevel = parseInt(match[1], 10);
    }
  }

  const [hovered, setHovered] = useState(false);
  
  if (is2D) {
    const isSelected = selectedUnit === 'BUILDING-B239' || (selectedUnit && (selectedUnit.startsWith('U0') || selectedUnit.startsWith('UNIT-L')));
    return (
      <group>
        {/* Building Footprint */}
        <mesh 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, 0.02, 0]}
          onClick={(e) => { e.stopPropagation(); onSelect('BUILDING-B239'); }}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
          onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
        >
          <planeGeometry args={[18.4, 14.4]} />
          <meshBasicMaterial 
            color={isSelected ? "#06b6d4" : (hovered ? "#cbd5e1" : "#475569")} 
            transparent opacity={isSelected ? 0.3 : 0.6} side={THREE.DoubleSide} 
          />
          <Edges scale={1} color={isSelected ? "#22d3ee" : "#cbd5e1"} />
        </mesh>
        <Html position={[0, 0.3, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
          <div style={{
            color: isSelected ? 'var(--accent)' : 'var(--text-1)', 
            background: isSelected ? 'rgba(5, 8, 15, 0.85)' : 'rgba(0,0,0,0.5)', 
            padding: '2px 6px',
            borderRadius: '4px', fontSize: '10px', fontWeight: 600, letterSpacing: '0.05em',
            border: isSelected ? '1px solid var(--accent)' : 'none',
          }}>
            BUILDING B-239
          </div>
        </Html>
      </group>
    );
  }

  return (
    <group>
      {/* Floors */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Floor 
          key={i} 
          level={i} 
          yPos={1.5 + i * 3} 
          selectedUnit={selectedUnit}
          selectedLevel={selectedLevel}
          onClick={onSelect}
        />
      ))}
      
      <Roof selectedLevel={selectedLevel} />
    </group>
  );
};

const BasementFloor = ({ level, yPos, isSelected, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      const targetScale = (isSelected || hovered) ? 1.02 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, 1, targetScale), 0.15);
    }
  });

  const baseColor = "#334155"; 
  const glow = isSelected ? "#f59e0b" : (hovered ? "#fbbf24" : "#000000");
  const displayLabel = `Basement ${Math.abs(level)}`;

  return (
    <group position={[0, yPos, 0]} ref={meshRef}>
      <mesh
        onClick={(e) => { e.stopPropagation(); onClick(`UNIT-L${level}`); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        <boxGeometry args={[18, 2.6, 14]} />
        <meshStandardMaterial 
          color={baseColor}
          emissive={glow}
          emissiveIntensity={isSelected ? 0.4 : (hovered ? 0.2 : 0)}
          roughness={0.9}
          transparent opacity={0.6}
        />
        {(isSelected || hovered) && <Edges color="#f59e0b" scale={1.01} />}
      </mesh>
      
      {(isSelected || hovered) && (
        <Html position={[0, 1.5, 0]} center style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', border: '1px solid var(--warning)',
            padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, whiteSpace: 'nowrap'
          }}>
            {displayLabel}
          </div>
        </Html>
      )}
    </group>
  );
};

const UndergroundLayer = ({ selectedUnit, onSelect }) => {
  return (
    <group>
      {/* Basements */}
      <BasementFloor level={-1} yPos={-1.5} isSelected={selectedUnit === 'UNIT-L-1'} onClick={onSelect} />
      <BasementFloor level={-2} yPos={-4.5} isSelected={selectedUnit === 'UNIT-L-2'} onClick={onSelect} />

      {/* Metro Tunnel */}
      <mesh position={[0, -10, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[6, 6, 60]} />
        <meshStandardMaterial color="#dc2626" transparent opacity={0.6} />
        <Html position={[0, 3, 0]} center style={{ pointerEvents: 'none' }}>
          <div style={{ color: '#dc2626', fontSize: '10px', background: 'rgba(0,0,0,0.5)', padding: '2px 4px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
            UM-00451 · Metro Tunnel
          </div>
        </Html>
      </mesh>

      {/* Utility Line */}
      <mesh position={[-11, -3, 0]}>
        <boxGeometry args={[1, 1, 20]} />
        <meshStandardMaterial color="#3b82f6" transparent opacity={0.8} />
        <Html position={[0, 1, 0]} center style={{ pointerEvents: 'none' }}>
          <div style={{ color: '#38bdf8', fontSize: '10px', background: 'rgba(0,0,0,0.5)', padding: '2px 4px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
            UW-00733 · HT Power
          </div>
        </Html>
      </mesh>
    </group>
  );
};

const CompassObserver = ({ onCameraRotate }) => {
  const { camera } = useThree();
  const lastAngle = useRef(null);

  useFrame(() => {
    if (onCameraRotate) {
      const angle = Math.atan2(camera.position.x, camera.position.z);
      // Small optimization: only callback if angle changes by > 0.01 rad
      if (lastAngle.current === null || Math.abs(lastAngle.current - angle) > 0.01) {
        lastAngle.current = angle;
        onCameraRotate(angle);
      }
    }
  });
  return null;
};

const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);

const CameraController = ({ preset, viewMode }) => {
  const { camera, controls } = useThree();
  
  React.useEffect(() => {
    if (!controls) return;
    let targetPos = new THREE.Vector3(45, 35, 45);
    let targetLook = new THREE.Vector3(0, 8, 0);
    
    if (viewMode === '2D' || preset === 'top') {
      targetPos.set(0, 120, 0);
      targetLook.set(0, 0, 0);
    } else if (preset === 'side') {
      targetPos.set(60, 15, 0);
      targetLook.set(0, 8, 0);
    } else if (preset === 'front') {
      targetPos.set(0, 15, 60);
      targetLook.set(0, 8, 0);
    } else if (preset === 'isometric' || preset === 'reset') {
      targetPos.set(45, 35, 45);
      targetLook.set(0, 8, 0);
    }
    
    const startPos = camera.position.clone();
    const startTarget = controls.target.clone();
    
    let animationFrameId;
    let startTime = null;
    const duration = 600;

    const animate = (time) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeOutCubic(progress);
      
      camera.position.lerpVectors(startPos, targetPos, ease);
      controls.target.lerpVectors(startTarget, targetLook, ease);
      controls.update();
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [preset, viewMode, camera, controls]);
  
  return null;
};

export default function Viewer3D({ visibleLayers, cameraPreset, resetTrigger, selectedUlpin, onSelect, viewMode, onCameraRotate }) {
  // Use selectedUlpin to control highlighting, but for this realistic scene we map it to our units.
  // We check visibleLayers from PropertyMap (e.g. utilities, tunnels, units, buildings, parcels).
  
  const showUnderground = visibleLayers?.utilities || visibleLayers?.tunnels;
  const is2D = viewMode === '2D';

  return (
    <div style={{ width: '100%', height: '100%', background: '#05080f' }}>
      <Canvas shadows camera={{ position: [45, 30, 45], fov: 45, near: 0.1, far: 500 }}>
        <fog attach="fog" args={['#05080f', 60, 200]} />
        
        <CompassObserver onCameraRotate={onCameraRotate} />

        <ambientLight intensity={0.4} />
        <hemisphereLight args={['#22d3ee', '#0a1220', 0.3]} />
        <directionalLight position={[30, 40, 20]} intensity={1.2} castShadow shadow-mapSize={[2048, 2048]} />

        <CameraController preset={cameraPreset} viewMode={viewMode} key={resetTrigger} />
        
        <OrbitControls 
          makeDefault
          dampingFactor={0.05} 
          enablePan={true} 
          enableRotate={!is2D}
          minDistance={15} 
          maxDistance={150}
          maxPolarAngle={is2D ? 0 : (showUnderground ? Math.PI * 0.7 : Math.PI / 2 - 0.05)}
          minPolarAngle={is2D ? 0 : 0}
        />

        <Plane args={[300, 300]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <meshStandardMaterial 
            color="#05080f" 
            transparent={showUnderground} 
            opacity={showUnderground ? 0.3 : 1}
            depthWrite={!showUnderground}
          />
        </Plane>

        {!is2D ? (
          <Grid cellColor="#14213d" sectionColor="#22d3ee" fadeDistance={120} infiniteGrid={true} position={[0, 0, 0]} />
        ) : (
          <Grid cellColor="#0a1220" sectionColor="#14213d" fadeDistance={120} infiniteGrid={true} position={[0, 0, 0]} />
        )}

        {visibleLayers?.parcels && <ParcelBoundary is2D={is2D} selectedUnit={selectedUlpin} onSelect={onSelect} />}
        {visibleLayers?.roads && <RoadNetwork is2D={is2D} selectedUnit={selectedUlpin} onSelect={onSelect} />}
        {visibleLayers?.buildings && <RealisticBuilding selectedUnit={selectedUlpin} onSelect={onSelect} is2D={is2D} />}
        {showUnderground && <UndergroundLayer selectedUnit={selectedUlpin} onSelect={onSelect} />}
        
      </Canvas>
    </div>
  );
}
