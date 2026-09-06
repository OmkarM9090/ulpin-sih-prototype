import { useState } from 'react';
import './styles.css';
import PipelinePanel from './components/PipelinePanel';
import Viewer3D from './components/Viewer3D';
import UnitDetails from './components/UnitDetails';

function App() {
  const [pipelineState, setPipelineState] = useState('idle');
  const [explodeValue, setExplodeValue] = useState(0);
  const [showLabels, setShowLabels] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [systemData, setSystemData] = useState(null);

  const runPipeline = () => {
    setPipelineState('running');
  };

  const resetCamera = () => {
    // Will be wired to Viewer3D
    console.log("Reset camera requested");
  };

  return (
    <>
      <header className="app-header">
        <div className="header-title">🏙️ 3D ULPIN & Vertical Property Mapping System</div>
        <div className="header-subtitle">SIH 2026 · PS 26011 · Prototype Demo</div>
      </header>

      <main className="app-main">
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
            <Viewer3D explodeValue={explodeValue} showLabels={showLabels} onSelect={setSelectedUnit} />
          </div>
        </section>

        <aside className="panel-right">
          <UnitDetails selectedUnit={selectedUnit} />
        </aside>
      </main>
    </>
  );
}

export default App;
