import React, { useEffect, useState } from 'react';
import { Boxes } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function VerticalUnits() {
  const [units, setUnits] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/generated-units`)
      .then(r => r.json())
      .then(d => setUnits(d))
      .catch(e => console.error(e));
  }, []);

  return (
    <div style={{ padding: '32px', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <div style={{ width: '40px', height: '40px', background: 'rgba(34, 211, 238, 0.1)', color: 'var(--accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Boxes size={20} />
        </div>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '4px' }}>Volumetric Property Units</h1>
          <div style={{ fontSize: '13px', color: 'var(--text-3)' }}>{units.length} units fully extracted and assigned 3D ULPINs</div>
        </div>
      </div>

      <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border-1)', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-3)', borderBottom: '1px solid var(--border-1)' }}>
              <th style={{ padding: '16px', fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>3D ULPIN</th>
              <th style={{ padding: '16px', fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>Level</th>
              <th style={{ padding: '16px', fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>Type</th>
              <th style={{ padding: '16px', fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>Z Range</th>
              <th style={{ padding: '16px', fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>Layer</th>
            </tr>
          </thead>
          <tbody>
            {units.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-3)' }}>Loading units from backend...</td></tr>
            ) : units.map((u, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-1)' }}>
                <td style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: 'var(--accent)', fontFamily: 'var(--mono)' }}>{u.ulpin}</td>
                <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-2)', fontFamily: 'var(--mono)' }}>{u.level}</td>
                <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-2)', textTransform: 'capitalize' }}>{u.type.replace('_', ' ')}</td>
                <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>{u.z_min}m to {u.z_max}m</td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    background: 'var(--bg-1)', color: 'var(--text-2)', border: '1px solid var(--border-2)',
                    padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontFamily: 'var(--mono)'
                  }}>
                    {u.layer}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
