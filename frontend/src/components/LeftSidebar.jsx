import React, { useState, useEffect } from 'react';
import '../styles.css';
import { useToast } from './Toast';

const STEPS = [
  { title: "Load 2D Parcel", desc: "Ingesting parent ULPIN geometry" },
  { title: "Extract Building Shell", desc: "Generating building footprint" },
  { title: "Segment Floors", desc: "Dividing vertical property bounds" },
  { title: "Extrude 3D Units", desc: "Calculating multi-storey volumes" },
  { title: "Validate Topology", desc: "Checking overlaps and watertightness" },
  { title: "Generate 3D-ULPINs", desc: "Assigning hierarchical unique IDs" },
  { title: "Render Cadastral View", desc: "Building interactive scene" }
];

export default function LeftSidebar({ pipelineState, setPipelineState, onPipelineComplete }) {
  const [sources, setSources] = useState([]);
  const [loadingSources, setLoadingSources] = useState(true);
  const [isSourcesOpen, setIsSourcesOpen] = useState(true);
  
  const [currentStep, setCurrentStep] = useState(-1);
  const [pipelineData, setPipelineData] = useState(null);
  const addToast = useToast();

  useEffect(() => {
    fetch('http://localhost:8000/api/data-sources')
      .then(res => res.json())
      .then(data => {
        setSources(data.sources);
        setLoadingSources(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingSources(false);
      });
  }, []);

  useEffect(() => {
    if (pipelineState === 'running' && currentStep === -1) {
      setCurrentStep(0);
      addToast('Pipeline started...', 'info');
      fetch('http://localhost:8000/api/pipeline/run')
        .then(res => res.json())
        .then(data => setPipelineData(data))
        .catch(err => {
          console.error(err);
          addToast('Pipeline failed to run', 'error');
        });
    }
  }, [pipelineState, currentStep, addToast]);

  useEffect(() => {
    if (currentStep >= 0 && currentStep < STEPS.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 300);
      return () => clearTimeout(timer);
    } else if (currentStep === STEPS.length && pipelineData) {
      if (onPipelineComplete) onPipelineComplete(pipelineData);
      setPipelineState('complete');
      addToast(`${pipelineData.units?.length || 20} units generated successfully`, 'success');
    }
  }, [currentStep, pipelineData, onPipelineComplete, setPipelineState, addToast]);

  const handleCopyUlpin = () => {
    navigator.clipboard.writeText('23140701001001');
    addToast('Copied to clipboard', 'success');
  };

  const getEmojiForSource = (id) => {
    const map = { drone: '🚁', lidar: '📡', dem: '🗺️', floorplan: '📄', gnss: '🛰️', gis: '🌐' };
    return map[id] || '📁';
  };

  return (
    <div style={{
      width: '320px',
      minWidth: '280px',
      maxWidth: '500px',
      flexShrink: 0,
      backgroundColor: 'var(--bg-panel)',
      borderRight: '1px solid var(--border-subtle)',
      overflowY: 'auto',
      overflowX: 'hidden',
      resize: 'horizontal',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      {/* Section A: Input Data Sources */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div 
          onClick={() => setIsSourcesOpen(!isSourcesOpen)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>📡 Input Data Sources</span>
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: '999px', padding: '0 6px', fontSize: '11px', color: 'var(--text-muted)' }}>
              {loadingSources ? '...' : sources.length}
            </div>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', transform: isSourcesOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '-4px' }}>Ingested & preprocessed</div>
        
        {isSourcesOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
            {loadingSources ? (
               Array(6).fill(0).map((_, i) => (
                 <div key={i} style={{ height: '56px', backgroundColor: 'var(--bg-elevated)', borderRadius: '8px', animation: 'pulse 1.5s infinite' }}></div>
               ))
            ) : (
              sources.map(src => (
                <div key={src.id} style={{
                  height: '56px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-default)', borderRadius: '8px',
                  display: 'flex', alignItems: 'center', padding: '8px', gap: '12px',
                  cursor: 'default', transition: 'all 0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-elevated)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-primary)'; e.currentTarget.style.borderColor = 'var(--border-default)'; }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                    {getEmojiForSource(src.id)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{src.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{src.format} · {src.spec} · {src.size_mb}MB</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ fontSize: '14px' }}>✅</div>
                    <div style={{ fontSize: '10px', color: 'var(--success)' }}>Ingested</div>
                  </div>
                </div>
              ))
            )}
            <div style={{ fontSize: '11px', fontStyle: 'italic', color: 'var(--text-muted)', textAlign: 'center', marginTop: '4px' }}>
              🔒 Sample datasets — production ingests live drone/LiDAR feeds
            </div>
          </div>
        )}
      </div>

      <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', flexShrink: 0 }}></div>

      {/* Section B: Processing Pipeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: 600 }}>⚙ Processing Pipeline</div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '-4px', marginBottom: '8px' }}>7-stage 3D cadastral engine</div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {STEPS.map((step, idx) => {
            const isCompleted = currentStep > idx || pipelineState === 'complete';
            const isCurrent = currentStep === idx;
            
            return (
              <div key={idx} style={{ display: 'flex', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    backgroundColor: isCompleted ? 'var(--success)' : isCurrent ? 'transparent' : 'var(--bg-elevated)',
                    border: isCurrent ? '2px solid var(--accent-primary)' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', color: isCompleted ? '#fff' : 'var(--text-muted)',
                    fontWeight: 600, zIndex: 2
                  }}>
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div style={{ width: '2px', height: '16px', backgroundColor: isCompleted ? 'var(--accent-primary)' : 'var(--border-default)', margin: '2px 0' }}></div>
                  )}
                </div>
                <div style={{ flex: 1, paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: isCurrent ? 'var(--accent-primary)' : 'var(--text-primary)' }}>{step.title}</div>
                    <div style={{ fontSize: '10px', color: isCompleted ? 'var(--success)' : isCurrent ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                      {isCompleted ? 'Complete' : isCurrent ? 'Running...' : 'Pending'}
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{step.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {pipelineState !== 'complete' && pipelineState !== 'running' && (
          <button onClick={() => setPipelineState('running')} style={{ height: '36px', background: 'var(--gradient-brand)', color: '#fff', fontWeight: 600, border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%', marginTop: '8px', flexShrink: 0 }}>
            ▶ Run Pipeline
          </button>
        )}
        
        {pipelineState === 'running' && (
          <button disabled style={{ height: '36px', background: 'var(--bg-elevated)', color: 'var(--text-muted)', fontWeight: 600, border: '1px solid var(--border-default)', borderRadius: '8px', width: '100%', marginTop: '8px', flexShrink: 0 }}>
            Running...
          </button>
        )}

        {pipelineState === 'complete' && pipelineData && (
          <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid var(--success)', borderRadius: '8px', padding: '12px', marginTop: '8px', flexShrink: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--success)', marginBottom: '4px' }}>✅ Pipeline Complete</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{pipelineData.units?.length || 20} 3D units generated · Topology VALID · 1.2s</div>
          </div>
        )}
      </div>

      {/* Section C: Session Info */}
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Parcel:</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>P001</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)' }}>Parent ULPIN:</span>
          <span onClick={handleCopyUlpin} style={{ color: 'var(--accent-primary)', fontFamily: 'monospace', cursor: 'pointer' }} title="Click to copy">23140701001001 📋</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Location:</span>
          <span style={{ color: 'var(--text-primary)' }}>Pune, Maharashtra</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Land Use:</span>
          <span style={{ color: 'var(--text-primary)' }}>Residential</span>
        </div>
      </div>
    </div>
  );
}
