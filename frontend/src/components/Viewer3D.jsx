import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Html, Plane, Edges, Instance, Instances } from '@react-three/drei';
import * as THREE from 'three';

const ParcelBoundary = () => {
  return (
    <group>
      {/* Cyan outline & slight fill */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[25, 20]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.08} side={THREE.DoubleSide} />
        <Edges scale={1} color="#22d3ee" />
      </mesh>
      
      {/* Label */}
      <Html position={[0, 19, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
        <div style={{
          background: 'rgba(5, 8, 15, 0.8)', color: 'white', padding: '4px 10px',
          borderRadius: '4px', fontSize: '11px', whiteSpace: 'nowrap',
          border: '1px solid var(--border-2)', boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          fontFamily: 'var(--mono)', fontWeight: 600
        }}>
          MH-PUN-P123456 · 2,450 m²
        </div>
      </Html>
    </group>
  );
};

const RoomLayout = ({ isVisible }) => {
  if (!isVisible) return null;
  return (
    <group>
      {/* Central Corridor */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[17.6, 2.6, 0.2]} />
        <meshStandardMaterial color="#334155" transparent opacity={0.8} />
      </mesh>
      {/* Dividing walls */}
      <mesh position={[-4, 0, -3.4]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 2.6, 6.8]} />
        <meshStandardMaterial color="#334155" transparent opacity={0.8} />
      </mesh>
      <mesh position={[4, 0, -3.4]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 2.6, 6.8]} />
        <meshStandardMaterial color="#334155" transparent opacity={0.8} />
      </mesh>
      <mesh position={[-4, 0, 3.4]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 2.6, 6.8]} />
        <meshStandardMaterial color="#334155" transparent opacity={0.8} />
      </mesh>
      <mesh position={[4, 0, 3.4]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 2.6, 6.8]} />
        <meshStandardMaterial color="#334155" transparent opacity={0.8} />
      </mesh>

      <Html position={[0, 2.2, 0]} center style={{ pointerEvents: 'none' }} zIndexRange={[100, 0]}>
        <div style={{
          background: 'rgba(5, 8, 15, 0.85)', color: 'var(--text-3)', border: '1px dashed var(--text-4)',
          padding: '4px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: 600, whiteSpace: 'nowrap',
          letterSpacing: '0.02em'
        }}>
          Illustrative Room Layout · Controlled Demo Data
        </div>
      </Html>
    </group>
  );
};

const Floor = ({ level, yPos, isSelected, selectedLevel, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      const targetScale = (isSelected || hovered) ? 1.02 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, 1, targetScale), 0.15);

      const targetY = (selectedLevel !== null && level > selectedLevel) ? yPos + 12 : yPos;
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.1;
    }
  });

  const baseColor = "#1e293b"; 
  const slabColor = "#0f172a";
  const glow = isSelected ? "#22d3ee" : (hovered ? "#14b8a6" : "#000000");
  const displayLabel = level === 0 ? "Ground Floor" : `Floor ${level}`;

  return (
    <group position={[0, yPos, 0]} ref={meshRef}>
      {/* Floor Slab separator */}
      <mesh position={[0, -1.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[18.4, 0.2, 14.4]} />
        <meshStandardMaterial color={slabColor} roughness={0.9} />
      </mesh>
      
      {/* Main Core */}
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
          emissiveIntensity={isSelected ? 0.3 : (hovered ? 0.15 : 0)}
          roughness={0.7}
          transparent={isSelected}
          opacity={isSelected ? 0.15 : 1}
          depthWrite={!isSelected}
        />
        {(isSelected || hovered) && <Edges color="#22d3ee" scale={1.01} />}
      </mesh>

      {/* Room Layout revealed when floor is selected */}
      <RoomLayout isVisible={isSelected} />

      {/* Front Balcony */}
      <mesh position={[0, -0.6, 7.1]} castShadow>
        <boxGeometry args={[6, 0.1, 1]} />
        <meshStandardMaterial color={slabColor} />
      </mesh>
      {/* Balcony Glass/Railing */}
      <mesh position={[0, 0, 7.55]} castShadow>
        <boxGeometry args={[6, 1.2, 0.05]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.3} roughness={0.1} metalness={0.8} />
      </mesh>

      {(isSelected || hovered) && (
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
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.3, 7.13]} castShadow>
            <boxGeometry args={[2, 2.2, 0.05]} />
            <meshStandardMaterial color="#38bdf8" transparent opacity={0.3} roughness={0.1} metalness={0.9} />
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

const RealisticBuilding = ({ selectedUnit, onSelect }) => {
  let selectedLevel = null;
  if (selectedUnit && selectedUnit.startsWith('UNIT-L')) {
    selectedLevel = parseInt(selectedUnit.replace('UNIT-L', ''), 10);
  }

  return (
    <group>
      {/* Floors */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Floor 
          key={i} 
          level={i} 
          yPos={1.5 + i * 3} 
          isSelected={selectedUnit === `UNIT-L${i}`} 
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

const CameraController = ({ preset, viewMode }) => {
  const { camera, controls } = useThree();
  
  React.useEffect(() => {
    if (!controls) return;
    let targetPos = new THREE.Vector3(45, 30, 45);
    let targetLook = new THREE.Vector3(0, 8, 0);
    
    if (viewMode === '2D' || preset === 'top') {
      targetPos.set(0, 80, 0);
      targetLook.set(0, 0, 0);
    } else if (preset === 'side') {
      targetPos.set(60, 10, 0);
    }
    
    const startPos = camera.position.clone();
    const startTarget = controls.target.clone();
    let frame = 0;
    const animate = () => {
      frame++;
      const t = frame / 30;
      camera.position.lerpVectors(startPos, targetPos, t);
      controls.target.lerpVectors(startTarget, targetLook, t);
      controls.update();
      if (frame < 30) requestAnimationFrame(animate);
    };
    animate();
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
          dampingFactor={0.05} 
          enablePan={true} 
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

        <Grid cellColor="#14213d" sectionColor="#22d3ee" fadeDistance={120} infiniteGrid={true} position={[0, 0, 0]} />

        {visibleLayers?.parcels && <ParcelBoundary />}
        {visibleLayers?.buildings && <RealisticBuilding selectedUnit={selectedUlpin} onSelect={onSelect} />}
        {showUnderground && <UndergroundLayer selectedUnit={selectedUlpin} onSelect={onSelect} />}
        
      </Canvas>
    </div>
  );
}
