import React from 'react';
import Modal from './Modal';
import { FileText, Printer, Building2, User, Key, ShieldCheck } from 'lucide-react';

export default function PropertyCardModal({ unitId, onClose }) {
  const ulpin = `09-12345-0012-L0${unitId?.replace('UNIT-L', '')}-R`;

  return (
    <Modal onClose={onClose}>
      <div style={{
        background: 'var(--bg-2)', width: '720px', borderRadius: '12px',
        border: '1px solid var(--border-1)', boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px', borderBottom: '1px solid var(--border-1)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          background: 'var(--bg-3)'
        }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg-0)' }}>
              <FileText size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '4px' }}>LADM Property Record</h2>
              <div style={{ fontSize: '13px', color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>3D ULPIN: {ulpin}</div>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'var(--bg-1)', border: '1px solid var(--border-2)', color: 'var(--text-2)', borderRadius: '6px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {/* Body 2-Column Grid */}
        <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--text-1)' }}>
                <User size={16} /> <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Ownership Details</h3>
              </div>
              <div style={{ background: 'var(--bg-1)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-2)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '4px' }}>Primary Owner</div>
                <div style={{ fontSize: '14px', color: 'var(--text-1)', fontWeight: 500, marginBottom: '12px' }}>Anjali Sharma</div>
                <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '4px' }}>Aadhaar Hash</div>
                <div style={{ fontSize: '13px', color: 'var(--text-2)', fontFamily: 'var(--mono)' }}>xxxx-xxxx-8492</div>
              </div>
            </section>

            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--text-1)' }}>
                <ShieldCheck size={16} /> <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Legal & Encumbrances</h3>
              </div>
              <div style={{ background: 'var(--bg-1)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>Mortgage Status</span>
                  <span style={{ fontSize: '13px', color: 'var(--success)', fontWeight: 600 }}>CLEAR</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>Property Tax</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-1)', fontWeight: 600 }}>PAID (2026)</span>
                </div>
              </div>
            </section>

          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--text-1)' }}>
                <Building2 size={16} /> <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Spatial Geometry</h3>
              </div>
              <div style={{ background: 'var(--bg-1)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-2)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '4px' }}>Volume</div>
                    <div style={{ fontSize: '14px', color: 'var(--text-1)', fontWeight: 500 }}>432.5 m³</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '4px' }}>Floor Area</div>
                    <div style={{ fontSize: '14px', color: 'var(--text-1)', fontWeight: 500 }}>144.1 m²</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '4px' }}>Z-Min</div>
                    <div style={{ fontSize: '14px', color: 'var(--text-1)', fontWeight: 500, fontFamily: 'var(--mono)' }}>+9.0 m</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '4px' }}>Z-Max</div>
                    <div style={{ fontSize: '14px', color: 'var(--text-1)', fontWeight: 500, fontFamily: 'var(--mono)' }}>+12.0 m</div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--text-1)' }}>
                <Key size={16} /> <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Access Rights</h3>
              </div>
              <div style={{ background: 'var(--bg-1)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-2)', fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.5 }}>
                Shared access to ground lobby, elevator shaft C, and emergency stairwell 2 defined via topological links to parent building BLD-UP-LKO-B239.
              </div>
            </section>

          </div>
        </div>
        
        {/* Footer */}
        <div style={{ padding: '16px 24px', background: 'var(--bg-1)', borderTop: '1px solid var(--border-1)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
           <button style={{ background: 'transparent', color: 'var(--text-2)', border: '1px solid var(--border-2)', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }} onClick={onClose}>
             Close
           </button>
           <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent)', color: 'var(--bg-0)', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
             <Printer size={16} />
             Print Record
           </button>
        </div>
      </div>
    </Modal>
  );
}
