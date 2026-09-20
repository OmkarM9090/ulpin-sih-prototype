import React, { createContext, useState, useContext, useCallback } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000); // slightly longer reading time
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        zIndex: 999999,
        pointerEvents: 'none',
        alignItems: 'center'
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
      case 'success': return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', Icon: CheckCircle };
      case 'warning': return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', Icon: AlertTriangle };
      case 'error': return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', Icon: XCircle };
      default: return { color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.1)', Icon: Info };
    }
  };
  
  const { color, bg, Icon } = getStyle(toast.type);

  return (
    <div style={{
      minWidth: '320px', maxWidth: '420px',
      background: 'rgba(10, 18, 32, 0.85)',
      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '12px 16px',
      borderRadius: '8px',
      boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      pointerEvents: 'auto',
      animation: 'slideUpFade 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <style>{`
        @keyframes slideUpFade {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '32px', height: '32px', borderRadius: '8px',
          background: bg, color: color
        }}>
          <Icon size={18} strokeWidth={2.5} />
        </div>
        <span style={{ fontSize: '14px', fontWeight: 500, color: '#f8fafc', letterSpacing: '0.01em', lineHeight: 1.4 }}>{toast.message}</span>
      </div>
      <button 
        onClick={onClose}
        style={{ 
          background: 'transparent', border: 'none', color: '#94a3b8', 
          cursor: 'pointer', padding: '4px', marginLeft: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: '4px', transition: 'all 0.2s'
        }}
        onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
        onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
      >
        <X size={16} />
      </button>
    </div>
  );
};
