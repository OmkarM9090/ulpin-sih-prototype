import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Html, Edges, Shape } from '@react-three/drei';
import * as THREE from 'three';
import { API_BASE_URL } from '../config';

const getColor = (type, level) => {
  if (type === 'metro') return '#dc2626';
  if (type === 'utility') return '#3b82f6';
  if (type === 'garden') return '#16a34a';
  if (type === 'water_tank') return '#06b6d4';
  if (level === 'L-01' || level === 'L-02') return '#f59e0b';
  if (level === 'L00') return '#eab308';
  if (level === 'L01') return '#38bdf8';
  if (level === 'L02') return '#818cf8';
  if (level === 'L03') return '#c084fc';
  if (level === 'LC01') return '#a855f7';
  return '#cbd5e1';
};

const getOpacity = (type, level) => {
  if (type === 'metro') return 0.65;
  if (type === 'utility') return 0.75;
  if (type === 'garden') return 0.6;
  if (level === 'L-01' || level === 'L-02') return 0.75;
  return 0.85;
};

const getEmoji = (type) => {
  if (type === 'metro') return '🚇';
  if (type === 'utility') return '💧';
  if (type === 'garden') return '🌳';
  if (type === 'water_tank') return '🚰';
  return '';
};

// Returns a level index to multiply by 4 for explode
const getLevelIndex = (level, type) => {
  if (type === 'metro') return -3;
  if (level === 'L-02') return -2;
  if (level === 'L-01') return -1;
  if (level === 'LU01') return -0.5; // utility
  if (level === 'L00') return 0;
  if (level === 'LC02') return 0; // garden
  if (level === 'L01') return 1;
  if (level === 'L02') return 2;
  if (level === 'L03') return 3;
  if (level === 'LC01') return 4; // terrace
  if (level === 'LC03') return 5; // water tank
  return 0;
};

const UnitMesh = ({ unit, explodeValue, showLabels, isSelected, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();
  
  const xs = unit.footprint.map(p => p[0]);
  const ys = unit.footprint.map(p => p[1]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const sz_x = Math.max(...xs) - Math.min(...xs);
  const sz_z = Math.max(...ys) - Math.min(...ys);
  
  const height = unit.z_max - unit.z_min;
  const center_y = unit.z_min + height / 2;

  const levelIdx = getLevelIndex(unit.level, unit.type);
  const explodeOffset = (explodeValue / 100) * (levelIdx * 4);
  const finalY = center_y + explodeOffset;

  const color = getColor(unit.type, unit.level);
  const opacity = getOpacity(unit.type, unit.level);
  const emoji = getEmoji(unit.type);
  
  const alwaysShowEmoji = !!emoji;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, finalY, 0.1);
      const targetScale = hovered ? 1.02 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered]);

  return (
    <group position={[cx, 0, cy]} ref={meshRef}>
      <mesh
        onClick={(e) => { e.stopPropagation(); onSelect(unit.ulpin); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[sz_x, height, sz_z]} />
        <meshStandardMaterial 
          color={color}
          transparent 
          opacity={opacity}
          emissive={color}
          emissiveIntensity={hovered ? 0.3 : 0}
          roughness={0.2}
          metalness={0.1}
        />
        <Edges 
          scale={1.001} 
          color={isSelected ? '#fbbf24' : hovered ? '#38bdf8' : 'rgba(255,255,255,0.35)'} 
          threshold={15} 
        />
      </mesh>
      
      {(showLabels || alwaysShowEmoji) && (
        <Html distanceFactor={12} position={[0, height / 2 + 0.5, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.85)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            whiteSpace: 'nowrap',
            border: '1px solid #38bdf8',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            fontWeight: '600'
          }}>
            {emoji && `${emoji} `}
            {(showLabels) ? unit.unit_id : ''}
          </div>
        </Html>
      )}
    </group>
  );
};

// Creates a 2D shape for the parcel boundary extrusion
const ExtrudedParcel = ({ coords }) => {
  if (!coords || coords.length === 0) return null;
  const shape = new THREE.Shape();
  shape.moveTo(coords[0].x, coords[0].z);
  for (let i = 1; i < coords.length; i++) {
    shape.lineTo(coords[i].x, coords[i].z);
  }
  
  const extrudeSettings = { depth: 0.05, bevelEnabled: false };
  
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshBasicMaterial color="#38bdf8" transparent opacity={0.05} />
      <Edges scale={1.001} color="#38bdf8" />
    </mesh>
  );
};

const CameraController = ({ preset, resetTrigger }) => {
  const { camera, controls } = useThree();
  
  useEffect(() => {
    if (!controls) return;
    
    let targetPos = new THREE.Vector3(35, 25, 35);
    let targetLook = new THREE.Vector3(0, 7, 0);
    
    if (preset === 'top') {
      targetPos.set(15, 80, 20);
      targetLook.set(15, 0, 20);
    } else if (preset === 'front') {
      targetPos.set(15, 5, 80);
      targetLook.set(15, 5, 20);
    } else if (preset === 'underground') {
      targetPos.set(15, -30, 60);
      targetLook.set(15, -5, 20);
    }
    
    // Animate camera
    const startPos = camera.position.clone();
    const startTarget = controls.target.clone();
    let frame = 0;
    const animate = () => {
      frame++;
      const t = frame / 30; // 30 frames approx 0.5s
      camera.position.lerpVectors(startPos, targetPos, t);
      controls.target.lerpVectors(startTarget, targetLook, t);
      controls.update();
      if (frame < 30) requestAnimationFrame(animate);
    };
    animate();
    
  }, [preset, resetTrigger, camera, controls]);
  
  return null;
};

