import React, { createContext, useState, useContext, useCallback } from 'react';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 999999,
        pointerEvents: 'none'
      }}>
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const ToastItem = ({ toast, onClose }) => {
  const getStyle = (type) => {
    switch(type) {
      case 'success': return { border: 'var(--success)', icon: '✅' };
      case 'warning': return { border: 'var(--warning)', icon: '⚠️' };
      case 'error': return { border: 'var(--danger)', icon: '❌' };
      default: return { border: 'var(--accent-primary)', icon: 'ℹ️' };
    }
  };
  
  const { border, icon } = getStyle(toast.type);

  return (
    <div style={{
      width: '320px',
      backgroundColor: 'var(--bg-elevated)',
      borderLeft: `3px solid ${border}`,
      padding: '12px',
      borderRadius: '8px',
      boxShadow: 'var(--shadow-md)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      pointerEvents: 'auto',
      animation: 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '14px' }}>{icon}</span>
        <span style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.4 }}>{toast.message}</span>
      </div>
      <button 
        onClick={onClose}
        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
      >
        ✕
      </button>
    </div>
  );
};
