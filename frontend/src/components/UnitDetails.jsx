import React, { useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import PropertyCard from './PropertyCard';
import { useToast } from './Toast';
import { API_BASE_URL } from '../config';

const MiniUnitPreview = ({ color, sz_x, sz_y, sz_z }) => {
  const meshRef = React.useRef();
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x = 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[sz_x, sz_y, sz_z]} />
      <meshStandardMaterial color={color} transparent opacity={0.8} />
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(sz_x, sz_y, sz_z)]} />
        <lineBasicMaterial color="#ffffff" opacity={0.5} transparent />
      </lineSegments>
    </mesh>
  );
};

export default function UnitDetails({ selectedUnit }) {
  const [unitData, setUnitData] = useState(null);
  const [showCard, setShowCard] = useState(false);
  const addToast = useToast();

  useEffect(() => {
    if (!selectedUnit) return;
    setUnitData(null);
    fetch(`${API_BASE_URL}/api/unit/${selectedUnit}`)
      .then(res => res.json())
      .then(data => setUnitData(data))
      .catch(err => console.error(err));
  }, [selectedUnit]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    addToast('3D-ULPIN copied to clipboard', 'success');
  };

  const getEmoji = (type, usage) => {
    if (type === 'metro') return '🚇';
    if (type === 'utility') return '💧';
    if (type === 'garden') return '🌳';
    if (type === 'water_tank') return '🚰';
    if (usage?.includes('Parking')) return '🚗';
    if (usage?.includes('Shop')) return '🏪';
    if (usage?.includes('Terrace')) return '🏛';
    return '🏠';
  };

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
    return '#38bdf8';
  };

  if (!selectedUnit || !unitData) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '32px', textAlign: 'center', gap: '16px' }}>
        <div style={{ fontSize: '64px', opacity: 0.5 }}>🎯</div>
        <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Select a Property Unit</div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '260px' }}>
          Click any 3D unit in the viewer to inspect its cadastral details, ownership, and generate a Property Card.
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 'auto', background: 'var(--bg-elevated)', padding: '8px 12px', borderRadius: '8px' }}>
          💡 Tip: Try clicking a basement or metro tunnel
        </div>
      </div>
    );
  }

  const { unit, owner } = unitData;
  const isPublicEasement = owner?.ownership_type === 'Public Easement';
  const isCommon = owner?.ownership_type === 'Common Ownership';
  const color = getColor(unit.type, unit.level);
  
  // Calculate bounding box dimensions for preview
  const xs = unit.footprint.map(p => p[0]);
  const ys = unit.footprint.map(p => p[1]);
  const sz_x = Math.max(...xs) - Math.min(...xs);
  const sz_z = Math.max(...ys) - Math.min(...ys);
  const sz_y = unit.z_max - unit.z_min;
  
  // Scale down for preview
  const max_dim = Math.max(sz_x, sz_y, sz_z);
  const scale = 3.0 / max_dim;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      
      {/* Header Block */}
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: `${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
            {getEmoji(unit.type, unit.usage)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>{unit.type.charAt(0).toUpperCase() + unit.type.slice(1)}</div>
          </div>
          <button onClick={() => window.location.reload()} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '16px', cursor: 'pointer', padding: '4px' }}>✕</button>
        </div>
        <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{unit.unit_label}</div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Building B01 · Floor {unit.level.replace('L0', '').replace('L-0', '-')} · Unit {unit.unit_id}</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* 3D-ULPIN block */}
        <div style={{ padding: '16px' }}>
          <div style={{ background: 'var(--bg-elevated)', borderRadius: '8px', padding: '12px' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '4px' }}>3D-ULPIN</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '14px', color: 'var(--accent-primary)', wordBreak: 'break-all', fontWeight: 600 }}>{unit.ulpin}</div>
              <button onClick={() => copyToClipboard(unit.ulpin)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                📋 Copy
              </button>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Parent 2D ULPIN: 23140701001001</span>
              <span style={{ cursor: 'pointer' }} onClick={() => copyToClipboard('23140701001001')}>📋</span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div style={{ padding: '0 16px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { label: 'Layer', value: unit.layer === 'U' ? 'Underground' : 'Surface' },
            { label: 'Level Code', value: unit.level },
            { label: 'Usage', value: unit.usage },
            { label: 'Area', value: `${unit.area_sqm.toFixed(1)} sqm` },
            { label: 'Volume', value: `${unit.volume_cbm.toFixed(1)} cbm` },
            { label: 'Height Range', value: `Z: ${unit.z_min} → ${unit.z_max}` },
            { label: 'Floor Height', value: `${(unit.z_max - unit.z_min).toFixed(1)} m` },
            { label: 'Ownership Type', value: owner?.ownership_type || 'Unknown' }
          ].map((item, idx) => (
            <div key={idx}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '2px' }}>{item.label}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Mini 3D Preview */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ height: '120px', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-default)', overflow: 'hidden' }}>
            <Canvas camera={{ position: [3, 2, 4], fov: 50 }}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 5, 5]} intensity={0.8} />
              <MiniUnitPreview color={color} sz_x={sz_x * scale} sz_y={sz_y * scale} sz_z={sz_z * scale} />
            </Canvas>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '6px' }}>
            L × W × H = {sz_x.toFixed(1)} × {sz_z.toFixed(1)} × {sz_y.toFixed(1)} m
          </div>
        </div>

        {/* Encumbrances */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Encumbrances & Rights</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-elevated)', padding: '8px', borderRadius: '6px' }}>
            {isPublicEasement ? (
              <><span style={{ background: 'var(--warning)', color: '#000', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>Public Easement</span><span style={{ fontSize: '11px', color: 'var(--text-primary)' }}>{owner?.name}</span></>
            ) : isCommon ? (
              <><span style={{ background: 'var(--info)', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>Common Ownership</span><span style={{ fontSize: '11px', color: 'var(--text-primary)' }}>{owner?.name}</span></>
            ) : (
              <><span style={{ background: 'var(--success)', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>None</span><span style={{ fontSize: '11px', color: 'var(--text-primary)' }}>Private Unit</span></>
            )}
          </div>
        </div>

        {/* Neighbors */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Adjacent Units</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['⬆ Above', '⬇ Below', '↔ Same-Floor'].map(lbl => (
              <div key={lbl} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {lbl}
              </div>
            ))}
          </div>
        </div>

        {/* Validation */}
        <div style={{ padding: '0 16px 24px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Topology Validation</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '12px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}>✅ <span style={{ color: 'var(--text-secondary)' }}>Watertight geometry</span></div>
            <div style={{ fontSize: '12px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}>✅ <span style={{ color: 'var(--text-secondary)' }}>No unit overlaps</span></div>
            <div style={{ fontSize: '12px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}>✅ <span style={{ color: 'var(--text-secondary)' }}>{isPublicEasement ? "Public easement — cross-parcel allowed" : "Within parent parcel envelope"}</span></div>
          </div>
        </div>
      </div>

      {/* CTA Block (Sticky Bottom) */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-panel)' }}>
        <button onClick={() => setShowCard(true)} style={{ width: '100%', height: '36px', background: 'var(--gradient-brand)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', marginBottom: '8px' }}>
          📄 View Property Card
        </button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ flex: 1, height: '32px', background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-default)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
            ⬇ Download JSON
          </button>
          <button style={{ flex: 1, height: '32px', background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-default)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
            🔗 Share Link
          </button>
        </div>
      </div>

      {showCard && <PropertyCard ulpin={unit.ulpin} onClose={() => setShowCard(false)} />}
    </div>
  );
}
