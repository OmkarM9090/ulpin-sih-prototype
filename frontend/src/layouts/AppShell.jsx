import React, { useState, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LeftSidebar from '../components/LeftSidebar';
import Modal from '../components/Modal';
import JudgeDemo from '../components/JudgeDemo';

function InfoModal({ onClose }) {
  return (
    <Modal onClose={onClose}>
      <div style={{
        backgroundColor: 'var(--bg-2)', color: 'var(--text-1)', width: '100vw', maxWidth: '800px',
        borderRadius: '16px', position: 'relative', overflow: 'hidden',
        border: '1px solid var(--border-1)', boxShadow: 'var(--shadow-lg)',
        display: 'flex'
      }}>
        {/* Left column */}
        <div style={{ flex: 2, padding: '32px' }}>
          <h2 style={{ color: 'var(--text-1)', marginBottom: '16px', fontSize: '1.5rem', fontWeight: 600 }}>About GeoCadastre 3D</h2>
          <p style={{ fontSize: '0.95rem', marginBottom: '16px', lineHeight: '1.6', color: 'var(--text-2)' }}>
            This prototype for SIH 2026 (PS 26011) demonstrates the proposed technical workflow for processing synthetic cadastral data into hierarchical 3D volumetric property units. All data is controlled demo data.
          </p>
          
          <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--warning)', marginBottom: '4px' }}>⚠️ Data Honesty</div>            <div style={{ fontSize: '11px', color: 'var(--text-2)' }}>
              All parcel data, measurements, ownership, and validation results shown in this prototype are <strong>synthetic/demo data</strong> created for demonstration purposes. This system does not use real government cadastral data.
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
            <div style={{ flex: 1, background: 'var(--bg-1)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-2)' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent)', marginBottom: '4px' }}>1.2s</div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Avg. Generation Time</div>
            </div>
            <div style={{ flex: 1, background: 'var(--bg-1)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-2)' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--success)', marginBottom: '4px' }}>✓</div>              <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Prototype Validation</div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ flex: 1, padding: '32px', background: 'var(--bg-3)', borderLeft: '1px solid var(--border-1)' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', color: 'var(--text-3)', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-1)', marginBottom: '24px' }}>Keyboard Shortcuts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { key: 'Space', desc: 'Run Pipeline' },
              { key: 'Esc', desc: 'Clear / Close' },
              { key: 'R', desc: 'Reset Camera' },
            ].map(shortcut => (
              <div key={shortcut.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <kbd style={{ background: 'var(--bg-1)', border: '1px solid var(--border-2)', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-1)' }}>{shortcut.key}</kbd>
                <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>{shortcut.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default function AppShell() {
  const [pipelineState, setPipelineState] = useState('idle');
  const [systemData, setSystemData] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [demoActive, setDemoActive] = useState(false);
  const searchControlRef = useRef(null);
  
  return (
    <div className="app-shell">
      <Navbar onShowInfo={() => setShowInfo(true)} onShowDemo={() => setDemoActive(true)} />

      {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}

      <main className="app-main" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <LeftSidebar 
          pipelineState={pipelineState} 
          setPipelineState={setPipelineState} 
          onPipelineComplete={setSystemData} 
          searchControlRef={searchControlRef}
        />

        <section className="panel-center" style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Outlet context={{ systemData, pipelineState, setPipelineState }} />
        </section>
      </main>

      {/* Placeholder for BottomActionBar */}
      <div style={{ height: '48px', background: 'var(--bg-2)', borderTop: '1px solid var(--border-1)' }}>
          {/* Bottom action bar will go here */}
      </div>

      <Footer />

      {demoActive && (
        <JudgeDemo
          pipelineState={pipelineState}
          setQueryInSearch={(q) => searchControlRef.current?.runSearch(q)}
          onExit={() => setDemoActive(false)}
        />
      )}
    </div>
  );
}
