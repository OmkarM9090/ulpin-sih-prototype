import React from 'react';
import '../styles.css';

export default function Navbar() {
  return (
    <nav style={{
      height: '60px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-subtle)',
      backdropFilter: 'blur(12px)',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '36px', height: '36px', background: 'var(--gradient-brand)',
          borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', color: '#fff'
        }}>
          🏙️
        </div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>GeoCadastre 3D</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Vertical Property Registry · India</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '4px' }}>
        {['Dashboard', 'Parcels', 'Registry', 'Analytics', 'Reports', 'Docs'].map((item, i) => (
          <div key={item} style={{
            height: '32px', padding: '0 12px', borderRadius: '8px',
            color: i === 0 ? 'var(--accent-primary)' : 'var(--text-secondary)',
            display: 'flex', alignItems: 'center',
            cursor: 'pointer',
            borderBottom: i === 0 ? '2px solid var(--accent-primary)' : 'none',
            fontWeight: i === 0 ? 500 : 400,
            transition: 'background 180ms',
            marginBottom: i === 0 ? '-2px' : '0'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-elevated)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {item}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          background: 'rgba(34,197,94,0.1)', border: '1px solid var(--success)', color: 'var(--success)',
          fontSize: '11px', borderRadius: '999px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px'
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)' }}></div>
          System Online
        </div>
        
        <button style={{
          width: '32px', height: '32px', borderRadius: '8px', background: 'transparent', border: 'none',
          color: 'var(--text-primary)', cursor: 'pointer', position: 'relative'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-elevated)'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          🔔
          <div style={{ position: 'absolute', top: '4px', right: '4px', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--danger)' }}></div>
        </button>

        <button style={{
          width: '32px', height: '32px', borderRadius: '8px', background: 'transparent', border: 'none',
          color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 600
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-elevated)'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          ?
        </button>

        <div style={{ width: '1px', height: '20px', background: 'var(--border-default)' }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gradient-brand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: 600
          }}>
            SIH
          </div>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>▼</span>
        </div>
      </div>
    </nav>
  );
}
