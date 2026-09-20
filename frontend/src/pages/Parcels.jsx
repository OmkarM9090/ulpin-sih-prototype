import React from 'react';
import { Layers } from 'lucide-react';

export default function Parcels() {
  const parcels = [
    { id: 'MH-PUN-P123456', area: '2,450 m²', status: '3D Modelled', owner: 'State Govt', updated: '2 hrs ago' },
    { id: 'MH-PUN-P123457', area: '1,200 m²', status: 'Pending 3D Extrusion', owner: 'Pvt Ltd', updated: '1 day ago' },
    { id: 'MH-PUN-P123458', area: '850 m²', status: '2D Registered', owner: 'Individual', updated: '3 days ago' },
    { id: 'MH-PUN-P123459', area: '3,100 m²', status: '2D Registered', owner: 'Municipal Corp', updated: '1 week ago' },
  ];

  return (
    <div style={{ padding: '32px', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <div style={{ width: '40px', height: '40px', background: 'rgba(34, 211, 238, 0.1)', color: 'var(--accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Layers size={20} />
        </div>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '4px' }}>Base Land Parcels</h1>
          <div style={{ fontSize: '13px', color: 'var(--text-3)' }}>11 total parcels in demonstration dataset</div>
        </div>
      </div>

      <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border-1)', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-3)', borderBottom: '1px solid var(--border-1)' }}>
              <th style={{ padding: '16px', fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>Parcel ID</th>
              <th style={{ padding: '16px', fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>Area</th>
              <th style={{ padding: '16px', fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '16px', fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>Ownership Category</th>
              <th style={{ padding: '16px', fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((p, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-1)' }}>
                <td style={{ padding: '16px', fontSize: '13px', fontWeight: 500, color: 'var(--text-1)', fontFamily: 'var(--mono)' }}>{p.id}</td>
                <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-2)' }}>{p.area}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    background: p.status === '3D Modelled' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    color: p.status === '3D Modelled' ? 'var(--success)' : 'var(--warning)',
                    padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600
                  }}>
                    {p.status}
                  </span>
                </td>
                <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-2)' }}>{p.owner}</td>
                <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-3)' }}>{p.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
