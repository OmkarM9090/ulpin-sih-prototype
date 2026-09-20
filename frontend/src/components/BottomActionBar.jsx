import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from './Toast';

export default function BottomActionBar() {
  const addToast = useToast();
  
  // Local state for UI representation before connecting to real endpoints in later steps
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
            gap: '6px'
          }}
        >
          <Shield size={14} />
          Run Spatial Validation
        </button>

        <button
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
            gap: '6px'
          }}
        >
          <AlertTriangle size={14} />
          Simulate Conflict
        </button>
      </div>

      {/* Center: Status chips */}
      <div style={{ display: 'flex', gap: '8px', flex: 1, justifyContent: 'center' }}>
        {chips.map(chip => (
          <div key={chip.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'var(--bg-1)',
            border: '1px solid var(--border-1)',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '11px',
            color: hasConflict && chip.id === 'overlapping' ? 'var(--danger)' : 'var(--text-2)'
          }}>
            {hasConflict && chip.id === 'overlapping' ? (
              <XCircle size={12} color="var(--danger)" />
            ) : (
              <CheckCircle2 size={12} color="var(--success)" />
            )}
            {chip.label}
          </div>
        ))}
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
        {hasConflict ? 'SIMULATED CONFLICT DETECTED' : 'ALL SPATIAL CHECKS PASSED'}
        <span style={{ color: 'var(--text-3)', margin: '0 4px' }}>·</span>
        <span style={{ color: 'var(--text-3)' }}>Last run: {lastRun}</span>
      </div>
    </div>
  );
}
