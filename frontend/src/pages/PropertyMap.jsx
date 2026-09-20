import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { RotateCcw, Square, MoveHorizontal, Box, Layers, MousePointerClick } from 'lucide-react';
import Viewer3D from '../components/Viewer3D';
import ErrorBoundary from '../components/ErrorBoundary';

export default function PropertyMap() {
  const { systemData, pipelineState, setPipelineState } = useOutletContext();
  
  const [viewMode, setViewMode] = useState('3D'); // '2D' or '3D'
  const [showUnderground, setShowUnderground] = useState(false);
  const [cameraPreset, setCameraPreset] = useState('isometric');
  const [resetTrigger, setResetTrigger] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const compassRef = useRef(null);

  const [layers, setLayers] = useState({
    parcels: true,
    buildings: true,
    floors: true,
    units: true,
    roads: true,
    utilities: false,
    tunnels: false,
    labels: true,
    dem: false
  });

  const toggleLayer = (key) => setLayers(prev => ({ ...prev, [key]: !prev[key] }));

  // Handlers for later integration
  const handleRunAI = () => {
    // Will be wired in Change 12
  };

  const handleResetCamera = () => {
    setCameraPreset('isometric');
    setResetTrigger(prev => prev + 1);
  };

  const handleCameraRotate = (angle) => {
    if (compassRef.current) {
      compassRef.current.style.transform = `rotate(${-angle}rad)`;
    }
  };

  const activeLayers = {
    ...layers,
    utilities: layers.utilities || showUnderground,
    tunnels: layers.tunnels || showUnderground
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', position: 'relative' }}>
      
      {/* Top Toolbar */}
      <div style={{
        height: '56px', background: 'var(--bg-2)', borderBottom: '1px solid var(--border-1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', zIndex: 10
      }}>
        {/* Left: 2D/3D Toggle */}
        <div style={{ display: 'flex', background: 'var(--bg-1)', borderRadius: '6px', padding: '2px', border: '1px solid var(--border-2)' }}>
          <button
            onClick={() => { setViewMode('2D'); setCameraPreset('top'); }}
            style={{
              padding: '6px 16px', borderRadius: '4px', fontSize: '12px', fontWeight: 600,
              background: viewMode === '2D' ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
              color: viewMode === '2D' ? 'var(--accent)' : 'var(--text-3)'
            }}
          >
            2D VIEW
          </button>
          <button
            onClick={() => { setViewMode('3D'); setCameraPreset('isometric'); }}
            style={{
              padding: '6px 16px', borderRadius: '4px', fontSize: '12px', fontWeight: 600,
              background: viewMode === '3D' ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
              color: viewMode === '3D' ? 'var(--accent)' : 'var(--text-3)'
            }}
          >
            3D VIEW
          </button>
        </div>

        {/* Middle: Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleRunAI}
            style={{
              background: 'var(--bg-1)', border: '1px solid var(--border-2)', color: 'var(--text-1)',
              padding: '6px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            🖥 Run AI Extraction
          </button>
          <button
            onClick={() => setShowUnderground(!showUnderground)}
            style={{
              background: showUnderground ? 'rgba(34, 211, 238, 0.1)' : 'var(--bg-1)',
              border: showUnderground ? '1px solid var(--accent)' : '1px solid var(--border-2)',
              color: showUnderground ? 'var(--accent)' : 'var(--text-1)',
              padding: '6px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            👁 Show Underground
          </button>
        </div>

        {/* Right spacing */}
        <div style={{ width: '150px' }}></div>
      </div>

      <div style={{ display: 'flex', flex: 1, position: 'relative', overflow: 'hidden' }}>
        
        {/* 3D Canvas Area */}
        <div style={{ flex: 1, position: 'relative', background: 'var(--bg-0)' }}>
          
          <ErrorBoundary>
            <Viewer3D 
              systemData={systemData} 
              explodeValue={0} 
              showLabels={activeLayers.labels} 
              showGrid={true}
              visibleLayers={activeLayers}
              cameraPreset={cameraPreset}
              resetTrigger={resetTrigger}
              selectedUlpin={selectedUnit}
              onSelect={setSelectedUnit}
              viewMode={viewMode}
              onCameraRotate={handleCameraRotate}
            />
          </ErrorBoundary>

          {/* Overlay: Bottom-Left Card */}
          <div style={{
            position: 'absolute', bottom: '24px', left: '24px',
            background: 'var(--bg-2)', border: '1px solid var(--border-1)',
            borderRadius: '8px', padding: '12px 16px', pointerEvents: 'none'
          }}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.05em', marginBottom: '4px' }}>
              3D PROPERTY MODEL
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-1)', fontFamily: 'var(--mono)', marginBottom: '2px' }}>
              UP-LKO-P123456 · B-239
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-4)' }}>
              26.8467° N, 80.9462° E · EPSG:32644 · DEM OFF
            </div>
          </div>

          {/* Overlay: Bottom-Right Hint */}
          <div style={{
            position: 'absolute', bottom: '24px', right: '24px',
            fontSize: '11px', color: 'var(--text-3)', pointerEvents: 'none'
          }}>
            Drag orbit · Scroll zoom · Right-drag pan
          </div>

          {/* Overlay: Right-Middle View Controls & Compass */}
          <div style={{
            position: 'absolute', right: '24px', top: '50%', transform: 'translateY(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px'
          }}>
            {/* View Controls */}
            <div style={{
              background: 'var(--bg-2)', border: '1px solid var(--border-1)',
              borderRadius: '8px', display: 'flex', flexDirection: 'column', padding: '4px'
            }}>
              {[
                { icon: RotateCcw, action: handleResetCamera, title: 'Reset' },
                { icon: Square, action: () => setCameraPreset('top'), title: 'Top' },
                { icon: MoveHorizontal, action: () => setCameraPreset('side'), title: 'Side' },
                { icon: Box, action: () => setCameraPreset('isometric'), title: 'Isometric' },
              ].map((btn, i) => (
                <button
                  key={i}
                  onClick={btn.action}
                  title={btn.title}
                  style={{
                    width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-2)', borderRadius: '6px',
                    background: 'transparent',
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.color = 'var(--text-1)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-2)'; }}
                >
                  <btn.icon size={16} />
                </button>
              ))}
            </div>
            
            {/* Compass */}
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%',
              background: 'var(--bg-3)', border: '1px solid var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}>
              <span style={{ position: 'absolute', top: '4px', fontSize: '10px', color: 'var(--text-2)', fontWeight: 700 }}>N</span>
              <span style={{ position: 'absolute', bottom: '4px', fontSize: '10px', color: 'var(--text-2)', fontWeight: 700 }}>S</span>
              <span style={{ position: 'absolute', right: '4px', fontSize: '10px', color: 'var(--text-2)', fontWeight: 700 }}>E</span>
              <span style={{ position: 'absolute', left: '4px', fontSize: '10px', color: 'var(--text-2)', fontWeight: 700 }}>W</span>
              {/* Central needle container rotated via ref */}
              <div ref={compassRef} style={{ width: '40px', height: '40px', borderRadius: '50%', transition: 'transform 0.1s linear' }}>
                <div style={{ width: '2px', height: '20px', background: 'var(--danger)', margin: '0 auto', borderRadius: '2px' }}></div>
                <div style={{ width: '2px', height: '20px', background: 'var(--text-1)', margin: '0 auto', borderRadius: '2px' }}></div>
              </div>
            </div>
          </div>

          {/* Overlay: Top-Right LAYERS Panel */}
          <div style={{
            position: 'absolute', top: '24px', right: '24px', width: '220px',
            background: 'var(--bg-2)', border: '1px solid var(--border-1)',
            borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
          }}>
            <div style={{
              padding: '12px 16px', borderBottom: '1px solid var(--border-1)',
              display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-1)'
            }}>
              <Layers size={16} />
              <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>LAYERS</span>
            </div>
            <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { key: 'parcels', label: 'Parcels' },
                { key: 'buildings', label: 'Buildings' },
                { key: 'floors', label: 'Floors' },
                { key: 'units', label: 'Property Units' },
                { key: 'roads', label: 'Roads' },
                { key: 'utilities', label: 'Underground Utilities' },
                { key: 'tunnels', label: 'Tunnels' },
                { key: 'labels', label: 'Labels' },
                { key: 'dem', label: 'DEM / Terrain' },
              ].map(layer => (
                <label key={layer.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    style={{ display: 'none' }} 
                    checked={layers[layer.key]} 
                    onChange={() => toggleLayer(layer.key)} 
                  />
                  <div style={{
                    width: '14px', height: '14px', borderRadius: '3px',
                    border: layers[layer.key] ? '1px solid var(--accent)' : '1px solid var(--border-2)',
                    background: layers[layer.key] ? 'var(--accent)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {layers[layer.key] && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--bg-0)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>{layer.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Property Information */}
        <aside style={{
          width: '380px', background: 'var(--bg-2)', borderLeft: '1px solid var(--border-1)',
          display: 'flex', flexDirection: 'column'
        }}>
          {selectedUnit ? (
            <div style={{ padding: '24px' }}>
              <div style={{ color: 'var(--text-1)' }}>Property details will appear here.</div>
            </div>
          ) : (
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '32px', textAlign: 'center', color: 'var(--text-3)'
            }}>
              <MousePointerClick size={48} strokeWidth={1} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <div style={{ fontSize: '16px', color: 'var(--text-1)', marginBottom: '8px' }}>Select a property volume</div>
              <div style={{ fontSize: '12px', lineHeight: 1.5 }}>
                Click any floor, apartment or underground asset to inspect its 3D identity.
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
