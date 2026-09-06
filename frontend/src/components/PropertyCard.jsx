import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { Printer, X, Landmark } from 'lucide-react';

export default function PropertyCard({ ulpin, onClose }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/property-card/${ulpin}`)
      .then(res => res.json())
      .then(d => setData(d))
      .catch(err => console.error(err));
  }, [ulpin]);

  if (!data) return null;

  const { parent_parcel, unit_details, ownership } = data;
  const isPublicEasement = ownership.ownership_type === 'Public Easement';
  const encumbranceText = isPublicEasement ? `Public Easement · ${ownership.name}` : ownership.ownership_type === 'Common Ownership' ? `Common Ownership · ${ownership.name}` : 'None';

  return (
    <Modal onClose={onClose}>
      <div style={{
        width: '100vw', maxWidth: '640px', maxHeight: '90vh',
        backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 12px 32px rgba(0,0,0,0.45)',
        overflowY: 'auto', display: 'flex', flexDirection: 'column', color: '#0f172a'
      }}
      className="print-card"
      >
        <style>{`
          @media print {
            body * { visibility: hidden; }
            .print-card, .print-card * { visibility: visible; }
            .print-card { position: absolute; left: 0; top: 0; width: 100%; max-height: none; box-shadow: none; border-radius: 0; }
            .no-print { display: none !important; }
          }
        `}</style>
        
        {/* Header strip */}
        <div style={{ background: 'var(--gradient-brand)', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a' }}>
              <Landmark size={24} />
            </div>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>GOVERNMENT OF INDIA</div>
              <div style={{ fontSize: '16px', fontWeight: 700 }}>3D Property Title Certificate</div>
              <div style={{ fontSize: '11px', opacity: 0.85 }}>Ministry of Rural Development · Department of Land Resources</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div className="no-print" style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => window.print()} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '6px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Print Property Card"><Printer size={18} /></button>
              <button onClick={onClose} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '6px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Close"><X size={18} /></button>
            </div>
            <div style={{ width: '56px', height: '56px', backgroundColor: '#fff', padding: '2px', display: 'flex', flexWrap: 'wrap' }}>
              {/* Fake QR code using repeating linear gradients */}
              <div style={{ width: '100%', height: '100%', background: 'repeating-linear-gradient(45deg, #000 0, #000 2px, #fff 2px, #fff 4px), repeating-linear-gradient(-45deg, #000 0, #000 2px, #fff 2px, #fff 4px)' }}></div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Section 1 - Parent Parcel */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>PARENT PARCEL</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
              <div><span style={{ color: '#64748b' }}>Parcel ID:</span> P001</div>
              <div><span style={{ color: '#64748b' }}>2D ULPIN:</span> {parent_parcel.ulpin}</div>
              <div><span style={{ color: '#64748b' }}>Location:</span> {parent_parcel.location}</div>
              <div><span style={{ color: '#64748b' }}>Total Area:</span> {parent_parcel.area_sqm} sqm</div>
              <div><span style={{ color: '#64748b' }}>Land Use:</span> Residential</div>
            </div>
          </div>

          {/* Section 2 - 3D Volumetric Unit */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>3D VOLUMETRIC UNIT</h3>
            <div style={{ textAlign: 'center', margin: '12px 0' }}>
              <div style={{ fontSize: '20px', fontFamily: 'monospace', color: '#0f172a', letterSpacing: '1px', fontWeight: 600 }}>{unit_details['3d_ulpin']}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
              <div><span style={{ color: '#64748b' }}>Layer:</span> {unit_details.level.includes('Basement') || unit_details.usage.includes('Underground') ? 'Underground' : 'Surface'}</div>
              <div><span style={{ color: '#64748b' }}>Level:</span> {unit_details.level}</div>
              <div><span style={{ color: '#64748b' }}>Usage:</span> {unit_details.usage}</div>
              <div><span style={{ color: '#64748b' }}>Height Range:</span> {unit_details.z_range}</div>
              <div><span style={{ color: '#64748b' }}>Area:</span> {unit_details.area_sqm.toFixed(2)} sqm</div>
              <div><span style={{ color: '#64748b' }}>Volume:</span> {unit_details.volume_cbm.toFixed(2)} cbm</div>
            </div>
          </div>

          {/* Section 3 - RRR */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>RIGHTS, RESTRICTIONS & RESPONSIBILITIES (RRR)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', fontSize: '12px' }}>
              <div><span style={{ color: '#64748b' }}>Owner:</span> {ownership.name.replace(/(.)(.*)(.)/, (m, p1, p2, p3) => p1 + '*'.repeat(p2.length) + p3)}</div>
              <div><span style={{ color: '#64748b' }}>Ownership Type:</span> {ownership.ownership_type}</div>
              <div><span style={{ color: '#64748b' }}>Encumbrances:</span> {encumbranceText}</div>
              <div><span style={{ color: '#64748b' }}>Undivided Land Share:</span> 8.33%</div>
            </div>
          </div>

          {/* Section 4 - Validation */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>VALIDATION CERTIFICATE</h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Topology Valid', 'Watertight', 'No Overlaps', 'ISO 19152 LADM Compliant'].map(lbl => (
                <div key={lbl} style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 500 }}>
                  ✅ {lbl}
                </div>
              ))}
            </div>
          </div>

          {/* Section 5 - Provenance */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>PROVENANCE</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4px', fontSize: '11px', color: '#64748b' }}>
              <div>Generated On: 15 Jan 2026, 09:42 IST</div>
              <div>Generated By: GeoCadastre 3D Engine v1.0.0</div>
              <div>Data Sources: Drone, LiDAR, DEM, Floor Plans, GNSS/CORS, Municipal GIS</div>
              <div>Digital Signature Hash: <span style={{ fontFamily: 'monospace' }}>0x4a8f9b2...c9e2</span></div>
            </div>
          </div>

        </div>

        {/* Footer strip */}
        <div style={{ background: '#f1f5f9', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', borderTop: '1px solid #e2e8f0' }}>
          <div>This is a PROTOTYPE and NOT an official government document.</div>
          <div>SIH 2026 · PS 26011</div>
        </div>
      </div>
    </Modal>
  );
}