const Compass = () => {
  const { camera } = useThree();
  const [rotation, setRotation] = useState(0);

  useFrame(() => {
    const angle = Math.atan2(camera.position.x, camera.position.z);
    setRotation(angle);
  });

  return (
    <Html position={[-30, 5, 30]} center zIndexRange={[10, 0]}>
      <div style={{
        width: '60px', height: '60px', background: 'var(--bg-panel)',
        borderRadius: '8px', border: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: 'var(--shadow-md)', color: 'var(--text-muted)', fontSize: '10px',
        fontWeight: 600, position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: 4 }}>N</div>
        <div style={{ position: 'absolute', bottom: 4 }}>S</div>
        <div style={{ position: 'absolute', right: 4 }}>E</div>
        <div style={{ position: 'absolute', left: 4 }}>W</div>
        <div style={{
          width: '40px', height: '40px', border: '2px solid var(--border-default)', borderRadius: '50%',
          transform: `rotate(${-rotation}rad)`, transition: 'transform 0.1s'
        }}>
          <div style={{ width: '2px', height: '18px', background: 'var(--danger)', margin: '0 auto' }}></div>
          <div style={{ width: '2px', height: '18px', background: 'var(--text-primary)', margin: '0 auto' }}></div>
        </div>
      </div>
    </Html>
  );
};

export default function Viewer3D({ 
  systemData, explodeValue, showLabels, showGrid, 
  visibleLayers, cameraPreset, resetTrigger,
  selectedUlpin, onSelect 
}) {
  const [parcelOutline, setParcelOutline] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/parcel`)
      .then(r => r.json())
      .then(d => {
        const coords = d.features[0].geometry.coordinates[0];
        const points = coords.map(p => new THREE.Vector3(p[0], 0, p[1]));
        setParcelOutline(points);
      })
      .catch(e => console.error(e));
  }, []);

  const units = systemData?.units || [];
  
  const filteredUnits = units.filter(u => {
    if (u.type === 'metro' && !visibleLayers.metro) return false;
    if (u.type === 'utility' && !visibleLayers.utility) return false;
    if (u.type === 'garden' && !visibleLayers.common) return false;
    if (u.type === 'water_tank' && !visibleLayers.terrace) return false;
    if (u.level === 'LC01' && !visibleLayers.terrace) return false;
    if ((u.level === 'L-01' || u.level === 'L-02') && !visibleLayers.basements) return false;
    if ((u.level === 'L00' || u.level === 'L01' || u.level === 'L02' || u.level === 'L03') && !visibleLayers.apartments) return false;
    return true;
  });

  return (
    <div style={{ 
      width: '100%', height: '100%', 
      background: 'radial-gradient(circle at center, #0b1120 0%, #06080f 100%)' 
    }}>
      <Canvas shadows camera={{ position: [35, 25, 35], fov: 45, near: 0.1, far: 500 }}>
        <fog attach="fog" args={['#0b1120', 80, 220]} />
        
        <ambientLight intensity={0.55} />
        <hemisphereLight args={['#38bdf8', '#0b1120', 0.35]} />
        <directionalLight 
          position={[25, 40, 20]} 
          intensity={1.1} 
          castShadow 
          shadow-mapSize={[2048, 2048]} 
        />
        
        <CameraController preset={cameraPreset} resetTrigger={resetTrigger} />
        <OrbitControls 
          dampingFactor={0.08} 
          enablePan={true} 
          minDistance={12} 
          maxDistance={120} 
          maxPolarAngle={cameraPreset === 'underground' ? Math.PI : Math.PI * 0.49}
        />
        
        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color="#0d1524" transparent opacity={0.65} depthWrite={false} />
        </mesh>

        {showGrid && (
          <Grid infiniteGrid fadeDistance={100} sectionColor="#334155" cellColor="#1e293b" position={[0, 0, 0]} />
        )}

        {/* Parcel Boundary */}
        {visibleLayers.boundary && parcelOutline && (
          <ExtrudedParcel coords={parcelOutline} />
        )}

        {/* Building Footprint in White */}
        {visibleLayers.boundary && units.length > 0 && (() => {
          const gf = units.find(u => u.level === 'L00');
          if (gf) {
            const pts = gf.footprint.map(p => new THREE.Vector3(p[0], 0.06, p[1]));
            return (
              <line>
                <bufferGeometry>
                  <bufferAttribute 
                    attach="attributes-position" 
                    count={pts.length}
                    array={new Float32Array(pts.flatMap(p => [p.x, p.y, p.z]))}
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial color="#f8fafc" transparent opacity={0.3} linewidth={2} />
              </line>
            );
          }
          return null;
        })()}

        {/* 3D Property Units */}
        {filteredUnits.map((unit) => (
          <UnitMesh 
            key={unit.unit_id} 
            unit={unit} 
            explodeValue={explodeValue} 
            showLabels={showLabels} 
            isSelected={selectedUlpin === unit.ulpin}
            onSelect={onSelect} 
          />
        ))}

        <Compass />
      </Canvas>
      <div style={{ position: 'absolute', bottom: '16px', right: '16px', opacity: 0.35, fontSize: '11px', color: 'var(--text-muted)', pointerEvents: 'none' }}>
        GeoCadastre 3D · SIH 2026
      </div>
    </div>
  );
}
