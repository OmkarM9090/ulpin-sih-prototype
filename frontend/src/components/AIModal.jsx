import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Network, SplitSquareHorizontal, ArrowUpFromLine, Link2, CheckCircle2, Loader2, Circle } from 'lucide-react';

export default function AIModal({ onClose, onComplete }) {
  const [step, setStep] = useState(0);

  const steps = [
    { id: 1, label: 'Point Cloud Alignment', icon: Network },
    { id: 2, label: 'Floor Plan Segmentation', icon: SplitSquareHorizontal },
    { id: 3, label: 'Vertical Extrusion', icon: ArrowUpFromLine },
    { id: 4, label: 'ULPIN Generation', icon: Link2 },
  ];

  useEffect(() => {
    let timeout;
    
    // Simulate process sequence
    if (step === 0) {
      timeout = setTimeout(() => setStep(1), 400); // Start
    } else if (step === 1) {
      timeout = setTimeout(() => setStep(2), 800); // Step 1 done
    } else if (step === 2) {
      timeout = setTimeout(() => setStep(3), 900); // Step 2 done
    } else if (step === 3) {
      timeout = setTimeout(() => setStep(4), 700); // Step 3 done
    } else if (step === 4) {
      timeout = setTimeout(() => setStep(5), 600); // Step 4 done
    } else if (step === 5) {
      timeout = setTimeout(() => {
        onComplete();
        onClose();
      }, 500); // Finish and close
    }

    return () => clearTimeout(timeout);
  }, [step, onClose, onComplete]);

  return (
    <Modal onClose={onClose}>
      <div style={{
        background: 'var(--bg-2)', width: '420px', borderRadius: '12px',
        border: '1px solid var(--accent)', boxShadow: '0 0 30px rgba(34, 211, 238, 0.2)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid var(--border-1)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(34, 211, 238, 0.05)'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-1)' }}>AI Geometry Extraction</h2>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {steps.map((s) => {
            const isCompleted = step > s.id;
            const isCurrent = step === s.id;
            const isPending = step < s.id;

            return (
              <div key={s.id} style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                opacity: isPending ? 0.4 : 1, transition: 'opacity 0.3s'
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: isCompleted ? 'rgba(34, 197, 94, 0.1)' : (isCurrent ? 'rgba(34, 211, 238, 0.1)' : 'var(--bg-1)'),
                  color: isCompleted ? 'var(--success)' : (isCurrent ? 'var(--accent)' : 'var(--text-3)'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <s.icon size={16} />
                </div>
                
                <div style={{ flex: 1, fontSize: '14px', fontWeight: 500, color: isCurrent ? 'var(--text-1)' : 'var(--text-2)' }}>
                  {s.label}
                </div>

                <div>
                  {isCompleted && <CheckCircle2 size={18} color="var(--success)" />}
                  {isCurrent && <Loader2 size={18} color="var(--accent)" className="spin" />}
                  {isPending && <Circle size={18} color="var(--text-4)" />}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Footer/Progress */}
        <div style={{ padding: '16px 24px', background: 'var(--bg-1)', borderTop: '1px solid var(--border-1)', display: 'flex', alignItems: 'center', gap: '12px' }}>
           <div style={{ flex: 1, height: '4px', background: 'var(--border-2)', borderRadius: '2px', overflow: 'hidden' }}>
             <div style={{
               height: '100%', background: 'var(--accent)', transition: 'width 0.4s',
               width: `${Math.min((step / 4) * 100, 100)}%`
             }}></div>
           </div>
           <div style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>
             {Math.round(Math.min((step / 4) * 100, 100))}%
           </div>
        </div>
        
        <style>{`
          .spin { animation: spin 1s linear infinite; }
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    </Modal>
  );
}
