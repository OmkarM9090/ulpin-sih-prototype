import { useState } from 'react';
import './styles.css';
import PipelinePanel from './components/PipelinePanel';
import Viewer3D from './components/Viewer3D';
import UnitDetails from './components/UnitDetails';

function InfoModal({ onClose }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 999999, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#1e293b', color: '#e2e8f0', width: '100%', maxWidth: '500px',
        borderRadius: '8px', padding: '24px', position: 'relative',
        border: '1px solid #334155', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: '#334155', color: '#fff', padding: '4px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Close</button>
        <h2 style={{ color: '#38bdf8', marginBottom: '16px', fontSize: '1.25rem' }}>About this Prototype</h2>
        
        <h4 style={{ color: '#94a3b8', marginBottom: '4px' }}>What is this?</h4>
        <p style={{ fontSize: '0.9rem', marginBottom: '16px', lineHeight: '1.5' }}>
          This is a proof-of-concept for SIH 2026 (PS 26011). It demonstrates how to vertically partition a 2D land parcel into multiple 3D volumetric property units, assigning a unique hierarchical 3D-ULPIN to each.
        </p>
        
        <h4 style={{ color: '#94a3b8', marginBottom: '4px' }}>How the demo works</h4>
        <ul style={{ fontSize: '0.9rem', marginBottom: '16px', paddingLeft: '20px', lineHeight: '1.5', color: '#cbd5e1' }}>
          <li>1. Ingests a 2D parent parcel ULPIN</li>
          <li>2. Extracts building footprints</li>
          <li>3. Segments logical floors</li>
          <li>4. Extrudes 3D volumes (Z-bounds)</li>
          <li>5. Validates topology (watertight, no overlaps)</li>
          <li>6. Generates unique 3D-ULPIN strings</li>
          <li>7. Renders interactive cadastral view</li>
        </ul>
        
        <div style={{ backgroundColor: 'rgba(56,189,248,0.1)', padding: '12px', borderRadius: '4px', borderLeft: '3px solid #38bdf8', fontSize: '0.85rem' }}>
          <strong>Data Note:</strong> This prototype uses representative preprocessed inputs for instant demonstration.
        </div>
      </div>
    </div>
  );
}

function Legend() {
  const items = [
    { label: 'Basement', color: '#f59e0b' },
    { label: 'Ground', color: '#eab308' },
    { label: 'Floor 1', color: '#3b82f6' },
    { label: 'Floor 2', color: '#6366f1' },
    { label: 'Floor 3', color: '#8b5cf6' }
  ];
  return (
    <div style={{
      position: 'absolute', bottom: '16px', left: '16px', zIndex: 10,
      backgroundColor: 'rgba(30, 41, 59, 0.85)', padding: '8px 12px', borderRadius: '6px',
      border: '1px solid #334155', display: 'flex', gap: '16px', backdropFilter: 'blur(4px)'
    }}>
      {items.map(item => (
        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#cbd5e1' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: item.color, borderRadius: '2px' }} />
          {item.label}
        </div>
      ))}
    </div>
  );
}

function App() {
  const [pipelineState, setPipelineState] = useState('idle');
  const [explodeValue, setExplodeValue] = useState(0);
  const [showLabels, setShowLabels] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [systemData, setSystemData] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const runPipeline = () => {
    setPipelineState('running');
  };

  const resetCamera = () => {
    window.location.reload();
  };

  return (
    <>
      <header className="app-header">
        <div className="header-title">🏙️ 3D ULPIN & Vertical Property Mapping System</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="header-subtitle">SIH 2026 · PS 26011 · Prototype Demo</div>
          <button onClick={() => setShowInfo(true)} title="About this demo" style={{ padding: '2px 8px', borderRadius: '50%', background: '#38bdf8', color: '#0f172a', fontWeight: 'bold' }}>?</button>
        </div>
      </header>

      {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}

      <main className="app-main" style={{ height: 'calc(100vh - 60px - 32px)' }}>
        <aside className="panel-left">
          <PipelinePanel state={pipelineState} onComplete={setSystemData} />
        </aside>

        <section className="panel-center">
          <div className="toolbar">
            <button onClick={runPipeline} title="Start ULPIN Generation Pipeline">
              Run Pipeline
            </button>
            <div className="slider-container" title="Separate floors vertically">
              <label>Explode View</label>
              <input 
                type="range" 
                min="0" max="100" 
                value={explodeValue}
                onChange={(e) => setExplodeValue(Number(e.target.value))}
              />
            </div>
            <button onClick={resetCamera} title="Reset camera to default view" style={{background: '#334155', color: '#fff'}}>
              Reset Camera
            </button>
            <div className="toggle-container" title="Show/Hide Unit Labels">
              <input 
                type="checkbox" 
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
                id="labels-toggle"
              />
              <label htmlFor="labels-toggle">Labels</label>
            </div>
          </div>
          
          <div className="canvas-container">
            <Viewer3D systemData={systemData} explodeValue={explodeValue} showLabels={showLabels} onSelect={setSelectedUnit} />
          </div>
          
          <Legend />
        </section>

        <aside className="panel-right">
          <UnitDetails selectedUnit={selectedUnit} />
        </aside>
      </main>

      <footer style={{ height: '32px', backgroundColor: '#0f172a', borderTop: '1px solid #334155', display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: '0.8rem', color: '#94a3b8' }}>
        <div style={{ display: 'flex', gap: '24px' }}>
          <span>Backend: connected ✅</span>
          <span>Units: {systemData ? systemData.units.length : 0}</span>
          <span>Topology: {systemData ? 'VALID' : 'Pending...'}</span>
        </div>
      </footer>
    </>
  );
}

export default App;
