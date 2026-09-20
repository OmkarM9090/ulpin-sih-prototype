import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Viewer3D from '../components/Viewer3D';
import ViewerToolbar from '../components/ViewerToolbar';
import ViewerLegend from '../components/ViewerLegend';
import UnitDetails from '../components/UnitDetails';
import ErrorBoundary from '../components/ErrorBoundary';
import { useToast } from '../components/Toast';

export default function PropertyMap() {
  const { systemData, pipelineState, setPipelineState } = useOutletContext();
  const addToast = useToast();

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
        case ' ':
          e.preventDefault();
          if (pipelineState !== 'running' && pipelineState !== 'complete') setPipelineState('running');
          break;
        case 'escape':
          setSelectedUnit(null);
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
    <>
      <ViewerToolbar 
        explodeValue={explodeValue} setExplodeValue={setExplodeValue}
        showLabels={showLabels} setShowLabels={setShowLabels}
        showGrid={showGrid} setShowGrid={setShowGrid}
        cameraPreset={cameraPreset} setCameraPreset={setCameraPreset}
        onResetCamera={handleResetCamera}
        visibleLayers={visibleLayers} toggleLayer={toggleLayer}
      />
      <div className="canvas-container" style={{ position: 'relative', flex: 1 }}>
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
      {/* Move UnitDetails here as a floating panel or keep it right aligned */}
      <aside className="panel-right" style={{ position: 'absolute', right: 0, top: 0, height: '100%', borderLeft: '1px solid var(--border-subtle)', background: 'var(--bg-panel)', width: '380px' }}>
        <UnitDetails selectedUnit={selectedUnit} />
      </aside>
    </>
  );
}
