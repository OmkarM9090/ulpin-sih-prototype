import { useState } from 'react';
import './styles.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LeftSidebar from './components/LeftSidebar';
import Viewer3D from './components/Viewer3D';
import ViewerToolbar from './components/ViewerToolbar';
import ViewerLegend from './components/ViewerLegend';
import UnitDetails from './components/UnitDetails';

function InfoModal({ onClose }) {
  // ... (keep InfoModal as is)
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

function App() {
  const [pipelineState, setPipelineState] = useState('idle');
  const [systemData, setSystemData] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  
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
  };

  return (
    <div className="app-shell">
      <Navbar />

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
          
          <div className="canvas-container">
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
