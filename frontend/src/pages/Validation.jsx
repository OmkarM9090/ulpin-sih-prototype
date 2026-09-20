import React from 'react';
import { ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';

export default function Validation() {
  const logs = [
    { check: 'Topological Overlap Detection', target: 'Building UP-LKO-B239', result: 'Pass', time: '12:45:03' },
    { check: 'Z-Range Continuity', target: 'Unit 09-12345-0012-L02', result: 'Pass', time: '12:45:01' },
    { check: 'Underground Clearance (Metro)', target: 'Parcel UP-LKO-P123456', result: 'Warning', time: '12:44:58' },
    { check: 'LADM Schema Compliance', target: 'Demo Dataset', result: 'Pass', time: '12:44:10' },
    { check: '3D Geometry Watertightness', target: 'Building UP-LKO-B239', result: 'Fail', time: '12:43:55' }
  ];

  return (
    <div style={{ padding: '32px', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <div style={{ width: '40px', height: '40px', background: 'rgba(34, 211, 238, 0.1)', color: 'var(--accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShieldCheck size={20} />
        </div>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '4px' }}>Spatial Validation Logs</h1>
          <div style={{ fontSize: '13px', color: 'var(--text-3)' }}>Automated geometric and topological rule execution</div>
        </div>
      </div>

      <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border-1)', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-3)', borderBottom: '1px solid var(--border-1)' }}>
              <th style={{ padding: '16px', fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>Check Type</th>
              <th style={{ padding: '16px', fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>Target Entity</th>
              <th style={{ padding: '16px', fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>Result</th>
              <th style={{ padding: '16px', fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-1)' }}>
                <td style={{ padding: '16px', fontSize: '13px', fontWeight: 500, color: 'var(--text-1)' }}>{log.check}</td>
                <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-2)' }}>{log.target}</td>
                <td style={{ padding: '16px' }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    background: log.result === 'Pass' ? 'rgba(34, 197, 94, 0.1)' : (log.result === 'Warning' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)'),
                    color: log.result === 'Pass' ? 'var(--success)' : (log.result === 'Warning' ? 'var(--warning)' : 'var(--danger)'),
                    padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600
                  }}>
                    {log.result === 'Pass' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    {log.result.toUpperCase()}
                  </div>
                </td>
                <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
