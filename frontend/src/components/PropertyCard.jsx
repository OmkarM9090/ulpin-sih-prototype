import React from 'react';

export default function PropertyCard({ data, onClose }) {
  if (!data) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#f8fafc', color: '#0f172a', width: '100%', maxWidth: '600px',
        borderRadius: '8px', padding: '32px', position: 'relative',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px', 
          background: '#e2e8f0', color: '#475569', padding: '6px 12px', borderRadius: '4px',
          border: 'none', cursor: 'pointer', fontWeight: '600'
        }}>Close</button>
        
        <div style={{ textAlign: 'center', borderBottom: '2px solid #cbd5e1', paddingBottom: '16px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>{data.title}</h2>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>Generated: {new Date(data.generated_at).toLocaleString()}</p>
        </div>

        <div style={{ display: 'flex', gap: '24px' }}>
          <div style={{ flex: 1 }}>
            <h4 style={{ color: '#334155', marginBottom: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>Parent Parcel</h4>
            <p style={{ fontSize: '0.9rem', marginBottom: '4px' }}><strong>ULPIN:</strong> {data.parent_parcel.ulpin}</p>
            <p style={{ fontSize: '0.9rem', marginBottom: '4px' }}><strong>Location:</strong> {data.parent_parcel.location}</p>
            <p style={{ fontSize: '0.9rem', marginBottom: '20px' }}><strong>Base Area:</strong> {data.parent_parcel.area_sqm} sqm</p>

            <h4 style={{ color: '#334155', marginBottom: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>Vertical Property (3D Unit)</h4>
            <p style={{ fontSize: '0.9rem', marginBottom: '4px' }}><strong>3D-ULPIN:</strong> <span style={{ fontFamily: 'monospace', color: '#0369a1', fontWeight: 'bold', fontSize: '1.05rem' }}>{data.unit_details['3d_ulpin']}</span></p>
            <p style={{ fontSize: '0.9rem', marginBottom: '4px' }}><strong>Usage:</strong> {data.unit_details.usage}</p>
            <p style={{ fontSize: '0.9rem', marginBottom: '4px' }}><strong>Level:</strong> {data.unit_details.level}</p>
            <p style={{ fontSize: '0.9rem', marginBottom: '4px' }}><strong>Z-Bounds:</strong> {data.unit_details.z_range}</p>
            <p style={{ fontSize: '0.9rem', marginBottom: '20px' }}><strong>Volume:</strong> {data.unit_details.volume_cbm} cbm</p>

            <h4 style={{ color: '#334155', marginBottom: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>Ownership</h4>
            <p style={{ fontSize: '0.9rem', marginBottom: '4px' }}><strong>Name:</strong> {data.ownership.name}</p>
            <p style={{ fontSize: '0.9rem', marginBottom: '4px' }}><strong>Contact:</strong> {data.ownership.contact}</p>
            <p style={{ fontSize: '0.9rem' }}><strong>Type:</strong> {data.ownership.ownership_type}</p>
          </div>
          
          <div style={{ width: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
             <div style={{
               width: '110px', height: '110px', backgroundColor: '#fff', 
               display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '2px', padding: '6px',
               border: '2px solid #cbd5e1', borderRadius: '8px'
             }}>
                {Array.from({length: 25}).map((_, i) => (
                  <div key={i} style={{ backgroundColor: Math.random() > 0.4 ? '#0f172a' : 'transparent', borderRadius: '1px' }} />
                ))}
             </div>
             <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '10px', textAlign: 'center', fontWeight: '600' }}>Scan to Verify</p>
          </div>
        </div>
        
        <div style={{ marginTop: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '0.75rem', fontStyle: 'italic', borderTop: '1px dashed #cbd5e1', paddingTop: '12px' }}>
          {data.disclaimer}
        </div>
      </div>
    </div>
  );
}
