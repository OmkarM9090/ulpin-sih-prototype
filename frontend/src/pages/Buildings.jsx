import React from 'react';
import { Building2 } from 'lucide-react';

export default function Buildings() {
  const buildings = [
    { id: 'BLD-MH-PUN-B239', floors: 6, maxZ: '+18.0m', minZ: '-5.0m', footprint: '350 m²', use: 'Mixed Residential' },
    { id: 'BLD-MH-PUN-B240', floors: 2, maxZ: '+8.0m', minZ: '0.0m', footprint: '120 m²', use: 'Commercial' },
    { id: 'BLD-MH-PUN-B241', floors: 1, maxZ: '+4.5m', minZ: '0.0m', footprint: '85 m²', use: 'Retail' },
    { id: 'BLD-MH-PUN-B242', floors: 4, maxZ: '+12.0m', minZ: '0.0m', footprint: '210 m²', use: 'Residential' },
  ];

  return (
    <div style={{ padding: '32px', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <div style={{ width: '40px', height: '40px', background: 'rgba(34, 211, 238, 0.1)', color: 'var(--accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Building2 size={20} />
        </div>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '4px' }}>Extruded Buildings</h1>
          <div style={{ fontSize: '13px', color: 'var(--text-3)' }}>4 structures identified in demonstration dataset</div>
        </div>
      </div>

      <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border-1)', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-3)', borderBottom: '1px solid var(--border-1)' }}>
              <th style={{ padding: '16px', fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>Building ID</th>
              <th style={{ padding: '16px', fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>Primary Use</th>
              <th style={{ padding: '16px', fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>Total Floors</th>
              <th style={{ padding: '16px', fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>Z Range</th>
              <th style={{ padding: '16px', fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>Footprint</th>
            </tr>
          </thead>
          <tbody>
            {buildings.map((b, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-1)' }}>
                <td style={{ padding: '16px', fontSize: '13px', fontWeight: 500, color: 'var(--text-1)', fontFamily: 'var(--mono)' }}>{b.id}</td>
                <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-2)' }}>{b.use}</td>
                <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-2)' }}>{b.floors}</td>
                <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>{b.minZ} to {b.maxZ}</td>
                <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-2)' }}>{b.footprint}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
