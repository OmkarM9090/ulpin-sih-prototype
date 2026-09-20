import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useToast } from './Toast';

export default function BottomActionBar({ demoAction }) {
  const addToast = useToast();
  
  const [isValidating, setIsValidating] = useState(false);
  const [hasConflict, setHasConflict] = useState(false);
  const [lastRun, setLastRun] = useState(new Date().toLocaleTimeString('en-US', { hour12: false }));

  const chips = [
    { id: 'overlapping', label: 'No overlapping property volumes' },
    { id: 'connected', label: 'Floor volumes connected' },
    { id: 'zrange', label: 'Valid Z ranges' },
    { id: 'alignment', label: 'Parcel / building alignment' },
    { id: 'underground', label: 'Underground asset mapped' },
    { id: 'unique', label: 'Unique 3D ULPIN' }
  ];

  const handleSimulateConflict = () => {
    setHasConflict(true);
    addToast('Conflict simulated: overlapping geometries detected in UNIT-L2.', 'error');
  };

  const handleRunValidation = () => {
    setIsValidating(true);
    addToast('Running spatial validation checks...', 'info');
    
    setTimeout(() => {
      setHasConflict(false);
      setLastRun(new Date().toLocaleTimeString('en-US', { hour12: false }));
      setIsValidating(false);
      addToast('Validation complete: 0 conflicts found.', 'success');
    }, 1200);
  };

  useEffect(() => {
    if (demoAction === 'VALIDATION') {
      handleRunValidation();
    }
  }, [demoAction]);

  return (
    <div style={{
      height: '48px',
      background: 'var(--bg-2)',
      borderTop: '1px solid var(--border-1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      position: 'relative',
      zIndex: 100
    }}>
      {/* Left cluster: Action buttons */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={handleRunValidation}
          disabled={isValidating}
          style={{
            background: 'var(--accent-2)',
            color: 'var(--bg-0)',
            padding: '0 16px',
            height: '32px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: isValidating ? 'not-allowed' : 'pointer',
            opacity: isValidating ? 0.7 : 1
          }}
        >
          {isValidating ? <Loader2 size={14} className="spin" /> : <Shield size={14} />}
          Run Spatial Validation
        </button>

        <button
          onClick={handleSimulateConflict}
          disabled={isValidating}
          style={{
            background: 'transparent',
            border: '1px solid var(--danger)',
            color: 'var(--danger)',
            padding: '0 16px',
            height: '32px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: isValidating ? 'not-allowed' : 'pointer',
            opacity: isValidating ? 0.5 : 1
          }}
        >
          <AlertTriangle size={14} />
          Simulate Conflict
        </button>
      </div>

      {/* Center: Status chips */}
      <div style={{ display: 'flex', gap: '8px', flex: 1, justifyContent: 'center' }}>
        {chips.map(chip => {
          const isError = hasConflict && chip.id === 'overlapping';
          return (
            <div key={chip.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: isError ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-1)',
              border: isError ? '1px solid var(--danger)' : '1px solid var(--border-1)',
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '11px',
              color: isError ? 'var(--danger)' : 'var(--text-2)'
            }}>
              {isValidating ? (
                <Loader2 size={12} color="var(--accent)" className="spin" />
              ) : isError ? (
                <XCircle size={12} color="var(--danger)" />
              ) : (
                <CheckCircle2 size={12} color="var(--success)" />
              )}
              {chip.label}
            </div>
          );
        })}
      </div>

      {/* Right: Status text */}
      <div style={{
        fontFamily: 'var(--mono)',
        fontSize: '11px',
        color: hasConflict ? 'var(--danger)' : 'var(--success)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ color: 'var(--text-3)' }}>Status:</span>
        {isValidating ? (
          <span style={{ color: 'var(--accent)' }}>VALIDATING...</span>
        ) : hasConflict ? (
          'SIMULATED CONFLICT DETECTED'
        ) : (
          'ALL SPATIAL CHECKS PASSED'
        )}
        <span style={{ color: 'var(--text-3)', margin: '0 4px' }}>·</span>
        <span style={{ color: 'var(--text-3)' }}>Last run: {lastRun}</span>
      </div>
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
