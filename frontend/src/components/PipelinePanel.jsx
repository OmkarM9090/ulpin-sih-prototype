import { useState, useEffect } from 'react';

const STEPS = [
  { title: "Load 2D Parcel", desc: "Ingesting parent ULPIN geometry" },
  { title: "Extract Building Shell", desc: "Generating building footprint" },
  { title: "Segment Floors", desc: "Dividing vertical property bounds" },
  { title: "Extrude 3D Units", desc: "Calculating multi-storey volumes" },
  { title: "Validate Topology", desc: "Checking overlaps and watertightness" },
  { title: "Generate 3D-ULPINs", desc: "Assigning hierarchical unique IDs" },
  { title: "Render Cadastral View", desc: "Building interactive scene" }
];

export default function PipelinePanel({ state, onComplete }) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [pipelineData, setPipelineData] = useState(null);

  useEffect(() => {
    if (state === 'running' && currentStep === -1) {
      setCurrentStep(0);
      fetch('http://127.0.0.1:8000/api/pipeline/run')
        .then(res => res.json())
        .then(data => setPipelineData(data))
        .catch(err => console.error(err));
    }
  }, [state, currentStep]);

  useEffect(() => {
    if (currentStep >= 0 && currentStep < STEPS.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 400);
      return () => clearTimeout(timer);
    } else if (currentStep === STEPS.length && pipelineData) {
      if (onComplete) onComplete(pipelineData);
    }
  }, [currentStep, pipelineData, onComplete]);

  return (
    <div style={{ padding: '24px', color: '#e2e8f0', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h3 style={{ marginBottom: '24px', color: '#f8fafc', fontSize: '1.1rem', letterSpacing: '0.5px' }}>Processing Pipeline</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
        {STEPS.map((step, idx) => {
          let statusColor = '#475569';
          if (idx < currentStep) statusColor = '#22c55e';
          else if (idx === currentStep) statusColor = '#f59e0b';

          return (
            <div key={idx} style={{ display: 'flex', gap: '16px', opacity: idx > currentStep ? 0.3 : 1, transition: 'opacity 0.3s' }}>
              <div style={{ 
                width: '28px', height: '28px', borderRadius: '50%', 
                backgroundColor: '#334155', color: '#cbd5e1', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.85rem', fontWeight: 'bold', flexShrink: 0
              }}>
                {idx + 1}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: statusColor, transition: 'background-color 0.3s' }} />
                  <div style={{ fontWeight: '600', fontSize: '0.95rem', color: idx === currentStep ? '#38bdf8' : '#f1f5f9' }}>
                    {step.title}
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', paddingLeft: '16px' }}>
                  {step.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {currentStep === STEPS.length && pipelineData && pipelineData.validation && (
        <div style={{ 
          marginTop: 'auto', 
          backgroundColor: 'rgba(34, 197, 94, 0.1)', 
          border: '1px solid rgba(34, 197, 94, 0.4)', 
          borderRadius: '8px', 
          padding: '16px',
          textAlign: 'center',
          animation: 'fadeIn 0.5s ease-in-out'
        }}>
          <div style={{ color: '#22c55e', fontWeight: 'bold', marginBottom: '8px' }}>
            ✅ Topology {pipelineData.validation.status}
          </div>
          <div style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
            {pipelineData.validation.total_units} 3D Units Generated
          </div>
        </div>
      )}
    </div>
  );
}
