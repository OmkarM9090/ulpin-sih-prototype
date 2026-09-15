import React, { useState, useEffect } from 'react';

/**
 * Judge Demo Mode
 * Guides the presenter through the EXISTING working flow:
 * Search -> Pipeline -> Explode -> Select Unit -> Underground -> Property Record.
 * Drives real app state via props; auto-advances when the step's condition is met.
 * No fake data, no simulated actions — every step operates the real demo.
 */

const DEMO_SEARCH_QUERY = 'pune';

export default function JudgeDemo({
  pipelineState,
  selectedUnit,
  explodeValue,
  cameraPreset,
  setQueryInSearch,
  onExit
}) {
  const [stepIdx, setStepIdx] = useState(0);

  const STEPS = [
    {
      id: 'search',
      title: '1 · Search Property',
      action: 'Type "pune" in Search Property and click Search',
      narration: 'Every demo record starts from a searchable parcel query — the primary entry point.',
      done: () => true, // completes when presenter clicks Next (input is in LeftSidebar)
      onEnter: () => setQueryInSearch(DEMO_SEARCH_QUERY)
    },
    {
      id: 'parcel',
      title: '2 · Parcel Found',
      action: 'Click the demo result card P001 (Controlled Demo Data)',
      narration: 'Selecting a parcel anchors the whole 3D scene to its parent ULPIN.',
      done: (s) => s.pipelineState === 'running' || s.pipelineState === 'complete',
      onEnter: null // user clicks the result card in the sidebar
    },
    {
      id: 'pipeline',
      title: '3 · Run Pipeline',
      action: 'Watch the 7-stage pipeline generate and validate 3D units',
      narration: 'Geometry generation, then prototype topology validation, then proposed 3D ULPIN assignment.',
      done: (s) => s.pipelineState === 'complete',
      onEnter: null
    },
    {
      id: 'explode',
      title: '4 · Explode Floors',
      action: 'Drag the Explode slider to about 60',
      narration: 'Vertical separation makes each storey a distinct volumetric unit.',
      done: (s) => s.explodeValue >= 40,
      onEnter: null
    },
    {
      id: 'select',
      title: '5 · Select a Unit',
      action: 'Click any 3D unit (e.g., a First Floor apartment)',
      narration: 'Selection reveals ULPIN hierarchy, Z range, validation and provenance in the side panel.',
      done: (s) => !!s.selectedUnit,
      onEnter: null
    },
    {
      id: 'underground',
      title: '6 · Go Underground',
      action: 'Open camera preset → Underground View',
      narration: 'The same parcel holds metro tunnel and utility easements below ground — invisible to 2D records.',
      done: (s) => s.cameraPreset === 'underground',
      onEnter: null
    },
    {
      id: 'record',
      title: '7 · Open Property Record',
      action: 'Click "View Property Card" in the right panel',
      narration: 'The 3D Property Record (Prototype) shows computed validation, pending human verification, and honest provenance.',
      done: () => false, // terminal step; presenter closes the record manually
      onEnter: null
    }
  ];

  const step = STEPS[stepIdx];

  // Snapshot of app state used for done() evaluation
  const stateSnapshot = { pipelineState, selectedUnit, explodeValue, cameraPreset };

  // Auto-advance when the step's real condition is satisfied
  useEffect(() => {
    if (step.done && step.done(stateSnapshot)) {
      const t = setTimeout(() => setStepIdx(i => Math.min(i + 1, STEPS.length - 1)), 600);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pipelineState, selectedUnit, explodeValue, cameraPreset, stepIdx]);

  // Run the step's entry action (drives real state, no simulation)
  useEffect(() => {
    if (step.onEnter) step.onEnter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIdx]);

  const next = () => setStepIdx(i => Math.min(i + 1, STEPS.length - 1));
  const prev = () => setStepIdx(i => Math.max(i - 1, 0));

  return (
    <div style={{
      position: 'fixed', bottom: '52px', left: '50%', transform: 'translateX(-50%)',
      zIndex: 5000, width: '520px', maxWidth: '92vw',
      background: 'rgba(15,23,42,0.96)', backdropFilter: 'blur(10px)',
      border: '1px solid var(--accent-primary)', borderRadius: '12px',
      boxShadow: '0 12px 32px rgba(0,0,0,0.5)', color: 'var(--text-primary)',
      padding: '14px 16px'
    }}>
      {/* Progress dots */}
      <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
        {STEPS.map((s, i) => (
          <div key={s.id} style={{
            flex: 1, height: '4px', borderRadius: '2px',
            background: i < stepIdx ? 'var(--success)' : i === stepIdx ? 'var(--accent-primary)' : 'var(--border-default)'
          }} />
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          🎬 Judge Demo · {step.title}
        </span>
        <button onClick={onExit} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '14px' }} title="Exit demo mode">✕</button>
      </div>

      <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500, marginBottom: '2px' }}>{step.action}</div>
      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '10px' }}>{step.narration}</div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button onClick={prev} disabled={stepIdx === 0} style={{
          height: '28px', padding: '0 12px', borderRadius: '6px', fontSize: '12px', cursor: stepIdx === 0 ? 'default' : 'pointer',
          background: 'var(--bg-elevated)', color: stepIdx === 0 ? 'var(--text-muted)' : 'var(--text-primary)', border: '1px solid var(--border-default)'
        }}>← Back</button>
        <button onClick={next} disabled={stepIdx === STEPS.length - 1} style={{
          height: '28px', padding: '0 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: stepIdx === STEPS.length - 1 ? 'default' : 'pointer',
          background: 'var(--gradient-brand)', color: '#fff', border: 'none'
        }}>Next →</button>
        <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
          Controlled Demo Data · steps drive the real flow
        </span>
      </div>
    </div>
  );
}
