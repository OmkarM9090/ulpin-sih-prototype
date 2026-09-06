import React, { useState } from 'react';

const ITEMS = [
  { label: 'Basement Parking', color: '#f59e0b' },
  { label: 'Ground Shop', color: '#eab308' },
  { label: 'Apartments F1', color: '#38bdf8' },
  { label: 'Apartments F2', color: '#818cf8' },
  { label: 'Apartments F3', color: '#c084fc' },
  { label: 'Common Terrace', color: '#a855f7' },
  { label: 'Common Garden', color: '#16a34a' },
  { label: 'Metro Right of Way', color: '#dc2626' },
  { label: 'Municipal Utility', color: '#3b82f6' },
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
          {ITEMS.map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-primary)' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: item.color, borderRadius: '4px', flexShrink: 0 }} />
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
