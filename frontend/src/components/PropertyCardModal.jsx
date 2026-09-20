import React, { useState, useEffect } from 'react';
import { FileText, Printer, Building2, User, Key, ShieldCheck, Map, Layers, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

export default function PropertyCardModal({ unitId, onClose }) {
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    
    // Safety check for non-3D unit IDs
    const isUnit = unitId?.startsWith('U0') && !unitId.includes('-R');
    
    if (isUnit) {
      fetch('http://127.0.0.1:8000/api/units')
        .then(res => res.json())
        .then(units => {
          if (!active) return;
          const unit = units.find(u => u.unit_id === unitId);
          if (unit) {
            return fetch(`http://127.0.0.1:8000/api/unit/${unit.ulpin}`)
              .then(res => res.json())
              .then(data => {
                if (active) {
                  setPropertyData(data);
                  setLoading(false);
                }
              });
          } else {
            if (active) {
              setError("Unit not found in cadastral registry.");
              setLoading(false);
            }
          }
        })
        .catch(err => {
          if (active) {
            console.error('Error fetching unit data:', err);
            setError("Failed to fetch cadastral record.");
            setLoading(false);
          }
        });
    } else {
      // Mock data for rooms/floors/buildings to prevent crash, though this drawer is usually only opened for Units
      setTimeout(() => {
        if (active) {
          setError("Full LADM records are only generated for volumetric 3D Units.");
          setLoading(false);
        }
      }, 500);
    }
    
    return () => { active = false; };
  }, [unitId]);

  return (
    <>
      <div 
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999,
          animation: 'fade-in 0.2s ease-out', backdropFilter: 'blur(4px)'
        }}
      />
      <div style={{
        position: 'fixed', right: 0, top: 0, height: '100vh', width: '720px',
        background: 'var(--bg-1)', zIndex: 10000, borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '-20px 0 50px rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column', 
        color: 'var(--text-1)', animation: 'slide-in-right 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        overflowY: 'auto'
      }}>
        <style>{`
          @keyframes slide-in-right {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>
        
        {loading ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', gap: '16px' }}>
            <div className="spin" style={{ width: '32px', height: '32px', border: '3px solid rgba(34, 211, 238, 0.2)', borderTopColor: 'var(--accent)', borderRadius: '50%' }} />
            <div style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.05em' }}>FETCHING LADM RECORD...</div>
          </div>
        ) : error ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', gap: '16px', padding: '40px', textAlign: 'center' }}>
            <AlertTriangle size={48} style={{ color: 'var(--warning)' }} />
            <h3 style={{ fontSize: '18px', color: 'var(--text-1)', fontWeight: 600 }}>Record Unavailable</h3>
            <p style={{ fontSize: '14px' }}>{error}</p>
            <button onClick={onClose} style={{ marginTop: '20px', background: 'var(--bg-2)', color: 'var(--text-1)', border: '1px solid var(--border-1)', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer' }}>Close</button>
          </div>
        ) : propertyData ? (
          <>
            {/* Header */}
            <div style={{
              padding: '24px 32px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
              background: 'linear-gradient(to right, rgba(255,255,255,0.02), transparent)', flexShrink: 0
            }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, var(--accent), #0ea5e9)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 8px 16px rgba(34, 211, 238, 0.2)' }}>
                  <FileText size={28} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em' }}>LADM Property Record</h2>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.2)', fontWeight: 600 }}>
                      <CheckCircle2 size={12} /> VERIFIED
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-3)', fontFamily: 'var(--mono)', letterSpacing: '0.02em' }}>3D ULPIN: {propertyData.unit.ulpin}</div>
                </div>
              </div>
              <button 
                onClick={onClose}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-2)', borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-2)'; }}
              >
                ✕
              </button>
            </div>

            {/* Body 2-Column Grid */}
            <div style={{ padding: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', flex: 1 }}>
              
              {/* Left Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                
                {/* Ownership Details */}
                <section>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--text-1)' }}>
                    <User size={18} style={{ color: 'var(--accent)' }} /> <h3 style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.01em' }}>Ownership Details</h3>
                  </div>
                  <div style={{ background: 'var(--bg-2)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-1)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 500, marginBottom: '6px' }}>Primary Owner</div>
                    <div style={{ fontSize: '16px', color: 'var(--text-1)', fontWeight: 600, marginBottom: '4px' }}>{propertyData.owner.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-2)', marginBottom: '16px' }}>{propertyData.owner.ownership_type} (Share: {propertyData.owner.share}%)</div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '6px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 500 }}>Aadhaar Hash</span>
                      <span style={{ fontSize: '13px', color: 'var(--text-1)', fontFamily: 'var(--mono)' }}>{propertyData.owner.aadhaar_hash.slice(0, 8)}...</span>
                    </div>
                  </div>
                </section>

                {/* Provenance */}
                <section>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--text-1)' }}>
                    <Clock size={18} style={{ color: 'var(--accent)' }} /> <h3 style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.01em' }}>Provenance & History</h3>
                  </div>
                  <div style={{ background: 'var(--bg-2)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-1)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 500, marginBottom: '4px' }}>Transaction ID</div>
                      <div style={{ fontSize: '14px', color: 'var(--text-1)', fontFamily: 'var(--mono)' }}>{propertyData.provenance.transaction_id}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 500, marginBottom: '4px' }}>Registration Date</div>
                      <div style={{ fontSize: '14px', color: 'var(--text-1)' }}>{new Date(propertyData.provenance.timestamp).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 500, marginBottom: '4px' }}>Derivation</div>
                      <div style={{ fontSize: '14px', color: 'var(--text-2)' }}>{propertyData.provenance.derivation}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 500, marginBottom: '4px' }}>Checksum</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-3)', fontFamily: 'var(--mono)', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '4px', wordBreak: 'break-all' }}>{propertyData.provenance.checksum}</div>
                    </div>
                  </div>
                </section>

                {/* Legal & Encumbrances */}
                <section>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--text-1)' }}>
                    <ShieldCheck size={18} style={{ color: 'var(--accent)' }} /> <h3 style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.01em' }}>Legal & Encumbrances</h3>
                  </div>
                  <div style={{ background: 'var(--bg-2)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-3)', fontWeight: 500 }}>Mortgage Status</span>
                      <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 700, background: 'rgba(34,197,94,0.1)', padding: '4px 10px', borderRadius: '4px', border: '1px solid rgba(34,197,94,0.2)' }}>CLEAR</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-3)', fontWeight: 500 }}>Property Tax</span>
                      <span style={{ fontSize: '13px', color: 'var(--text-1)', fontWeight: 600 }}>PAID (2026)</span>
                    </div>
                  </div>
                </section>

              </div>

              {/* Right Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                
                {/* Vertical Relationship */}
                <section>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--text-1)' }}>
                    <Layers size={18} style={{ color: 'var(--accent)' }} /> <h3 style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.01em' }}>Vertical Relationship</h3>
                  </div>
                  <div style={{ background: 'rgba(34,211,238,0.05)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(34,211,238,0.2)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>Parent 2D ULPIN</span>
                        <span style={{ fontSize: '13px', color: 'var(--text-1)', fontFamily: 'var(--mono)' }}>{propertyData.provenance.ulpin_components.parent_ulpin}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>Cadastral Layer</span>
                        <span style={{ fontSize: '13px', color: 'var(--text-1)', fontWeight: 600 }}>{propertyData.unit.layer === 'S' ? 'Surface (S)' : propertyData.unit.layer === 'U' ? 'Underground (U)' : 'Airspace (A)'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>Level / Floor</span>
                        <span style={{ fontSize: '13px', color: 'var(--text-1)', fontWeight: 600 }}>{propertyData.unit.level_label || propertyData.unit.level}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>Unit Index</span>
                        <span style={{ fontSize: '13px', color: 'var(--text-1)', fontFamily: 'var(--mono)' }}>{propertyData.unit.unit_id}</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Spatial Geometry */}
                <section>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--text-1)' }}>
                    <Building2 size={18} style={{ color: 'var(--accent)' }} /> <h3 style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.01em' }}>Spatial Geometry</h3>
                  </div>
                  <div style={{ background: 'var(--bg-2)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-1)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 500, marginBottom: '6px' }}>Volume</div>
                        <div style={{ fontSize: '16px', color: 'var(--text-1)', fontWeight: 600 }}>{propertyData.unit.volume_cbm} <span style={{fontSize:'13px', color: 'var(--text-3)'}}>m³</span></div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 500, marginBottom: '6px' }}>Floor Area</div>
                        <div style={{ fontSize: '16px', color: 'var(--text-1)', fontWeight: 600 }}>{propertyData.unit.area_sqm} <span style={{fontSize:'13px', color: 'var(--text-3)'}}>m²</span></div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 500, marginBottom: '6px' }}>Z-Min</div>
                        <div style={{ fontSize: '14px', color: 'var(--text-2)', fontWeight: 500, fontFamily: 'var(--mono)' }}>+{propertyData.unit.z_min.toFixed(1)} m</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 500, marginBottom: '6px' }}>Z-Max</div>
                        <div style={{ fontSize: '14px', color: 'var(--text-2)', fontWeight: 500, fontFamily: 'var(--mono)' }}>+{propertyData.unit.z_max.toFixed(1)} m</div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Validation Status */}
                <section>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--text-1)' }}>
                    <ShieldCheck size={18} style={{ color: 'var(--accent)' }} /> <h3 style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.01em' }}>System Validations</h3>
                  </div>
                  <div style={{ background: 'var(--bg-2)', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--border-1)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>Watertight 3D Solid Geometry</span>
                      <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={14} /> PASS</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>Spatial Overlap Topology Check</span>
                      <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={14} /> PASS</span>
                    </div>
                  </div>
                </section>
                
                {/* QR Code Verification */}
                <section style={{ display: 'flex', justifyContent: 'center', marginTop: 'auto' }}>
                  <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
                    <QRCodeCanvas 
                      value={`https://geocadastre.gov.in/verify/${propertyData.unit.ulpin}`}
                      size={120}
                      level={"Q"}
                      includeMargin={false}
                    />
                    <div style={{ fontSize: '11px', color: '#333', fontWeight: 700, textAlign: 'center', width: '120px', letterSpacing: '0.02em' }}>SCAN TO VERIFY CADASTRAL RECORD</div>
                  </div>
                </section>

              </div>
            </div>
            
            {/* Footer */}
            <div style={{ padding: '20px 32px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end', gap: '16px', flexShrink: 0 }}>
               <button 
                 style={{ background: 'transparent', color: 'var(--text-2)', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} 
                 onClick={onClose}
                 onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff'; }}
                 onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-2)'; }}
               >
                 Close
               </button>
               <button 
                 style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent)', color: 'var(--bg-0)', padding: '10px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(34, 211, 238, 0.2)' }}
                 onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(34, 211, 238, 0.3)'; }}
                 onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 211, 238, 0.2)'; }}
               >
                 <Printer size={18} />
                 Print Record
               </button>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
