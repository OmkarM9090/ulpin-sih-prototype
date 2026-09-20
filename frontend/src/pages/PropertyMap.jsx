import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useOutletContext } from 'react-router-dom';
import { RotateCcw, Square, MoveHorizontal, Box, Layers, MousePointerClick, Building2, Map, CheckCircle2, XCircle, Info, FileText, RefreshCw, Route } from 'lucide-react';
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

const FloatingPropertyPanel = ({ selectedUnit, onClose, onOpenFullRecord }) => {
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('idle'); // 'idle', 'generating', 'success'
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    let active = true;
    setGenerationStatus('idle');
    setToastMessage(null);
    const isUnit = selectedUnit?.startsWith('U') || selectedUnit?.startsWith('B');
    
    if (isUnit) {
      setLoading(true);
      fetch('http://127.0.0.1:8000/api/units')
        .then(res => res.json())
        .then(units => {
          if (!active) return;
          const unit = units.find(u => u.unit_id === selectedUnit);
          if (unit) {
            return fetch(`http://127.0.0.1:8000/api/unit/${unit.ulpin || unit.generated_3d_ulpin}`)
              .then(res => res.json())
              .then(data => {
                if (active) {
                  setPropertyData(data);
                  setLoading(false);
                }
              });
          } else {
            if (active) setLoading(false);
          }
        })
        .catch(err => {
          if (active) {
            console.error('Error fetching unit data:', err);
            setLoading(false);
          }
        });
    } else {
      setPropertyData(null);
    }
    
    return () => { active = false; };
  }, [selectedUnit]);

  const handleGenerateClick = () => {
    if (generationStatus !== 'idle') return;
    setGenerationStatus('generating');
    setTimeout(() => {
      setGenerationStatus('success');
      setToastMessage(`3D ULPIN Generated & Registered to Cadastre`);
      setTimeout(() => setToastMessage(null), 3000); // 3 seconds auto-dismiss
    }, 1500);
  };

  if (!selectedUnit || !propertyData) return null; // Only show for modeled units for now.

  const pd = propertyData; // Alias for cleaner code

  return (
    <>
      {/* Toast Notification (Top Right) */}
      {toastMessage && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px',
          background: '#065f46', 
          padding: '16px 24px', borderRadius: '8px', color: '#fff', fontSize: '14px',
          fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px', zIndex: 9999,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)', border: '1px solid rgba(16, 185, 129, 0.4)',
          animation: 'slide-in-right 0.2s ease-out'
        }}>
          <CheckCircle2 size={18} color="#22d3ee" />
          {toastMessage}
        </div>
      )}
      <style>{`
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* Floating Panel */}
      <div style={{
        position: 'absolute', top: '80px', right: '24px', width: '420px', maxHeight: 'calc(100% - 104px)',
        background: 'rgba(5, 8, 15, 0.95)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px',
        display: 'flex', flexDirection: 'column', boxShadow: '0 24px 48px rgba(0,0,0,0.5)', zIndex: 40,
        animation: 'fade-in 0.2s ease-out', color: 'var(--text-1)'
      }}>
        
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-3)' }}>Loading property data...</div>
        ) : (
          <>
            {/* SECTION 1: IDENTITY HEADER */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0, fontFamily: 'var(--mono)' }}>{pd.unit_id}</h2>
                  
                  {generationStatus === 'idle' && <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-2)', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>Draft</span>}
                  {generationStatus === 'generating' && <span style={{ fontSize: '11px', background: 'rgba(245, 158, 11, 0.2)', color: 'var(--warning)', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>Generating...</span>}
                  {generationStatus === 'success' && <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '2px 8px', borderRadius: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={12}/> ULPIN Generated</span>}
                  
                </div>
                <div style={{ fontSize: '10px', color: 'var(--warning)', fontWeight: 600, background: 'rgba(245, 158, 11, 0.1)', padding: '2px 6px', borderRadius: '4px', display: 'inline-block' }}>PROTOTYPE · Synthetic Data</div>
              </div>
              <button 
                onClick={onClose}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: '4px' }}
              >✕</button>
            </div>

            <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* SECTION 2: GENERATED 3D ULPIN */}
              <div style={{ background: 'rgba(34,211,238,0.05)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: '8px', padding: '16px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>3D ULPIN</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '16px', color: 'var(--accent)', fontFamily: 'var(--mono)', fontWeight: 600, letterSpacing: '0.05em' }}>
                    {generationStatus === 'success' ? pd.generated_3d_ulpin : "NOT GENERATED"}
                  </span>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer' }} title="Copy">
                     <FileText size={16} />
                  </button>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-4)' }}>Proposed 3D ULPIN Extension · NOT AN OFFICIAL GoI FORMAT</div>
              </div>

              {/* SECTION 3: PROPERTY IDENTITY */}
              <section>
                <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Property Identity</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                  {[
                    ['Parent ULPIN', pd.parent_ulpin, true],
                    ['Vertical Layer', `${pd.vertical_layer_label} (${pd.vertical_layer})`],
                    ['Floor / Level', pd.floor_label],
                    ['Unit ID', pd.unit_id, true],
                    ['Property Type', pd.property_type]
                  ].map(([label, val, mono], i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', background: '#05080f', padding: '10px 12px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>{label}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-1)', fontFamily: mono ? 'var(--mono)' : 'inherit' }}>{val}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 4: SPATIAL DIMENSIONS */}
              <section>
                <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Spatial Dimensions</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                  {[
                    ['Area', `${pd.dimensions.area_sqft} sq.ft (${pd.dimensions.area_sqm} m²)`],
                    ['Volume', `${pd.dimensions.volume_m3} m³`],
                    ['Height', `${pd.dimensions.height_m} m`],
                    ['Length x Width', `${pd.dimensions.length_m}m × ${pd.dimensions.width_m}m`],
                    ['Z-Range', `${pd.dimensions.z_min}m — ${pd.dimensions.z_max}m`],
                  ].map(([label, val], i) => (
                    <div key={i} style={{ background: '#05080f', padding: '10px 12px', gridColumn: label === 'Z-Range' ? '1 / -1' : 'auto' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>{label}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-1)', fontFamily: 'var(--mono)' }}>{val}</div>
                    </div>
                  ))}
                  <div style={{ background: '#05080f', padding: '10px 12px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>X Coordinate</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-1)', fontFamily: 'var(--mono)' }}>{pd.coordinates.x}</div>
                  </div>
                  <div style={{ background: '#05080f', padding: '10px 12px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Y Coordinate</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-1)', fontFamily: 'var(--mono)' }}>{pd.coordinates.y}</div>
                  </div>
                  <div style={{ background: '#05080f', padding: '10px 12px', gridColumn: '1 / -1', textAlign: 'right' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-4)' }}>CRS: {pd.coordinates.crs}</div>
                  </div>
                </div>
              </section>

              {/* SECTION 5: OWNERSHIP */}
              <section>
                <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Ownership</div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontSize: '14px', color: 'var(--text-1)', fontWeight: 600, marginBottom: '4px' }}>{pd.ownership.owner_name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '12px' }}>{pd.ownership.ownership_type}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>Registered On</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-1)' }}>{pd.ownership.registered_on}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>Encumbrances</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-1)' }}>{pd.ownership.encumbrances}</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 6: VALIDATION & PROVENANCE */}
              <section>
                <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Validation & Provenance</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>Geometry Status</span>
                    <span style={{ fontSize: '11px', color: pd.validation.geometry_valid ? 'var(--success)' : 'var(--danger)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {pd.validation.geometry_valid ? <><CheckCircle2 size={12}/> Valid (Watertight)</> : 'Invalid'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>Topology Check</span>
                    <span style={{ fontSize: '11px', color: pd.validation.topology_valid ? 'var(--success)' : 'var(--danger)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {pd.validation.topology_valid ? <><CheckCircle2 size={12}/> No Overlaps</> : 'Overlaps Detected'}
                    </span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '11px', color: 'var(--text-3)' }}>Confidence Score</span><span style={{ fontSize: '11px', color: 'var(--text-1)' }}>{pd.validation.confidence_score}%</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '11px', color: 'var(--text-3)' }}>Data Source</span><span style={{ fontSize: '11px', color: 'var(--text-1)' }}>{pd.validation.data_source}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '11px', color: 'var(--text-3)' }}>Derivation</span><span style={{ fontSize: '11px', color: 'var(--text-1)' }}>{pd.validation.derivation}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '11px', color: 'var(--text-3)' }}>Verification</span><span style={{ fontSize: '11px', color: 'var(--warning)' }}>{pd.validation.verification_status}</span></div>
                  </div>
                </div>
              </section>

            </div>

            {/* SECTION 7: ACTION BUTTONS (Sticky Footer) */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(5, 8, 15, 0.95)', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
              {generationStatus === 'idle' ? (
                <button 
                  onClick={handleGenerateClick}
                  style={{ width: '100%', background: 'var(--accent)', color: 'var(--bg-0)', padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <RefreshCw size={16} /> Generate 3D ULPIN
                </button>
              ) : generationStatus === 'generating' ? (
                <button 
                  disabled
                  style={{ width: '100%', background: 'var(--accent)', color: 'var(--bg-0)', padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: 0.8 }}
                >
                  <RefreshCw className="spin" size={16} /> Generating...
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button 
                    onClick={onOpenFullRecord}
                    style={{ width: '100%', background: 'rgba(34,211,238,0.15)', color: 'var(--accent)', padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, border: '1px solid rgba(34,211,238,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <FileText size={16} /> View Full Report
                  </button>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'var(--text-2)', padding: '10px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>📋 Copy ULPIN</button>
                    <button style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'var(--text-2)', padding: '10px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>🔗 Share Link</button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

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
              {viewMode === '2D' ? '2D CADASTRAL MAP (PROTOTYPE)' : '3D PROPERTY MODEL'}
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
            fontSize: '11px', color: 'var(--text-3)', pointerEvents: 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px'
          }}>
            {viewMode === '2D' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                <span style={{ fontSize: '9px', fontWeight: 600 }}>0</span>
                <div style={{ width: '40px', height: '4px', background: 'var(--text-3)', borderLeft: '1px solid var(--bg-0)', borderRight: '1px solid var(--bg-0)' }}></div>
                <span style={{ fontSize: '9px', fontWeight: 600 }}>10m</span>
                <div style={{ width: '40px', height: '4px', background: 'var(--text-4)', borderRight: '1px solid var(--bg-0)' }}></div>
                <span style={{ fontSize: '9px', fontWeight: 600 }}>20m</span>
              </div>
            )}
            <div>Drag orbit · Scroll zoom · Right-drag pan</div>
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
          <FloatingPropertyPanel 
            selectedUnit={selectedUnit} 
            onClose={() => setSelectedUnit(null)} 
            onOpenFullRecord={() => setShowPropertyCard(true)} 
          />
        </div>
      </div>

      {showAIModal && <AIModal onClose={() => setShowAIModal(false)} onComplete={handleAIComplete} />}
      {showPropertyCard && <PropertyCardModal unitId={selectedUnit} onClose={() => setShowPropertyCard(false)} />}
    </div>
  );
}
