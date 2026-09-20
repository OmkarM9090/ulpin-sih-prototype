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

  const { parent_parcel, unit_details, ownership, validation, provenance } = data;
  const isPublicEasement = ownership.ownership_type === 'Public Easement';
  const isCommon = ownership.ownership_type === 'Common Ownership';
  const encumbranceText = isPublicEasement ? `Public Easement · ${ownership.name}` : isCommon ? `Common Ownership · ${ownership.name}` : 'None';
  const isUnderground = unit_details.layer === 'U';

  const generatedOn = data.generated_at
    ? new Date(data.generated_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
    : 'Unavailable';

  // Real computed validation from the backend topology validator
  const datasetOk = validation?.dataset_status === 'VALID';
  const unitChecksOk = validation?.unit_checks?.z_bounds_ok && validation?.unit_checks?.footprint_closed;

  const validationRows = [
    { ok: unitChecksOk, label: 'Unit geometry checks', desc: 'Z bounds valid, footprint ring closed (computed for this unit)' },
    { ok: validation?.watertight_ok, label: 'Watertight (dataset)', desc: 'No gaps in 3D geometry across demo dataset (computed)' },
    { ok: validation?.overlap_ok, label: 'No overlaps (dataset)', desc: 'Units do not intersect on shared levels (computed)' },
    { ok: datasetOk, label: `Dataset status: ${validation?.dataset_status || 'UNKNOWN'}`, desc: 'Result of prototype topology validator run' }
  ];

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
              <div style={{ fontSize: '16px', fontWeight: 700 }}>3D Property Record (Prototype)</div>
              <div style={{ fontSize: '11px', opacity: 0.85 }}>SIH 2026 · PS 26011 · Synthetic Demo Data for Evaluation</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div className="no-print" style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => window.print()} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '6px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Print Property Record"><Printer size={18} /></button>
              <button onClick={onClose} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '6px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Close"><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              <div style={{ width: '56px', height: '56px', backgroundColor: '#fff', padding: '2px', display: 'flex', flexWrap: 'wrap' }}>
                {/* Placeholder QR pattern — deliberately not scannable */}
                <div style={{ width: '100%', height: '100%', background: 'repeating-linear-gradient(45deg, #000 0, #000 2px, #fff 2px, #fff 4px), repeating-linear-gradient(-45deg, #000 0, #000 2px, #fff 2px, #fff 4px)', opacity: 0.85 }}></div>
              </div>
              <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.85)', textAlign: 'center' }}>Placeholder — not scannable</div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Section 0 - ULPIN Hierarchy */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>ULPIN HIERARCHY</h3>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '6px', padding: '8px 12px', textAlign: 'center', width: '100%' }}>
                <div style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Parent 2D ULPIN</div>
                <div style={{ fontFamily: 'monospace', fontSize: '14px', color: '#0284c7', fontWeight: 700, marginTop: '2px' }}>{parent_parcel.ulpin}</div>
              </div>
              <div style={{ color: '#94a3b8', fontSize: '14px' }}>↓</div>
              <div style={{ fontSize: '10px', color: '#64748b', fontStyle: 'italic' }}>3D Extrusion + Topology Validation + Human Verification</div>
              <div style={{ color: '#94a3b8', fontSize: '14px' }}>↓</div>
              <div style={{ background: '#f5f3ff', border: '1px solid #c4b5fd', borderRadius: '6px', padding: '8px 12px', textAlign: 'center', width: '100%' }}>
                <div style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Proposed 3D ULPIN</div>
                <div style={{ fontFamily: 'monospace', fontSize: '14px', color: '#7c3aed', fontWeight: 700, marginTop: '2px' }}>{unit_details['3d_ulpin']}</div>
              </div>
            </div>
            <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '6px', fontStyle: 'italic', textAlign: 'center' }}>⚠️ Proposed 3D ULPIN extension — not an official government standard</div>
          </div>

          {/* Section 1 - Parent Parcel */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>PARENT PARCEL</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
              <div><span style={{ color: '#64748b' }}>Parcel ID:</span> {parent_parcel.parcel_id}</div>
              <div><span style={{ color: '#64748b' }}>2D ULPIN:</span> {parent_parcel.ulpin}</div>
              <div><span style={{ color: '#64748b' }}>Location:</span> {parent_parcel.location}</div>
              <div><span style={{ color: '#64748b' }}>Total Area:</span> {parent_parcel.area_sqm} sqm <span style={{ fontSize: '9px', color: '#94a3b8' }}>(demo)</span></div>
              <div><span style={{ color: '#64748b' }}>Land Use:</span> {parent_parcel.land_use}</div>
            </div>
          </div>

          {/* Section 2 - 3D Volumetric Unit */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>3D VOLUMETRIC UNIT</h3>
            <div style={{ textAlign: 'center', margin: '12px 0' }}>
              <div style={{ fontSize: '20px', fontFamily: 'monospace', color: '#0f172a', letterSpacing: '1px', fontWeight: 600 }}>{unit_details['3d_ulpin']}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
              <div><span style={{ color: '#64748b' }}>Layer:</span> {isUnderground ? 'Underground' : 'Surface'}</div>
              <div><span style={{ color: '#64748b' }}>Level:</span> {unit_details.level}</div>
              <div><span style={{ color: '#64748b' }}>Usage:</span> {unit_details.usage}</div>
              <div><span style={{ color: '#64748b' }}>Height Range:</span> {unit_details.z_range}</div>
              <div><span style={{ color: '#64748b' }}>Area:</span> {unit_details.area_sqm.toFixed(2)} sqm</div>
              <div><span style={{ color: '#64748b' }}>Volume:</span> {unit_details.volume_cbm.toFixed(2)} cbm</div>
            </div>
            <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '6px', fontStyle: 'italic' }}>Area, volume and Z values: derived from demo geometry (Controlled Demo Data)</div>
          </div>

          {/* Section 3 - RRR */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>RIGHTS, RESTRICTIONS & RESPONSIBILITIES (RRR)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', fontSize: '12px' }}>
              <div><span style={{ color: '#64748b' }}>Owner:</span> {ownership.name.replace(/(.)(.*)(.)/, (m, p1, p2, p3) => p1 + '*'.repeat(p2.length) + p3)} <span style={{ fontSize: '9px', color: '#94a3b8' }}>(demo record)</span></div>
              <div><span style={{ color: '#64748b' }}>Ownership Type:</span> {ownership.ownership_type}</div>
              <div><span style={{ color: '#64748b' }}>Encumbrances:</span> {encumbranceText}</div>
              <div><span style={{ color: '#64748b' }}>Undivided Land Share:</span> 8.33% <span style={{ fontSize: '9px', color: '#94a3b8' }}>(demo assumption)</span></div>
            </div>
          </div>

          {/* Section 4 - Validation (computed) */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>VALIDATION STATUS <span style={{ fontSize: '9px', fontWeight: 500, color: '#94a3b8' }}>(prototype validation)</span></h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {validationRows.map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: item.ok ? '#f0fdf4' : '#fef2f2', padding: '6px 10px', borderRadius: '6px' }}>
                  <span style={{ color: item.ok ? '#16a34a' : '#dc2626', fontSize: '12px' }}>{item.ok ? '✓' : '✗'}</span>
                  <div>
                    <div style={{ fontSize: '11px', color: item.ok ? '#166534' : '#991b1b', fontWeight: 500 }}>{item.label}</div>
                    <div style={{ fontSize: '9px', color: '#64748b' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', border: '1px dashed #e2e8f0', padding: '6px 10px', borderRadius: '6px' }}>
                <span style={{ color: '#64748b', fontSize: '12px' }}>ℹ</span>
                <div>
                  <div style={{ fontSize: '11px', color: '#475569', fontWeight: 500 }}>LADM (ISO 19152) — conceptual narrative</div>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>Concept demonstrated only; not an implemented standard</div>
                </div>
              </div>
            </div>
            <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '6px', fontStyle: 'italic' }}>⚠️ Prototype validation — human/surveyor verification required</div>
          </div>

          {/* Section 5 - Verification workflow (honest statuses) */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>VERIFICATION WORKFLOW</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fffbeb', border: '1px solid #fde68a', padding: '6px 10px', borderRadius: '6px' }}>
                <span style={{ color: '#92400e' }}>Surveyor Review</span>
                <span style={{ fontSize: '10px', fontWeight: 600, color: '#92400e', background: '#fef3c7', padding: '2px 8px', borderRadius: '999px' }}>PENDING — HUMAN VERIFICATION REQUIRED</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '6px 10px', borderRadius: '6px' }}>
                <span style={{ color: '#475569' }}>Authority Approval</span>
                <span style={{ fontSize: '10px', fontWeight: 600, color: '#475569', background: '#f1f5f9', padding: '2px 8px', borderRadius: '999px' }}>NOT ISSUED — PROTOTYPE WORKFLOW</span>
              </div>
            </div>
            <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '6px', fontStyle: 'italic' }}>This record has no legal validity until surveyor and authority verification is completed.</div>
          </div>

          {/* Section 6 - Provenance (demo + production context) */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>PROVENANCE</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ background: '#fef3c7', color: '#92400e', padding: '1px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 600 }}>CONTROLLED DEMO DATA</span>
                <span>All values are synthetic for prototype demonstration</span>
              </div>
              <div>Generated On: {generatedOn}</div>
              <div>Generated By: 3D ULPIN Prototype Geometry Engine (demo pipeline)</div>
              <div>Data Sources: <span style={{ fontStyle: 'italic' }}>Drone (synthetic), LiDAR (synthetic), DEM (synthetic), Floor Plans (synthetic), GNSS/CORS (synthetic), Municipal GIS (synthetic)</span> — declared demo sources, not live feeds</div>
              <div>Demo Fingerprint: <span style={{ fontFamily: 'monospace' }}>{provenance?.fingerprint}</span> <span style={{ fontSize: '9px', color: '#94a3b8' }}>(derived from demo data — not a digital signature)</span></div>
              <div style={{ marginTop: '4px', padding: '6px 8px', background: '#f8fafc', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 500, color: '#475569', marginBottom: '2px' }}>Production Data Sources</div>
                <div style={{ fontSize: '10px' }}>In production, this system would use: Live drone orthomosaic, LiDAR point clouds, Bhuvan CartoDEM, Municipal floor plans, GNSS/CORS anchors, Municipal GIS layers</div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer strip */}
        <div style={{ background: '#f1f5f9', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', borderTop: '1px solid #e2e8f0' }}>
          <div>⚠️ This is a PROTOTYPE — Controlled Demo Data, NOT an official government document.</div>
          <div>SIH 2026 · PS 26011</div>
        </div>
      </div>
    </Modal>
  );
}
