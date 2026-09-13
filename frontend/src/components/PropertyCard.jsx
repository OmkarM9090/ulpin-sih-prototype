import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { Printer, X, Landmark } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function PropertyCard({ ulpin, onClose }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/property-card/${ulpin}`)
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
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>CONTROLLED DEMO DATA</div>
              <div style={{ fontSize: '16px', fontWeight: 700 }}>3D Property Title Certificate (Prototype)</div>
              <div style={{ fontSize: '11px', opacity: 0.85 }}>SIH 2026 · PS 26011 · Synthetic Demo Data for Evaluation</div>
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
              <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Proposed 3D ULPIN</div>
              <div style={{ fontSize: '20px', fontFamily: 'monospace', color: '#0f172a', letterSpacing: '1px', fontWeight: 600, marginTop: '4px' }}>{unit_details['3d_ulpin']}</div>
              <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '4px', fontStyle: 'italic' }}>⚠️ Proposed extension — not an official government standard</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
              <div><span style={{ color: '#64748b' }}>Building ID:</span> B01</div>
              <div><span style={{ color: '#64748b' }}>Floor:</span> {unit_details.level}</div>
              <div><span style={{ color: '#64748b' }}>Unit:</span> U001</div>
              <div><span style={{ color: '#64748b' }}>Layer:</span> {unit_details.level.includes('Basement') || unit_details.usage.includes('Underground') ? 'Underground (U)' : 'Surface (S)'}</div>
              <div><span style={{ color: '#64748b' }}>Usage:</span> {unit_details.usage}</div>
              <div><span style={{ color: '#64748b' }}>Property Type:</span> {unit_details.usage.includes('Shop') ? 'Commercial' : unit_details.usage.includes('Apartment') ? 'Residential' : unit_details.usage.includes('Parking') ? 'Common Area' : unit_details.usage.includes('Terrace') ? 'Common Area' : 'Infrastructure'}</div>
              <div><span style={{ color: '#64748b' }}>Height Range:</span> {unit_details.z_range}</div>
              <div><span style={{ color: '#64748b' }}>Area:</span> {unit_details.area_sqm.toFixed(2)} sqm <span style={{ fontSize: '9px', color: '#94a3b8' }}>(Derived from demo)</span></div>
              <div><span style={{ color: '#64748b' }}>Volume:</span> {unit_details.volume_cbm.toFixed(2)} cbm <span style={{ fontSize: '9px', color: '#94a3b8' }}>(Derived from demo)</span></div>
              <div><span style={{ color: '#64748b' }}>Document Status:</span> <span style={{ background: '#fef3c7', color: '#92400e', padding: '1px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 500 }}>Demo — Not legally binding</span></div>
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
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>VALIDATION STATUS</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { label: 'Topology Valid', desc: 'All units pass spatial checks' },
                { label: 'Watertight', desc: 'No gaps in 3D geometry' },
                { label: 'No Overlaps', desc: 'Units do not intersect' },
                { label: 'LADM Concept Demo', desc: 'ISO 19152 concept demonstrated' }
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f0fdf4', padding: '6px 10px', borderRadius: '6px' }}>
                  <span style={{ color: '#16a34a', fontSize: '12px' }}>✓</span>
                  <div>
                    <div style={{ fontSize: '11px', color: '#166534', fontWeight: 500 }}>{item.label}</div>
                    <div style={{ fontSize: '9px', color: '#64748b' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '6px', fontStyle: 'italic' }}>⚠️ Prototype validation — requires human/surveyor verification</div>
          </div>

          {/* Section 5 - Verification Chain */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>VERIFICATION CHAIN</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f0fdf4', borderRadius: '6px', padding: '8px 10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>📋</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '11px', fontWeight: 500, color: '#166534' }}>Surveyor Review</div>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>Geometry verified against field survey</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10px', color: '#16a34a', fontWeight: 500 }}>✓ Approved</div>
                  <div style={{ fontSize: '8px', color: '#94a3b8' }}>(Demo Simulated)</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f0fdf4', borderRadius: '6px', padding: '8px 10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>🏛</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '11px', fontWeight: 500, color: '#166534' }}>Authority Approval</div>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>Municipal/Revenue authority sign-off</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10px', color: '#16a34a', fontWeight: 500 }}>✓ Approved</div>
                  <div style={{ fontSize: '8px', color: '#94a3b8' }}>(Demo Simulated)</div>
                </div>
              </div>
            </div>
            <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '6px', fontStyle: 'italic' }}>⚠️ Simulated for prototype demonstration — not real approval</div>
          </div>

          {/* Section 6 - Provenance */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>DATA PROVENANCE</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ background: '#fef3c7', color: '#92400e', padding: '1px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 600 }}>CONTROLLED DEMO DATA</span>
                <span>All values are synthetic for prototype demonstration</span>
              </div>
              <div>Generated On: 15 Jan 2026, 09:42 IST</div>
              <div>Generated By: GeoCadastre 3D Engine v1.0.0</div>
              <div>Data Sources: <span style={{ fontStyle: 'italic' }}>Drone (synthetic), LiDAR (synthetic), DEM (synthetic), Floor Plans (synthetic), GNSS/CORS (synthetic), Municipal GIS (synthetic)</span></div>
              <div style={{ marginTop: '4px', padding: '6px 8px', background: '#f8fafc', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 500, color: '#475569', marginBottom: '2px' }}>Production Data Sources</div>
                <div style={{ fontSize: '10px' }}>In production, this system would use: Live drone orthomosaic, LiDAR point clouds, Bhuvan CartoDEM, Municipal floor plans, GNSS/CORS anchors, Municipal GIS layers</div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer strip */}
        <div style={{ background: '#f1f5f9', padding: '12px 24px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '10px', color: '#64748b', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ fontWeight: 600, color: '#92400e' }}>⚠️ PROTOTYPE — Controlled Demo Data — NOT an official government document</div>
          <div>This document is generated from controlled demo data for prototype demonstration purposes only. Not legally binding. For SIH 2026 evaluation only.</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
            <span>SIH 2026 · PS 26011</span>
            <span>Doc Ref: DEMO-2026-001</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
