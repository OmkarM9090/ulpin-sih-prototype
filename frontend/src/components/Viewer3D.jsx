import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Html, Plane, Edges, Instance, Instances, Line } from '@react-three/drei';
import * as THREE from 'three';

const ParcelBoundary = ({ is2D, selectedUnit, onSelect }) => {
  const parcels = [
    { id: 'P001', isMain: true, pos: [0, 0, 0], size: [29, 39], label: 'MH-PUN-P123456', area: '1,200 m²' },
    { id: 'P002', isMain: false, pos: [-30, 0, 0], size: [29, 39] },
    { id: 'P003', isMain: false, pos: [30, 0, 0], size: [29, 39] },
    { id: 'P004', isMain: false, pos: [0, 0, -40], size: [29, 39] },
    { id: 'P005', isMain: false, pos: [-30, 0, -40], size: [29, 39] },
    { id: 'P006', isMain: false, pos: [30, 0, -40], size: [29, 39] },
  ];

  const [hoveredId, setHoveredId] = useState(null);

  return (
    <group>
      {parcels.map((parcel) => {
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
              color={parcel.isMain ? "#22d3ee" : "#2a3a5c"} 
              transparent 
              opacity={parcel.isMain ? 0.08 : 0.02} 
              side={THREE.DoubleSide} 
            />
            <Edges scale={1} color={parcel.isMain ? "#22d3ee" : "#2a3a5c"} />
          </mesh>
          
          {/* Parcel Label (Only show main label) */}
          {parcel.isMain && (
            <Html 
              position={[0, 0.2, 19]} 
              center 
              zIndexRange={[100, 0]} 
              style={{ pointerEvents: 'none', transition: 'all 0.3s' }}
            >
              <div style={{
                background: '#0a1220',
                color: '#22d3ee', 
                padding: '4px 8px',
                borderRadius: '4px', 
                fontSize: '11px', 
                whiteSpace: 'nowrap',
                border: '1px solid #1e2a44', 
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                fontFamily: 'var(--mono)', 
                fontWeight: 600,
              }}>
                {parcel.label} • {parcel.area}
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
  return (
    <group>
      {/* Main East-West Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 26]}>
        <planeGeometry args={[120, 12]} />
        <meshBasicMaterial color="#0a1220" transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Main Road Centerline (Dashed) */}
      <Line
        points={[[-60, 0.01, 26], [60, 0.01, 26]]}
        color="#cbd5e1"
        lineWidth={2}
        dashed={true}
        dashSize={2}
        gapSize={2}
        opacity={0.6}
        transparent
      />

      {/* Secondary North-South Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[51, 0.005, -10]}>
        <planeGeometry args={[8, 84]} />
        <meshBasicMaterial color="#0a1220" transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Secondary Road Centerline (Dashed) */}
      <Line
        points={[[51, 0.01, -52], [51, 0.01, 32]]}
        color="#cbd5e1"
        lineWidth={2}
        dashed={true}
        dashSize={2}
        gapSize={2}
        opacity={0.6}
        transparent
      />
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
            background: '#0a1220', color: '#22d3ee', border: '1px solid #1e2a44',
            padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600, whiteSpace: 'nowrap',
            fontFamily: 'var(--mono)'
          }}>
            {label}<br/><span style={{ fontSize: '8px', color: '#94a3b8' }}>Illustrative Layout</span>
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
      // SLIDE OUT BY 8 METERS HORIZONTALLY
      const targetX = (isSelected || isRoomSelected) ? xOffset + dir * 8 : xOffset;
      meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.15;
    }
  });

  const baseColor = "#e5e5e5"; // Realistic beige wall color
  const glow = isActive ? "#22d3ee" : (hovered ? "#06b6d4" : "#000000");

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
          emissiveIntensity={isActive ? 0.5 : (hovered ? 0.2 : 0)}
          roughness={0.8}
          transparent={false}
          opacity={1}
          depthWrite={true}
        />
        {isActive && <Edges color="#22d3ee" scale={1.01} />}
      </mesh>

      {isActive && (
        <group>
          <Room unitId={unitId} roomId={`${unitId}-R01`} label="Living Room" args={[3.8, 2.5, 6]} position={[xOffset < 0 ? 2 : -2, 0, 3.5]} selectedId={selectedId} onClick={onClick} />
          <Room unitId={unitId} roomId={`${unitId}-R02`} label="Bedroom" args={[3.8, 2.5, 5]} position={[xOffset < 0 ? 2 : -2, 0, -3.5]} selectedId={selectedId} onClick={onClick} />
          <Room unitId={unitId} roomId={`${unitId}-R03`} label="Kitchen/Bath" args={[3.8, 2.5, 4]} position={[xOffset < 0 ? -2 : 2, 0, 1.5]} selectedId={selectedId} onClick={onClick} />
        </group>
      )}

      {(isActive || hovered) && !isRoomSelected && (
        <Html position={[0, args[1]/2 + 0.5, 0]} center style={{ pointerEvents: 'none' }}>
          <div style={{
            background: '#0a1220', color: '#22d3ee', border: '1px solid #1e2a44',
            padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600,
            fontFamily: 'var(--mono)'
          }}>
            F0{level}-{unitId}
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
  const isFloorActive = selectedLevel === level; 

  useFrame(() => {
    if (meshRef.current) {
      const targetScale = (isFloorSelected || hovered) ? 1.01 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, 1, targetScale), 0.15);

      const targetY = (selectedLevel !== null && level > selectedLevel) ? yPos + 12 : yPos;
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.1;
    }
  });

  const baseColor = "#e5e5e5"; // Light beige realistic walls
  const slabColor = "#52525b"; // Dark grey floor separators
  const glow = isFloorSelected ? "#22d3ee" : (hovered ? "#0ea5e9" : "#000000");

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
        <boxGeometry args={[1.2, 1.2, 0.05]} />
        <meshStandardMaterial color="#020617" roughness={0.1} metalness={0.9} emissive="#0ea5e9" emissiveIntensity={0.05} />
        {[-7, -4.5, 4.5, 7].map((x, j) => (
          <React.Fragment key={`fb-${j}`}>
            <Instance position={[x, 0.2, 6.91]} />
            <Instance position={[x, 0.2, -6.91]} />
          </React.Fragment>
        ))}
        {[-4, -1.5, 1.5, 4].map((z, j) => (
          <React.Fragment key={`side-${j}`}>
            <Instance position={[8.91, 0.2, z]} rotation={[0, Math.PI / 2, 0]} />
            <Instance position={[-8.91, 0.2, z]} rotation={[0, Math.PI / 2, 0]} />
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
       <meshStandardMaterial color="#a1a1aa" />
    </mesh>
    {/* Parapet Walls */}
    <mesh position={[0, 0.2, 7.1]} castShadow>
       <boxGeometry args={[18.4, 1.0, 0.2]} />
       <meshStandardMaterial color="#e5e5e5" />
    </mesh>
    <mesh position={[0, 0.2, -7.1]} castShadow>
       <boxGeometry args={[18.4, 1.0, 0.2]} />
       <meshStandardMaterial color="#e5e5e5" />
    </mesh>
    <mesh position={[9.1, 0.2, 0]} castShadow>
       <boxGeometry args={[0.2, 1.0, 14.4]} />
       <meshStandardMaterial color="#e5e5e5" />
    </mesh>
    <mesh position={[-9.1, 0.2, 0]} castShadow>
       <boxGeometry args={[0.2, 1.0, 14.4]} />
       <meshStandardMaterial color="#e5e5e5" />
    </mesh>

    {/* Elevator / Service Core */}
    <mesh position={[0, 1.0, 0]} castShadow>
      <boxGeometry args={[4, 2.5, 4]} />
      <meshStandardMaterial color="#e5e5e5" />
    </mesh>

    {/* Water Tanks */}
    <mesh position={[6, 1.0, -4]} castShadow>
      <cylinderGeometry args={[0.8, 0.8, 2.5, 16]} />
      <meshStandardMaterial color="#2563eb" roughness={0.4} metalness={0.1} />
    </mesh>
    <mesh position={[4, 1.0, -4]} castShadow>
      <cylinderGeometry args={[0.8, 0.8, 2.5, 16]} />
      <meshStandardMaterial color="#2563eb" roughness={0.4} metalness={0.1} />
    </mesh>
  </group>
  );
};

const RealisticBuilding = ({ selectedUnit, onSelect }) => {
  let selectedLevel = null;
  if (selectedUnit) {
    if (selectedUnit.startsWith('UNIT-L')) {
      selectedLevel = parseInt(selectedUnit.replace('UNIT-L', ''), 10);
    } else if (selectedUnit.startsWith('U0')) {
      const match = selectedUnit.match(/U0(\d+)/);
      if (match) selectedLevel = parseInt(match[1], 10);
    }
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
        <boxGeometry args={[10, 8, 80]} />
        <meshStandardMaterial color="#22d3ee" transparent opacity={0.3} />
        <Html position={[0, 4, 0]} center style={{ pointerEvents: 'none' }}>
          <div style={{ color: '#22d3ee', fontSize: '11px', background: '#0a1220', border: '1px solid #1e2a44', padding: '4px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
            UM-00451 · Metro Corridor
          </div>
        </Html>
      </mesh>

      {/* Water Main Utility Line */}
      <mesh position={[-8, -3, 0]}>
        <boxGeometry args={[2, 2, 80]} />
        <meshStandardMaterial color="#3b82f6" transparent opacity={0.6} />
        <Html position={[0, 1.5, 0]} center style={{ pointerEvents: 'none' }}>
          <div style={{ color: '#3b82f6', fontSize: '11px', background: '#0a1220', border: '1px solid #1e2a44', padding: '4px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
            UW-00451 · Water Main
          </div>
        </Html>
      </mesh>

      {/* HT Power Duct */}
      <mesh position={[12, -2, 0]}>
        <boxGeometry args={[1.5, 1.5, 80]} />
        <meshStandardMaterial color="#f59e0b" transparent opacity={0.6} />
        <Html position={[0, 1.5, 0]} center style={{ pointerEvents: 'none' }}>
          <div style={{ color: '#f59e0b', fontSize: '11px', background: '#0a1220', border: '1px solid #1e2a44', padding: '4px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
            UE-00892 · HT Power Duct
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
  const showUnderground = visibleLayers?.utilities || visibleLayers?.tunnels;
  const is2D = viewMode === '2D';

  return (
    <div style={{ width: '100%', height: '100%', background: '#05080f', position: 'relative' }}>
      
      {/* North Compass Overlay */}
      <div style={{
        position: 'absolute', top: '24px', right: '24px', zIndex: 10,
        background: 'rgba(10, 18, 32, 0.7)', border: '1px solid #1e2a44',
        color: '#22d3ee', padding: '8px 12px', borderRadius: '8px',
        fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: 700,
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)', pointerEvents: 'none',
        display: 'flex', alignItems: 'center', gap: '4px', backdropFilter: 'blur(4px)'
      }}>
        <span style={{ fontSize: '14px' }}>N</span> ↑
      </div>

      <Canvas shadows camera={{ position: [45, 30, 45], fov: 45, near: 0.1, far: 500 }}>
        <color attach="background" args={['#05080f']} />
        <fog attach="fog" args={['#05080f', 60, 200]} />
        
        <CompassObserver onCameraRotate={onCameraRotate} />

        <ambientLight intensity={0.5} />
        <hemisphereLight args={['#22d3ee', '#0a1220', 0.4]} />
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

        <Grid cellColor="#1e2a44" sectionColor="#2a3a5c" fadeDistance={200} infiniteGrid={true} position={[0, 0, 0]} />

        {visibleLayers?.parcels && <ParcelBoundary is2D={is2D} selectedUnit={selectedUlpin} onSelect={onSelect} />}
        {visibleLayers?.roads && <RoadNetwork is2D={is2D} selectedUnit={selectedUlpin} onSelect={onSelect} />}
        {visibleLayers?.buildings && <RealisticBuilding selectedUnit={selectedUlpin} onSelect={onSelect} is2D={is2D} />}
        {showUnderground && <UndergroundLayer selectedUnit={selectedUlpin} onSelect={onSelect} />}
        
      </Canvas>
    </div>
  );
}
