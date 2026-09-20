import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useOutletContext } from 'react-router-dom';
import { RotateCcw, Square, MoveHorizontal, Box, Layers, MousePointerClick } from 'lucide-react';
import ErrorBoundary from '../components/ErrorBoundary';
import AIModal from '../components/AIModal';
import PropertyCardModal from '../components/PropertyCardModal';

const Viewer3D = React.lazy(() => import('../components/Viewer3D'));

const ViewerFallback = () => (
  <div style={{
    width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-0)', color: 'var(--accent)'
  }}>
    <div className="spin" style={{
      width: '40px', height: '40px', border: '3px solid rgba(34, 211, 238, 0.2)',
      borderTopColor: 'var(--accent)', borderRadius: '50%', marginBottom: '16px',
      boxShadow: '0 0 15px rgba(34, 211, 238, 0.4)'
    }} />
    <div style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em' }}>INITIALIZING 3D ENGINE...</div>
    <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

export default function PropertyMap() {
  const { systemData, pipelineState, setPipelineState, demoAction } = useOutletContext();
  
  const [viewMode, setViewMode] = useState('3D'); // '2D' or '3D'
  const [showUnderground, setShowUnderground] = useState(false);
  const [cameraPreset, setCameraPreset] = useState('isometric');
  const [resetTrigger, setResetTrigger] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showPropertyCard, setShowPropertyCard] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const layersRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (layersRef.current && !layersRef.current.contains(e.target)) {
        setShowLayers(false);
      }
    };
    if (showLayers) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLayers]);

  useEffect(() => {
    if (demoAction === 'AI_EXTRACTION') setShowAIModal(true);
    if (demoAction === 'SELECT_UNIT') setSelectedUnit('UNIT-L3');
    if (demoAction === 'SHOW_CARD') setShowPropertyCard(true);
  }, [demoAction]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent spacebar from scrolling if we are not typing in an input
      if (e.key === ' ' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setShowAIModal(true);
      }
      if (e.key === 'r' || e.key === 'R') {
        handleResetCamera();
      }
      if (e.key === 'Escape') {
        setShowLayers(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
            <Suspense fallback={<ViewerFallback />}>
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
            </Suspense>
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
              MH-PUN-P123456 · B-239
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-4)' }}>
              Scene Coordinates · Local Demo Space · DEM OFF
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
              background: 'rgba(10, 18, 32, 0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              borderRadius: '12px', display: 'flex', flexDirection: 'column', padding: '6px', gap: '4px'
            }}>
              {[
                { icon: RotateCcw, action: handleResetCamera, title: 'Reset View' },
                { icon: Square, action: () => setCameraPreset('top'), title: 'Top Down' },
                { icon: MoveHorizontal, action: () => setCameraPreset('side'), title: 'Side Elevation' },
                { icon: Box, action: () => setCameraPreset('isometric'), title: 'Isometric 3D' },
              ].map((btn, i) => (
                <button
                  key={i}
                  onClick={btn.action}
                  title={btn.title}
                  aria-label={`View camera: ${btn.title}`}
                  style={{
                    width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-2)', borderRadius: '8px',
                    background: 'transparent', border: 'none', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-2)'; }}
                >
                  <btn.icon size={18} />
                </button>
              ))}
            </div>
            
            {/* Compass */}
            <div 
              title="Reset North" 
              onClick={handleResetCamera}
              style={{
                width: '64px', height: '64px', borderRadius: '50%', cursor: 'pointer',
                background: 'rgba(10, 18, 32, 0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', transition: 'all 0.2s',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(10, 18, 32, 0.75)'; }}
            >
              <span style={{ position: 'absolute', top: '4px', fontSize: '9px', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>N</span>
              <span style={{ position: 'absolute', bottom: '4px', fontSize: '9px', color: 'rgba(255,255,255,0.2)', fontWeight: 700 }}>S</span>
              <span style={{ position: 'absolute', right: '4px', fontSize: '9px', color: 'rgba(255,255,255,0.2)', fontWeight: 700 }}>E</span>
              <span style={{ position: 'absolute', left: '4px', fontSize: '9px', color: 'rgba(255,255,255,0.2)', fontWeight: 700 }}>W</span>
              {/* Central needle container rotated via ref without CSS transition to prevent 360 snap back */}
              <div ref={compassRef} style={{ width: '44px', height: '44px', borderRadius: '50%', willChange: 'transform' }}>
                <div style={{ width: '3px', height: '22px', background: 'var(--danger)', margin: '0 auto', borderRadius: '3px 3px 0 0', boxShadow: '0 0 6px var(--danger)' }}></div>
                <div style={{ width: '3px', height: '22px', background: 'rgba(255,255,255,0.8)', margin: '0 auto', borderRadius: '0 0 3px 3px' }}></div>
              </div>
            </div>
          </div>

          {/* Overlay: Top-Right LAYERS Popover */}
          <div ref={layersRef} style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 50 }}>
            {/* Toggle Button */}
            <button
              onClick={() => setShowLayers(!showLayers)}
              style={{
                background: showLayers ? 'var(--bg-3)' : 'var(--bg-2)', border: '1px solid var(--border-1)',
                borderRadius: '8px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px',
                color: showLayers ? 'var(--text-1)' : 'var(--text-2)', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)', transition: 'all var(--transition)'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.color = 'var(--text-1)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = showLayers ? 'var(--bg-3)' : 'var(--bg-2)'; e.currentTarget.style.color = showLayers ? 'var(--text-1)' : 'var(--text-2)'; }}
            >
              <Layers size={16} />
              <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>LAYERS</span>
            </button>

            {/* Popover Panel */}
            {showLayers && (
              <div style={{
                position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '240px',
                background: 'var(--bg-2)', border: '1px solid var(--border-1)',
                borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden',
                boxShadow: '0 12px 32px rgba(0,0,0,0.5)', zIndex: 51,
                animation: 'fade-in 0.15s ease-out'
              }}>
                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Map Layers</div>
                  {[
                    { key: 'parcels', label: 'Parcels' },
                    { key: 'buildings', label: 'Buildings' },
                    { key: 'floors', label: 'Floors' },
                    { key: 'units', label: 'Property Units' }
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
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.1s'
                      }}>
                        {layers[layer.key] && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--bg-0)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </div>
                      <span style={{ fontSize: '12px', color: layers[layer.key] ? 'var(--text-1)' : 'var(--text-2)' }}>{layer.label}</span>
                    </label>
                  ))}

                  <div style={{ height: '1px', background: 'var(--border-2)', margin: '4px 0' }}></div>
                  <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Infrastructure</div>
                  
                  {[
                    { key: 'roads', label: 'Roads' },
                    { key: 'utilities', label: 'Underground Utilities' },
                    { key: 'tunnels', label: 'Tunnels' }
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
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.1s'
                      }}>
                        {layers[layer.key] && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--bg-0)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </div>
                      <span style={{ fontSize: '12px', color: layers[layer.key] ? 'var(--text-1)' : 'var(--text-2)' }}>{layer.label}</span>
                    </label>
                  ))}
                  
                  <div style={{ height: '1px', background: 'var(--border-2)', margin: '4px 0' }}></div>
                  <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Context</div>

                  {[
                    { key: 'labels', label: 'Labels' },
                    { key: 'dem', label: 'DEM / Terrain' }
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
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.1s'
                      }}>
                        {layers[layer.key] && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--bg-0)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </div>
                      <span style={{ fontSize: '12px', color: layers[layer.key] ? 'var(--text-1)' : 'var(--text-2)' }}>{layer.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Overlay: Floating Property Information Panel */}
          {selectedUnit && (
            <div style={{
              position: 'absolute', top: '80px', right: '24px', width: '360px', maxHeight: 'calc(100% - 104px)',
              background: 'rgba(10, 18, 32, 0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px',
              display: 'flex', flexDirection: 'column', boxShadow: '0 24px 48px rgba(0,0,0,0.5)', zIndex: 40,
              animation: 'fade-in 0.2s ease-out', color: 'var(--text-1)'
            }}>
              {/* Header */}
              <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.01em', marginBottom: '4px' }}>{selectedUnit}</h2>
                    <div style={{ fontSize: '13px', color: 'var(--text-3)', fontWeight: 500 }}>Residential Apartment</div>
                  </div>
                  <button 
                    onClick={() => setSelectedUnit(null)}
                    style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-2)', borderRadius: '6px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.color = 'var(--text-2)'; }}
                  >
                    ✕
                  </button>
                </div>
                {/* Tabs */}
                <div style={{ display: 'flex', gap: '20px', marginTop: '24px' }}>
                  {['Overview', 'Ownership', 'Dimensions'].map((tab, i) => (
                    <div key={tab} style={{
                      fontSize: '13px', fontWeight: i === 0 ? 600 : 500, color: i === 0 ? 'var(--accent)' : 'var(--text-3)',
                      paddingBottom: '8px', borderBottom: i === 0 ? '2px solid var(--accent)' : '2px solid transparent',
                      cursor: 'pointer', transition: 'color 0.2s'
                    }}>
                      {tab}
                    </div>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-3)', fontWeight: 500 }}>Record Status</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(34,197,94,0.1)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.2)', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em' }}>
                    ✓ VALIDATED
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>3D ULPIN Identity</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', padding: '12px 14px', borderRadius: '8px' }}>
                    <code style={{ fontSize: '14px', color: 'var(--text-1)', fontWeight: 600, letterSpacing: '0.02em' }}>09-12345-0012-L0{selectedUnit.replace('UNIT-L', '').replace('-', '')}-R</code>
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--text-3)', cursor: 'pointer', transition: 'color 0.2s' }} title="Copy">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                  </div>
                </div>

                <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.05)' }}></div>

                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-2)', marginBottom: '16px' }}>Spatial Anchor (Center)</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 500, marginBottom: '4px' }}>Northing</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-1)', fontFamily: 'var(--mono)' }}>Scene Local Y</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 500, marginBottom: '4px' }}>Easting</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-1)', fontFamily: 'var(--mono)' }}>Scene Local X</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 500, marginBottom: '4px' }}>Enclosed Volume</div>
                    <div style={{ fontSize: '15px', color: 'var(--text-1)', fontWeight: 600 }}>432.5 <span style={{fontSize: '12px', color: 'var(--text-3)'}}>m³</span></div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 500, marginBottom: '4px' }}>Floor Level</div>
                    <div style={{ fontSize: '15px', color: 'var(--text-1)', fontWeight: 600 }}>{selectedUnit.replace('UNIT-L', '')}</div>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '32px' }}>
                  <button 
                    onClick={() => setShowPropertyCard(true)}
                    style={{ width: '100%', background: 'var(--accent)', color: 'var(--bg-0)', padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(34, 211, 238, 0.2)' }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(34, 211, 238, 0.3)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 211, 238, 0.2)'; }}
                  >
                    View Full LADM Record
                  </button>
                  <button style={{ width: '100%', background: 'transparent', color: 'var(--text-1)', border: '1px solid rgba(255,255,255,0.2)', padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    Export Geometry (CityGML)
                  </button>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>

      {showAIModal && <AIModal onClose={() => setShowAIModal(false)} onComplete={handleAIComplete} />}
      {showPropertyCard && <PropertyCardModal unitId={selectedUnit} onClose={() => setShowPropertyCard(false)} />}
    </div>
  );
}
