import React from 'react';
import Modal from './Modal';
import { FileText, Printer, Building2, User, Key, ShieldCheck } from 'lucide-react';

export default function PropertyCardModal({ unitId, onClose }) {
  const ulpin = `09-12345-0012-L0${unitId?.replace('UNIT-L', '')}-R`;

  return (
    <Modal onClose={onClose}>
      <div style={{
        background: 'rgba(10, 18, 32, 0.95)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        width: '760px', borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 32px 64px rgba(0,0,0,0.6)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column', color: 'var(--text-1)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 32px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          background: 'linear-gradient(to right, rgba(255,255,255,0.02), transparent)'
        }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, var(--accent), #0ea5e9)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 8px 16px rgba(34, 211, 238, 0.2)' }}>
              <FileText size={28} />
            </div>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px' }}>LADM Property Record</h2>
              <div style={{ fontSize: '13px', color: 'var(--text-3)', fontFamily: 'var(--mono)', letterSpacing: '0.02em' }}>3D ULPIN: {ulpin}</div>
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
        <div style={{ padding: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--text-1)' }}>
                <User size={18} style={{ color: 'var(--accent)' }} /> <h3 style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.01em' }}>Ownership Details</h3>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 500, marginBottom: '6px' }}>Primary Owner</div>
                <div style={{ fontSize: '16px', color: 'var(--text-1)', fontWeight: 600, marginBottom: '16px' }}>Anjali Sharma</div>
                <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 500, marginBottom: '6px' }}>Aadhaar Hash</div>
                <div style={{ fontSize: '14px', color: 'var(--text-2)', fontFamily: 'var(--mono)', letterSpacing: '0.02em' }}>xxxx-xxxx-8492</div>
              </div>
            </section>

            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--text-1)' }}>
                <ShieldCheck size={18} style={{ color: 'var(--accent)' }} /> <h3 style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.01em' }}>Legal & Encumbrances</h3>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
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
            
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--text-1)' }}>
                <Building2 size={18} style={{ color: 'var(--accent)' }} /> <h3 style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.01em' }}>Spatial Geometry</h3>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 500, marginBottom: '6px' }}>Volume</div>
                    <div style={{ fontSize: '16px', color: 'var(--text-1)', fontWeight: 600 }}>432.5 <span style={{fontSize:'13px', color: 'var(--text-3)'}}>m³</span></div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 500, marginBottom: '6px' }}>Floor Area</div>
                    <div style={{ fontSize: '16px', color: 'var(--text-1)', fontWeight: 600 }}>144.1 <span style={{fontSize:'13px', color: 'var(--text-3)'}}>m²</span></div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 500, marginBottom: '6px' }}>Z-Min</div>
                    <div style={{ fontSize: '14px', color: 'var(--text-2)', fontWeight: 500, fontFamily: 'var(--mono)' }}>+9.0 m</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 500, marginBottom: '6px' }}>Z-Max</div>
                    <div style={{ fontSize: '14px', color: 'var(--text-2)', fontWeight: 500, fontFamily: 'var(--mono)' }}>+12.0 m</div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--text-1)' }}>
                <Key size={18} style={{ color: 'var(--accent)' }} /> <h3 style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.01em' }}>Access Rights</h3>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.6 }}>
                Shared access to ground lobby, elevator shaft C, and emergency stairwell 2 defined via topological links to parent building BLD-MH-PUN-B239.
              </div>
            </section>

          </div>
        </div>
        
        {/* Footer */}
        <div style={{ padding: '20px 32px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
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
      </div>
    </Modal>
  );
}
