import React, { useEffect, useState } from 'react';
import '../styles.css';
import { API_BASE_URL } from '../config';

export default function Footer() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/system-status`)
      .then(res => res.json())
      .then(data => setStatus(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <footer style={{
      height: '36px',
      backgroundColor: 'var(--bg-primary)',
      borderTop: '1px solid var(--border-subtle)',
      fontSize: '11px',
      color: 'var(--text-muted)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      zIndex: 100
    }}>
      <div>© 2026 GeoCadastre · Prototype for SIH 2026 · PS 26011</div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {status ? (
          <>
            <span style={{ color: 'var(--success)' }}>●</span>
            Backend {status.backend === 'online' ? 'Online' : 'Offline'} · {status.units_registered} Units Registered · Topology {status.topology_status} · Last Sync 09:42 IST
          </>
        ) : (
          <span>● Connecting to Backend...</span>
        )}
      </div>

      <div>v1.0.0-demo · FastAPI + React + Three.js · ⌨ R E L ?</div>
    </footer>
  );
}
