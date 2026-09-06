import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Html, Edges } from '@react-three/drei';
import * as THREE from 'three';

const getColor = (usage, level) => {
  if (usage === 'Parking') return '#f59e0b';
  if (usage === 'Shop') return '#eab308';
  if (level === 'L01') return '#3b82f6';
  if (level === 'L02') return '#6366f1';
  if (level === 'L03') return '#8b5cf6';
  return '#cbd5e1';
};

const UnitMesh = ({ unit, explodeValue, showLabels, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  
  const xs = unit.footprint.map(p => p[0]);
  const ys = unit.footprint.map(p => p[1]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const sz_x = Math.max(...xs) - Math.min(...xs);
  const sz_z = Math.max(...ys) - Math.min(...ys);
  
  const height = unit.z_max - unit.z_min;
  const base_y = unit.z_min;
  const center_y = base_y + height / 2;

  // Multiplier for explosion effect based on height offset from ground
  const explodeOffset = (base_y > 0 ? base_y * 0.4 : base_y < 0 ? base_y * 0.8 : 0) * (explodeValue / 50);
  const finalY = center_y + explodeOffset;

  return (
    <group 
      position={[cx, finalY, cy]} 
      onClick={(e) => { e.stopPropagation(); onSelect(unit.ulpin); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
    >
      <mesh>
        <boxGeometry args={[sz_x, height, sz_z]} />
        <meshStandardMaterial 
          color={getColor(unit.usage, unit.level)} 
          transparent 
          opacity={hovered ? 0.9 : 0.6} 
          roughness={0.2}
          metalness={0.1}
        />
        <Edges scale={1.001} color={hovered ? "white" : "#1e293b"} threshold={15} />
      </mesh>
      
      {showLabels && (
        <Html position={[0, height / 2 + 0.5, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
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
            {unit.unit_label}
          </div>
        </Html>
      )}
    </group>
  );
};

export default function Viewer3D({ systemData, explodeValue, showLabels, onSelect }) {
  const [parcelOutline, setParcelOutline] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/parcel')
      .then(r => r.json())
      .then(d => {
        const coords = d.features[0].geometry.coordinates[0];
        const points = coords.map(p => new THREE.Vector3(p[0], 0, p[1]));
        setParcelOutline(points);
      })
      .catch(e => console.error(e));
  }, []);

  const units = systemData?.units || [];

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#0f172a' }}>
      <Canvas camera={{ position: [35, 25, 35], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[50, 100, 50]} intensity={0.9} />
        <directionalLight position={[-50, 20, -50]} intensity={0.3} />
        
        <OrbitControls target={[15, 5, 20]} makeDefault />
        
        <Grid infiniteGrid fadeDistance={100} sectionColor="#334155" cellColor="#1e293b" position={[0, -0.01, 0]} />

        {/* Parcel Boundary in Cyan */}
        {parcelOutline && (
          <line>
            <bufferGeometry>
              <bufferAttribute 
                attach="attributes-position" 
                count={parcelOutline.length}
                array={new Float32Array(parcelOutline.flatMap(p => [p.x, p.y, p.z]))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#38bdf8" linewidth={3} />
          </line>
        )}

        {/* Building Footprint in White */}
        {units.length > 0 && (() => {
          const gf = units.find(u => u.level === 'L00');
          if (gf) {
            const pts = gf.footprint.map(p => new THREE.Vector3(p[0], 0.05, p[1]));
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
                <lineBasicMaterial color="#ffffff" linewidth={2} />
              </line>
            );
          }
          return null;
        })()}

        {/* 3D Property Units */}
        {units.map((unit) => (
          <UnitMesh 
            key={unit.unit_id} 
            unit={unit} 
            explodeValue={explodeValue} 
            showLabels={showLabels} 
            onSelect={onSelect} 
          />
        ))}
      </Canvas>
    </div>
  );
}
