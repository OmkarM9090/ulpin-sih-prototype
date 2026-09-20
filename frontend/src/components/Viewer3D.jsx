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
          UP-LKO-P123456 · 2,450 m²
        </div>
      </Html>
    </group>
  );
};

const Floor = ({ level, yPos, color, isSelected, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      const targetScale = (isSelected || hovered) ? 1.02 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, 1, targetScale), 0.1);
    }
  });

  return (
    <group position={[0, yPos, 0]}>
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(`UNIT-L${level}`); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
        castShadow receiveShadow
      >
        <boxGeometry args={[18, 3, 14]} />
        <meshStandardMaterial 
          color={color}
          emissive={isSelected ? "#22d3ee" : (hovered ? "#14b8a6" : "#000000")}
          emissiveIntensity={isSelected ? 0.4 : (hovered ? 0.2 : 0)}
          roughness={0.8}
        />
        {(isSelected || hovered) && <Edges color="#22d3ee" scale={1.01} />}
      </mesh>
      
      {(isSelected || hovered) && (
        <Html position={[0, 1.5, 0]} center style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'var(--bg-1)', color: 'var(--accent)', border: '1px solid var(--accent)',
            padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700
          }}>
            UNIT-L{level}
          </div>
        </Html>
      )}
    </group>
  );
};

const Windows = () => {
  return (
    <Instances limit={100} castShadow>
      <boxGeometry args={[0.8, 1.2, 0.1]} />
      <meshStandardMaterial color="#05080f" roughness={0.1} metalness={0.8} />
      {/* Generate windows along the Z-faces (front and back) */}
      {[1.5, 4.5, 7.5, 10.5, 13.5, 16.5].map((y, i) => (
        <React.Fragment key={i}>
          {[-7, -3, 3, 7].map((x, j) => (
            <React.Fragment key={`${i}-${j}`}>
              <Instance position={[x, y, 7.05]} />
              <Instance position={[x, y, -7.05]} />
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}
      {/* Generate windows along the X-faces (left and right) */}
      {[1.5, 4.5, 7.5, 10.5, 13.5, 16.5].map((y, i) => (
        <React.Fragment key={`side-${i}`}>
          {[-4, 0, 4].map((z, j) => (
            <React.Fragment key={`side-${i}-${j}`}>
              <Instance position={[9.05, y, z]} rotation={[0, Math.PI / 2, 0]} />
              <Instance position={[-9.05, y, z]} rotation={[0, Math.PI / 2, 0]} />
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}
    </Instances>
  );
};

const Roof = () => (
  <group position={[0, 18, 0]}>
    {/* Railing */}
    <mesh position={[0, 0.4, 0]} castShadow>
      <boxGeometry args={[18, 0.8, 14]} />
      <meshStandardMaterial color="#52525b" transparent opacity={0.6} />
    </mesh>
    {/* Water Tanks */}
    <mesh position={[6, 1, -4]} castShadow>
      <cylinderGeometry args={[0.8, 0.8, 2, 16]} />
      <meshStandardMaterial color="#0284c7" />
    </mesh>
    <mesh position={[4, 1, -4]} castShadow>
      <cylinderGeometry args={[0.8, 0.8, 2, 16]} />
      <meshStandardMaterial color="#0284c7" />
    </mesh>
  </group>
);

const RealisticBuilding = ({ selectedUnit, onSelect }) => {
  const colors = ['#d4d4d8', '#a1a1aa', '#d4d4d8', '#a1a1aa', '#d4d4d8', '#a1a1aa'];
  
  return (
    <group>
      {/* Ground Floor Entrance */}
      <mesh position={[0, 1.2, 7.02]}>
        <boxGeometry args={[3, 2.4, 0.1]} />
        <meshStandardMaterial color="#18181b" />
      </mesh>

      {/* Floors */}
      {colors.map((color, i) => (
        <Floor 
          key={i} 
          level={i} 
          yPos={1.5 + i * 3} 
          color={color} 
          isSelected={selectedUnit === `UNIT-L${i}`} 
          onClick={onSelect}
        />
      ))}
      
      <Windows />
      <Roof />
    </group>
  );
};

const UndergroundLayer = () => {
  return (
    <group>
      {/* Basement 1 & 2 */}
      <mesh position={[0, -2, 0]}>
        <boxGeometry args={[20, 3, 16]} />
        <meshStandardMaterial color="#f59e0b" transparent opacity={0.4} />
      </mesh>
      <mesh position={[0, -5, 0]}>
        <boxGeometry args={[20, 3, 16]} />
        <meshStandardMaterial color="#f59e0b" transparent opacity={0.4} />
      </mesh>

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

const CameraController = ({ preset }) => {
  const { camera, controls } = useThree();
  
  React.useEffect(() => {
    if (!controls) return;
    let targetPos = new THREE.Vector3(45, 30, 45);
    let targetLook = new THREE.Vector3(0, 8, 0);
    
    if (preset === 'top') {
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
  }, [preset, camera, controls]);
  
  return null;
};

export default function Viewer3D({ visibleLayers, cameraPreset, resetTrigger, selectedUlpin, onSelect }) {
  // Use selectedUlpin to control highlighting, but for this realistic scene we map it to our units.
  // We check visibleLayers from PropertyMap (e.g. utilities, tunnels, units, buildings, parcels).
  
  const showUnderground = visibleLayers?.utilities || visibleLayers?.tunnels;

  return (
    <div style={{ width: '100%', height: '100%', background: '#05080f' }}>
      <Canvas shadows camera={{ position: [45, 30, 45], fov: 45, near: 0.1, far: 500 }}>
        <fog attach="fog" args={['#05080f', 60, 200]} />
        
        <ambientLight intensity={0.4} />
        <hemisphereLight args={['#22d3ee', '#0a1220', 0.3]} />
        <directionalLight position={[30, 40, 20]} intensity={1.2} castShadow shadow-mapSize={[2048, 2048]} />

        <CameraController preset={cameraPreset} key={resetTrigger} />
        <OrbitControls dampingFactor={0.08} enablePan={true} minDistance={15} maxDistance={150} />

        <Plane args={[300, 300]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <meshStandardMaterial color="#05080f" />
        </Plane>

        <Grid cellColor="#14213d" sectionColor="#22d3ee" fadeDistance={120} infiniteGrid={true} position={[0, 0, 0]} />

        {visibleLayers?.parcels && <ParcelBoundary />}
        {visibleLayers?.buildings && <RealisticBuilding selectedUnit={selectedUlpin} onSelect={onSelect} />}
        {showUnderground && <UndergroundLayer />}
        
      </Canvas>
    </div>
  );
}
