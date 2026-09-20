import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { RotateCcw, Square, MoveHorizontal, Box, Layers, MousePointerClick } from 'lucide-react';
import Viewer3D from '../components/Viewer3D';
import ErrorBoundary from '../components/ErrorBoundary';
import AIModal from '../components/AIModal';
import PropertyCardModal from '../components/PropertyCardModal';

export default function PropertyMap() {
  const { systemData, pipelineState, setPipelineState, demoAction } = useOutletContext();
  
  const [viewMode, setViewMode] = useState('3D'); // '2D' or '3D'
  const [showUnderground, setShowUnderground] = useState(false);
  const [cameraPreset, setCameraPreset] = useState('isometric');
  const [resetTrigger, setResetTrigger] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showPropertyCard, setShowPropertyCard] = useState(false);

  useEffect(() => {
    if (demoAction === 'AI_EXTRACTION') setShowAIModal(true);
    if (demoAction === 'SELECT_UNIT') setSelectedUnit('UNIT-L3');
    if (demoAction === 'SHOW_CARD') setShowPropertyCard(true);
  }, [demoAction]);

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
    setShowAIModal(true);
  };

  const handleAIComplete = () => {
    // Usually we would trigger a refresh of data or highlight new units here.
    console.log("AI Extraction Complete");
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
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Header */}
              <div style={{ padding: '24px 24px 16px 24px', borderBottom: '1px solid var(--border-1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '4px' }}>{selectedUnit}</h2>
                    <div style={{ fontSize: '13px', color: 'var(--text-3)' }}>Residential Apartment</div>
                  </div>
                  <button 
                    onClick={() => setSelectedUnit(null)}
                    style={{ background: 'var(--bg-1)', border: '1px solid var(--border-2)', color: 'var(--text-2)', borderRadius: '6px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>
                {/* Tabs */}
                <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
                  {['Overview', 'Ownership', 'Dimensions'].map((tab, i) => (
                    <div key={tab} style={{
                      fontSize: '13px', fontWeight: i === 0 ? 600 : 500, color: i === 0 ? 'var(--accent)' : 'var(--text-3)',
                      paddingBottom: '8px', borderBottom: i === 0 ? '2px solid var(--accent)' : '2px solid transparent',
                      cursor: 'pointer'
                    }}>
                      {tab}
                    </div>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>Status</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(34,197,94,0.1)', color: 'var(--success)', border: '1px solid var(--success)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                    ✓ VALIDATED
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>3D ULPIN</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-1)', border: '1px solid var(--border-2)', padding: '10px 12px', borderRadius: '6px' }}>
                    <code style={{ fontSize: '13px', color: 'var(--text-1)', fontWeight: 600 }}>09-12345-0012-L0{selectedUnit.replace('UNIT-L', '')}-R</code>
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }} title="Copy">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                  </div>
                </div>

                <div style={{ height: '1px', background: 'var(--border-1)' }}></div>

                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-1)', marginBottom: '12px' }}>Spatial Coordinates (Center)</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ background: 'var(--bg-1)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-2)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '2px' }}>Latitude</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-1)', fontFamily: 'var(--mono)' }}>26.846721° N</div>
                    </div>
                    <div style={{ background: 'var(--bg-1)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-2)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '2px' }}>Longitude</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-1)', fontFamily: 'var(--mono)' }}>80.946211° E</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Volume</div>
                    <div style={{ fontSize: '14px', color: 'var(--text-1)', fontWeight: 500 }}>432.5 m³</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Floor Level</div>
                    <div style={{ fontSize: '14px', color: 'var(--text-1)', fontWeight: 500 }}>{selectedUnit.replace('UNIT-L', '')}</div>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '24px' }}>
                  <button 
                    onClick={() => setShowPropertyCard(true)}
                    style={{ width: '100%', background: 'var(--accent)', color: 'var(--bg-0)', padding: '10px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                  >
                    View LADM Record
                  </button>
                  <button style={{ width: '100%', background: 'transparent', color: 'var(--text-2)', border: '1px solid var(--border-2)', padding: '10px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                    Export CityGML
                  </button>
                </div>

              </div>
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

      {showAIModal && <AIModal onClose={() => setShowAIModal(false)} onComplete={handleAIComplete} />}
      {showPropertyCard && <PropertyCardModal unitId={selectedUnit} onClose={() => setShowPropertyCard(false)} />}
    </div>
  );
}
