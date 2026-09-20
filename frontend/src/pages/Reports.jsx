import React from 'react';
import { FileText, Download } from 'lucide-react';

export default function Reports() {
  const reports = [
    { title: 'Monthly Cadastral Summary', date: 'Sep 2026', size: '2.4 MB', type: 'PDF' },
    { title: '3D Spatial Validation Log', date: 'Aug 2026', size: '1.1 MB', type: 'CSV' },
    { title: 'Underground Asset Inventory', date: 'Aug 2026', size: '3.8 MB', type: 'PDF' },
    { title: 'Vertical Units Registration', date: 'Jul 2026', size: '5.2 MB', type: 'XLSX' }
  ];

  return (
    <div style={{ padding: '32px', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '8px' }}>Reports & Analytics</h1>
      <p style={{ color: 'var(--text-3)', fontSize: '13px', marginBottom: '32px' }}>Download auto-generated prototype reports and spatial logs.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {reports.map((report, i) => (
          <div key={i} style={{
            background: 'var(--bg-2)', border: '1px solid var(--border-1)',
            borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--bg-3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                <FileText size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-1)', marginBottom: '4px' }}>{report.title}</h3>
                <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{report.date} · {report.type}</div>
              </div>
            </div>
            
            <button style={{
              background: 'var(--bg-1)', border: '1px solid var(--border-2)', color: 'var(--text-2)',
              padding: '8px', borderRadius: '6px', fontSize: '12px', fontWeight: 500,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer'
            }}>
              <Download size={14} /> Download ({report.size})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
