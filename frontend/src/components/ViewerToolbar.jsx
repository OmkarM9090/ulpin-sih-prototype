import React, { useState } from 'react';
import { useToast } from './Toast';
import { Camera, RefreshCw, Layers, Maximize, ChevronDown } from 'lucide-react';

export default function ViewerToolbar({ 
  explodeValue, setExplodeValue, 
  showLabels, setShowLabels,
  showGrid, setShowGrid,
  cameraPreset, setCameraPreset,
  onResetCamera,
  visibleLayers, toggleLayer
}) {
  const [layersOpen, setLayersOpen] = useState(false);
  const [presetOpen, setPresetOpen] = useState(false);
  const addToast = useToast();
  
  const handleToggleLayer = (id, label) => {
    toggleLayer(id);
    addToast(`${label} toggled`, 'info');
  };
  
  const PRESETS = [
    { id: 'isometric', label: 'Isometric' },
    { id: 'top', label: 'Top Down' },
    { id: 'front', label: 'Front Elevation' },
    { id: 'underground', label: 'Underground View' },
  ];

  const LAYERS = [
    { id: 'apartments', label: 'Apartments & Shop' },
    { id: 'basements', label: 'Basements (B1, B2)' },
    { id: 'terrace', label: 'Terrace & Water Tank' },
    { id: 'metro', label: 'Metro Tunnel' },
    { id: 'utility', label: 'Utility Lines' },
    { id: 'common', label: 'Common Areas (Garden)' },
    { id: 'boundary', label: 'Parcel Boundary' },
  ];

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const buttonStyle = {
    display: 'flex', gap: '6px', alignItems: 'center', backgroundColor: 'var(--bg-elevated)',
    color: 'var(--text-primary)', border: '1px solid var(--border-default)',
    padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px'
  };

  return (
    <div style={{
      height: '52px',
      backgroundColor: 'var(--bg-panel)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0 16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 20
    }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <button 
            style={buttonStyle}
            onClick={() => setPresetOpen(!presetOpen)}
          >
            <Camera size={14} />
            {PRESETS.find(p => p.id === cameraPreset)?.label || 'Isometric'}
            <ChevronDown size={14} />
          </button>
          {presetOpen && (
            <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '4px', background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '4px', width: '180px', boxShadow: 'var(--shadow-md)', zIndex: 30 }}>
              {PRESETS.map(p => (
                <div key={p.id} onClick={() => { setCameraPreset(p.id); setPresetOpen(false); }} style={{ padding: '8px', fontSize: '13px', cursor: 'pointer', borderRadius: '4px' }} onMouseOver={e=>e.currentTarget.style.background='var(--bg-elevated)'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                  {p.label}
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={onResetCamera} style={buttonStyle}>
          <RefreshCw size={14} /> Reset Camera
        </button>
      </div>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Explode</span>
          <input 
            type="range" 
            min="0" max="100" 
            style={{ width: '160px', accentColor: 'var(--accent-primary)' }}
            value={explodeValue}
            onChange={(e) => setExplodeValue(Number(e.target.value))}
          />
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace', width: '24px', textAlign: 'right' }}>{explodeValue}</span>
        </div>
        
        <div style={{ width: '1px', height: '24px', background: 'var(--border-default)' }}></div>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
          <input type="checkbox" checked={showLabels} onChange={e => setShowLabels(e.target.checked)} style={{ accentColor: 'var(--accent-primary)' }} />
          Labels
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
          <input type="checkbox" checked={showGrid} onChange={e => setShowGrid(e.target.checked)} style={{ accentColor: 'var(--accent-primary)' }} />
          Grid
        </label>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <button 
            style={buttonStyle}
            onClick={() => setLayersOpen(!layersOpen)}
          >
            <Layers size={14} />
            Layers ({Object.values(visibleLayers).filter(Boolean).length})
          </button>
          {layersOpen && (
            <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '4px', background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px', width: '220px', boxShadow: 'var(--shadow-md)', zIndex: 30, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {LAYERS.map(l => (
                <label key={l.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={visibleLayers[l.id]} onChange={() => handleToggleLayer(l.id, l.label)} style={{ accentColor: 'var(--accent-primary)' }} />
                  {l.label}
                </label>
              ))}
            </div>
          )}
        </div>
        
        <button onClick={toggleFullscreen} style={{ ...buttonStyle, padding: '6px', width: '32px', height: '32px', justifyContent: 'center' }} title="Fullscreen">
          <Maximize size={16} />
        </button>
      </div>
    </div>
  );
}
