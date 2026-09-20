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
    const isUnit = selectedUnit?.startsWith('U0') && !selectedUnit.includes('-R');
    
    if (isUnit) {
      setLoading(true);
      fetch('http://127.0.0.1:8000/api/units')
        .then(res => res.json())
        .then(units => {
          if (!active) return;
          const unit = units.find(u => u.unit_id === selectedUnit);
          if (unit) {
            return fetch(`http://127.0.0.1:8000/api/unit/${unit.ulpin}`)
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
      setToastMessage(`ULPIN ${propertyData?.unit?.ulpin || proposedUlpin} Generated & Registered to Cadastre`);
      setTimeout(() => setToastMessage(null), 4000);
    }, 1500);
  };

  if (!selectedUnit) return null;

  const isRoom = selectedUnit.includes('-R');
  const isUnit = selectedUnit.startsWith('U0') && !isRoom;
  const isFloor = selectedUnit.startsWith('UNIT-L');
  const isParcel = selectedUnit.startsWith('P');
  const isBuilding = selectedUnit.startsWith('BUILDING');
  const isRoad = selectedUnit.startsWith('ROAD');

  // Base Data for REPORT-FIX 3
  let objName = selectedUnit;
  let statusBadge = 'Draft';
  let parentUlpin = '23140701001001';
  let proposedUlpin = 'Not Generated';
  let parcelId = 'P001';
  let unitId = selectedUnit;
  let layer = 'Surface';
  let floor = '0';
  let area = '115.2';
  let zMin = '0.0';
  let zMax = '3.0';
  let verticalExtent = '3.0';
  let volume = '299.5';
  let propType = 'Residential Unit';
  let usage = 'Private Residential';
  let owner = 'Anjali Sharma';
  let ownershipType = 'Freehold';
  
  if (isUnit && propertyData) {
    const { unit, owner: ownerData, provenance } = propertyData;
    objName = `Unit ${unit.unit_id}`;
    statusBadge = 'Verified';
    proposedUlpin = unit.ulpin;
    parentUlpin = provenance?.ulpin_components?.parent_ulpin || parentUlpin;
    unitId = unit.unit_id;
    layer = unit.layer === 'S' ? 'Surface' : unit.layer === 'U' ? 'Underground' : 'Airspace';
    floor = unit.level_label;
    area = unit.area_sqm;
    zMin = unit.z_min.toFixed(1);
    zMax = unit.z_max.toFixed(1);
    verticalExtent = (unit.z_max - unit.z_min).toFixed(1);
    volume = unit.volume_cbm;
    usage = unit.usage;
    
    if (ownerData) {
      owner = ownerData.name;
      ownershipType = `${ownerData.ownership_type} (Share: ${ownerData.share}%)`;
    }
  } else if (isParcel) {
    objName = selectedUnit === 'P001' ? 'TRADITIONAL 2D PARCEL' : `Parcel ${selectedUnit}`;
    statusBadge = selectedUnit === 'P001' ? '3D Modeled' : 'Contextual';
    propType = 'Cadastral Parcel';
    layer = 'Surface';
    area = selectedUnit === 'P001' ? '1200' : 'N/A';
    volume = 'N/A';
    usage = 'Residential / Mixed';
    owner = 'Multiple Owners';
    ownershipType = 'Mixed';
  } else if (isBuilding) {
    objName = 'Building B-239';
    propType = 'Building Footprint';
    layer = 'Surface';
    area = '264.96';
    volume = 'N/A';
  } else if (isRoad) {
    objName = selectedUnit === 'ROAD-MAIN' ? 'Main Access Road' : 'Secondary Road';
    statusBadge = 'Infrastructure';
    propType = 'Public Infrastructure';
    layer = 'Surface';
    owner = 'Municipal Corporation';
    ownershipType = 'Public Right of Way';
    area = 'N/A';
    volume = 'N/A';
  } else if (isFloor) {
    floor = selectedUnit.replace('UNIT-L', '');
    objName = `Floor ${floor}`;
    propType = 'Monolithic Slab';
    area = '496.0';
    volume = '1290.0';
  } else if (isRoom) {
    const [parent, roomPart] = selectedUnit.split('-R');
    objName = roomPart === '01' ? 'Living Room' : roomPart === '02' ? 'Bedroom' : 'Kitchen/Bath';
    propType = 'Sub-unit Room';
    unitId = selectedUnit;
    statusBadge = 'Illustrative';
  }

  const ObjectIcon = isUnit || isFloor ? Box : isBuilding ? Building2 : isParcel ? Map : Route;

  return (
    <div style={{
      position: 'absolute', top: '80px', right: '24px', width: '400px', maxHeight: 'calc(100% - 104px)',
      background: 'rgba(10, 18, 32, 0.9)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px',
      display: 'flex', flexDirection: 'column', boxShadow: '0 24px 48px rgba(0,0,0,0.5)', zIndex: 40,
      animation: 'fade-in 0.2s ease-out', color: 'var(--text-1)'
    }}>
      {/* Toast Notification (Scoped inside Panel container for now) */}
      {toastMessage && (
        <div style={{
          position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(16, 185, 129, 0.95)', backdropFilter: 'blur(10px)',
          padding: '12px 24px', borderRadius: '30px', color: '#fff', fontSize: '13px',
          fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', zIndex: 9999,
          boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)', border: '1px solid rgba(255,255,255,0.2)',
          animation: 'fade-in-up 0.3s ease-out'
        }}>
          <CheckCircle2 size={16} />
          {toastMessage}
        </div>
      )}

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(34, 211, 238, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0); }
        }
      `}</style>

      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '40px', background: 'rgba(34,211,238,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
            <ObjectIcon size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.01em' }}>{objName}</h2>
              <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>{statusBadge}</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 500 }}>Property Information</div>
          </div>
        </div>
        <button 
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-3)', cursor: 'pointer', transition: 'color 0.2s', padding: '4px' }}
          onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
          onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-3)'}
        >
          ✕
        </button>
      </div>

      {/* Scrollable Content */}
      <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', color: 'var(--text-3)', gap: '16px' }}>
            <div className="spin" style={{ width: '24px', height: '24px', border: '2px solid rgba(34, 211, 238, 0.2)', borderTopColor: 'var(--accent)', borderRadius: '50%' }} />
            <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>FETCHING DEMO RECORD...</div>
          </div>
        ) : (
          <>
            {/* PROPERTY IDENTITY */}
            <section>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Property Identity</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                {isUnit && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>3D ULPIN</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-1)', fontFamily: 'var(--mono)' }}>{proposedUlpin}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>{isUnit ? 'Parent ULPIN' : 'Parcel ULPIN'}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-1)', fontFamily: 'var(--mono)' }}>{parentUlpin}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Parcel ID</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-1)', fontFamily: 'var(--mono)' }}>{parcelId}</div>
                  </div>
                  {(isUnit || isRoom) && (
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Unit ID</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-1)', fontFamily: 'var(--mono)' }}>{unitId}</div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* SPATIAL INFORMATION */}
            <section>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Spatial Information</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Layer</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-1)', fontWeight: 500 }}>{layer}</div>
                </div>
                {(!isParcel && !isBuilding && !isRoad) && (
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Floor</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-1)', fontWeight: 500 }}>{floor}</div>
                  </div>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Area</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-1)', fontWeight: 500 }}>{area} {area !== 'N/A' && 'm²'}</div>
                </div>
                {(!isParcel && !isRoad && !isBuilding) && (
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Volume</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-1)', fontWeight: 500 }}>{volume} {volume !== 'N/A' && 'm³'}</div>
                  </div>
                )}
              </div>
              {isUnit && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Z Min</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-2)', fontFamily: 'var(--mono)' }}>{zMin}m</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Z Max</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-2)', fontFamily: 'var(--mono)' }}>{zMax}m</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Extent</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-2)', fontFamily: 'var(--mono)' }}>{verticalExtent}m</div>
                  </div>
                </div>
              )}
            </section>

        {/* PROPERTY / USAGE */}
        <section>
          <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Property & Usage</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>Property Type</span>
              <span style={{ fontSize: '12px', color: 'var(--text-1)' }}>{propType}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>Usage</span>
              <span style={{ fontSize: '12px', color: 'var(--text-1)' }}>{usage}</span>
            </div>
          </div>
        </section>

            {/* OWNERSHIP */}
            <section>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Ownership</div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px' }}>
                <div style={{ fontSize: '14px', color: 'var(--text-1)', fontWeight: 600, marginBottom: '4px' }}>{owner}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '12px' }}>{ownershipType}</div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', background: 'rgba(34,211,238,0.05)', padding: '8px 10px', borderRadius: '4px', border: '1px solid rgba(34,211,238,0.1)' }}>
                  <Info size={14} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '10px', color: 'var(--text-3)', lineHeight: 1.4 }}>Controlled Demo Data. Do not imply legal ownership verification.</div>
                </div>
              </div>
            </section>

            {/* VALIDATION */}
            {isUnit && (
              <section>
                <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Validation</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>Watertight Geometry</span>
                    <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={12} /> PASS</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>Overlap Check</span>
                    <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={12} /> PASS</span>
                  </div>
                </div>
              </section>
            )}

            {/* PROVENANCE */}
            <section>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Provenance</div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '6px', fontSize: '11px', color: 'var(--text-3)', lineHeight: 1.5 }}>
                {isRoom ? (
                  <>
                    <span style={{ color: 'var(--accent)' }}>Illustrative Layout</span><br/>
                    <span style={{ color: 'var(--text-3)' }}>Not a registered 3D sub-unit. Floorplan layout is illustrative.</span>
                  </>
                ) : (
                  <>
                    <span style={{ color: 'var(--text-2)' }}>Source:</span> Controlled Demo Dataset<br/>
                    <span style={{ color: 'var(--text-2)' }}>Derivation:</span> {isUnit && propertyData ? propertyData.provenance.derivation : 'Derived Geometry'}
                  </>
                )}
              </div>
            </section>

            {/* PROPOSED 3D ULPIN EXTENSION */}
            {isUnit && (
              <section style={{ marginTop: '8px' }}>
                <div style={{ background: 'rgba(34,211,238,0.05)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Proposed 3D ULPIN Extension</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-4)', marginBottom: '16px' }}>[NOT AN OFFICIAL GoI FORMAT]</div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>Parent ULPIN</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-1)', fontFamily: 'var(--mono)' }}>{parentUlpin}</span>
                    </div>
                    <div style={{ width: '1px', height: '12px', background: 'rgba(34,211,238,0.3)', margin: '-8px 0 -8px 8px' }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>Vertical Layer</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-1)', fontFamily: 'var(--mono)' }}>{layer === 'Surface' ? 'S' : 'U'}</span>
                    </div>
                    <div style={{ width: '1px', height: '12px', background: 'rgba(34,211,238,0.3)', margin: '-8px 0 -8px 8px' }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>Floor / Level</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-1)', fontFamily: 'var(--mono)' }}>{propertyData?.unit?.level || `L0${floor}`}</span>
                    </div>
                    <div style={{ width: '1px', height: '12px', background: 'rgba(34,211,238,0.3)', margin: '-8px 0 -8px 8px' }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>Unit ID</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-1)', fontFamily: 'var(--mono)' }}>{unitId}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleGenerateClick}
                    disabled={generationStatus !== 'idle'}
                    style={{ 
                      width: '100%', 
                      background: generationStatus === 'success' ? 'rgba(255,255,255,0.05)' : 'var(--accent)', 
                      color: generationStatus === 'success' ? 'var(--text-3)' : 'var(--bg-0)', 
                      padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, border: 'none', 
                      cursor: generationStatus === 'idle' ? 'pointer' : 'default', 
                      transition: 'all 0.2s', 
                      boxShadow: generationStatus === 'idle' ? '0 4px 12px rgba(34, 211, 238, 0.2)' : 'none', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' 
                    }}
                    onMouseOver={(e) => { 
                      if (generationStatus === 'idle') {
                        e.currentTarget.style.transform = 'translateY(-1px)'; 
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(34, 211, 238, 0.3)'; 
                      }
                    }}
                    onMouseOut={(e) => { 
                      if (generationStatus === 'idle') {
                        e.currentTarget.style.transform = 'none'; 
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 211, 238, 0.2)'; 
                      }
                    }}
                  >
                    {generationStatus === 'idle' && <><RefreshCw size={16} /> Generate 3D ULPIN</>}
                    {generationStatus === 'generating' && <><RefreshCw className="spin" size={16} /> Generating...</>}
                    {generationStatus === 'success' && <><CheckCircle2 size={16} /> ULPIN Generated</>}
                  </button>
                  
                  {/* View Full Report button - Only visible after successful generation */}
                  {generationStatus === 'success' && (
                    <button 
                      onClick={onOpenFullRecord}
                      style={{ 
                        marginTop: '12px', width: '100%', background: 'rgba(34,211,238,0.1)', 
                        color: 'var(--accent)', padding: '12px', borderRadius: '8px', 
                        fontSize: '13px', fontWeight: 600, border: '1px solid rgba(34,211,238,0.3)', 
                        cursor: 'pointer', transition: 'all 0.2s', display: 'flex', 
                        alignItems: 'center', justifyContent: 'center', gap: '8px',
                        animation: 'pulse-glow 2s infinite'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = 'rgba(34,211,238,0.2)';
                        e.currentTarget.style.animation = 'none';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'rgba(34,211,238,0.1)';
                        e.currentTarget.style.animation = 'pulse-glow 2s infinite';
                      }}
                    >
                      <FileText size={16} />
                      View Full Report
                    </button>
                  )}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
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
