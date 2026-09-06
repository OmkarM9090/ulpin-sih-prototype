import React, { useState, useEffect } from 'react';
import './styles.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LeftSidebar from './components/LeftSidebar';
import Viewer3D from './components/Viewer3D';
import ViewerToolbar from './components/ViewerToolbar';
import ViewerLegend from './components/ViewerLegend';
import UnitDetails from './components/UnitDetails';
import Modal from './components/Modal';
import { useToast } from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';

function InfoModal({ onClose }) {
  return (
    <Modal onClose={onClose}>
      <div style={{
        backgroundColor: 'var(--bg-panel)', color: 'var(--text-primary)', width: '100vw', maxWidth: '800px',
        borderRadius: '16px', position: 'relative', overflow: 'hidden',
        border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-lg)',
        display: 'flex'
      }}>
        {/* Left column */}
        <div style={{ flex: 2, padding: '32px' }}>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1.5rem', fontWeight: 600 }}>About GeoCadastre 3D</h2>
          <p style={{ fontSize: '0.95rem', marginBottom: '16px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
            This proof-of-concept for SIH 2026 (PS 26011) demonstrates a full 7-stage engine for processing 2D cadastral data into hierarchical 3D volumetric property units.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
            <div style={{ flex: 1, background: 'var(--bg-primary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-default)' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '4px' }}>1.2s</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Avg. Generation Time</div>
            </div>
            <div style={{ flex: 1, background: 'var(--bg-primary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-default)' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--success)', marginBottom: '4px' }}>100%</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Topology Compliance</div>
            </div>
            <div style={{ flex: 1, background: 'var(--bg-primary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-default)' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--warning)', marginBottom: '4px' }}>ISO</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>19152 LADM Ready</div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ flex: 1, padding: '32px', background: 'var(--bg-elevated)', borderLeft: '1px solid var(--border-subtle)' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', color: 'var(--text-muted)', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '24px' }}>Keyboard Shortcuts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { key: 'Space', desc: 'Run Pipeline' },
              { key: 'Esc', desc: 'Clear Selection / Close Modals' },
              { key: 'R', desc: 'Reset Camera' },
              { key: '1-4', desc: 'Camera Presets' },
              { key: 'L', desc: 'Toggle Labels' },
              { key: 'G', desc: 'Toggle Grid' }
            ].map(shortcut => (
              <div key={shortcut.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <kbd style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-default)', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-primary)', boxShadow: '0 2px 0 var(--border-subtle)' }}>{shortcut.key}</kbd>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{shortcut.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function App() {
  const [pipelineState, setPipelineState] = useState('idle');
  const [systemData, setSystemData] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  
  const addToast = useToast();

  // Viewer state
  const [explodeValue, setExplodeValue] = useState(0);
  const [showLabels, setShowLabels] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [cameraPreset, setCameraPreset] = useState('isometric');
  const [resetTrigger, setResetTrigger] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState(null);
  
  const [visibleLayers, setVisibleLayers] = useState({
    apartments: true,
    basements: true,
    terrace: true,
    metro: true,
    utility: true,
    common: true,
    boundary: true
  });

  const toggleLayer = (layerId) => {
    setVisibleLayers(prev => ({ ...prev, [layerId]: !prev[layerId] }));
  };

  const handleResetCamera = () => {
    setCameraPreset('isometric');
    setResetTrigger(prev => prev + 1);
    addToast('View reset to Isometric', 'info');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch(e.key.toLowerCase()) {
        case ' ': // space
          e.preventDefault();
          if (pipelineState !== 'running' && pipelineState !== 'complete') {
            setPipelineState('running');
          }
          break;
        case 'escape':
          setSelectedUnit(null);
          setShowInfo(false);
          break;
        case 'r':
          handleResetCamera();
          break;
        case '1':
          setCameraPreset('isometric');
          break;
        case '2':
          setCameraPreset('top');
          break;
        case '3':
          setCameraPreset('front');
          break;
        case '4':
          setCameraPreset('underground');
          break;
        case 'l':
          setShowLabels(prev => !prev);
          break;
        case 'g':
          setShowGrid(prev => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pipelineState]);

  return (
    <div className="app-shell">
      <Navbar onShowInfo={() => setShowInfo(true)} />

      {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}

      <main className="app-main">
        <LeftSidebar 
          pipelineState={pipelineState} 
          setPipelineState={setPipelineState} 
          onPipelineComplete={setSystemData} 
        />

        <section className="panel-center">
          <ViewerToolbar 
            explodeValue={explodeValue} setExplodeValue={setExplodeValue}
            showLabels={showLabels} setShowLabels={setShowLabels}
            showGrid={showGrid} setShowGrid={setShowGrid}
            cameraPreset={cameraPreset} setCameraPreset={setCameraPreset}
            onResetCamera={handleResetCamera}
            visibleLayers={visibleLayers} toggleLayer={toggleLayer}
          />
          
          <div className="canvas-container" style={{ position: 'relative' }}>
            {(!systemData || pipelineState !== 'complete') && (
              <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)',
                border: '1px solid var(--border-subtle)', borderRadius: '12px',
                padding: '16px 24px', color: 'var(--text-primary)', fontSize: '14px', fontWeight: 500,
                pointerEvents: 'none', zIndex: 10, display: 'flex', alignItems: 'center', gap: '12px',
                boxShadow: 'var(--shadow-lg)'
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)', animation: 'pulse 1.5s infinite' }}></div>
                Awaiting Data Ingestion / Run Pipeline to start
              </div>
            )}
            <ErrorBoundary>
              <Viewer3D 
                systemData={systemData} 
                explodeValue={explodeValue} 
                showLabels={showLabels} 
                showGrid={showGrid}
                visibleLayers={visibleLayers}
                cameraPreset={cameraPreset}
                resetTrigger={resetTrigger}
                selectedUlpin={selectedUnit}
                onSelect={setSelectedUnit} 
              />
            </ErrorBoundary>
          </div>
          
          <ViewerLegend />
        </section>

        <aside className="panel-right">
          <UnitDetails selectedUnit={selectedUnit} />
        </aside>
      </main>

      <Footer />
    </div>
  );
}

export default App;
