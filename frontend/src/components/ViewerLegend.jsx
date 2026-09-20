import React, { useState } from 'react';

const ITEMS = [
  { label: 'Basement Parking', color: '#f59e0b', desc: 'Underground parking levels' },
  { label: 'Ground Shop', color: '#eab308', desc: 'Ground floor commercial' },
  { label: 'Apartments F1-F3', color: '#38bdf8', desc: 'Residential floors' },
  { label: 'Common Terrace', color: '#a855f7', desc: 'Shared rooftop area' },
  { label: 'Common Garden', color: '#16a34a', desc: 'Ground-level open space' },
  { label: 'Metro Right of Way', color: '#dc2626', desc: 'Public infrastructure — needs 3D awareness', underground: true },
  { label: 'Municipal Utility', color: '#3b82f6', desc: 'Underground services — needs vertical mapping', underground: true },
];

export default function ViewerLegend() {
  const [open, setOpen] = useState(true);

  return (
    <div style={{
      position: 'absolute',
      bottom: '16px',
      left: '16px',
      zIndex: 10,
      backgroundColor: 'rgba(26, 35, 50, 0.95)',
      backdropFilter: 'blur(8px)',
      borderRadius: '12px',
      padding: '12px',
      boxShadow: 'var(--shadow-md)',
      border: '1px solid var(--border-subtle)',
      minWidth: '220px'
    }}>
      <div 
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: open ? '12px' : '0' }}
        onClick={() => setOpen(!open)}
      >
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Legend</div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</div>
      </div>
      
      {open && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px' }}>
          {ITEMS.map(item => (
            <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: '1px', padding: item.underground ? '4px 6px' : '0', background: item.underground ? 'rgba(220,38,38,0.08)' : 'transparent', borderRadius: item.underground ? '4px' : '0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-primary)' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: item.color, borderRadius: '4px', flexShrink: 0 }} />
                {item.label}
              </div>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', paddingLeft: '20px', fontStyle: 'italic' }}>{item.desc}</div>
            </div>
          ))}
          <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '4px', borderTop: '1px solid var(--border-subtle)', paddingTop: '6px', fontStyle: 'italic' }}>Underground layers: Why 3D ULPIN matters</div>
        </div>
      )}
    </div>
  );
}
