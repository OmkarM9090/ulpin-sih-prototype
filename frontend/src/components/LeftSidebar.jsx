import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, Map, Layers, Building2, Boxes, ShieldCheck, FileText } from 'lucide-react';

export default function LeftSidebar() {
  const navItems = [
    { to: '/overview', icon: LayoutGrid, label: 'Overview' },
    { to: '/map', icon: Map, label: '3D Property Map' },
    { to: '/parcels', icon: Layers, label: 'Parcels' },
    { to: '/buildings', icon: Building2, label: 'Buildings' },
    { to: '/units', icon: Boxes, label: 'Vertical Units' },
    { to: '/validation', icon: ShieldCheck, label: 'Validation' },
    { to: '/reports', icon: FileText, label: 'Reports' },
  ];

  return (
    <aside style={{
      width: '240px',
      background: 'var(--bg-2)',
      borderRight: '1px solid var(--border-1)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{
          fontSize: '10px',
          fontWeight: 600,
          color: 'var(--text-3)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '12px',
          paddingLeft: '12px'
        }}>
          WORKSPACE
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: 500,
                color: isActive ? 'var(--accent)' : 'var(--text-2)',
                background: isActive ? 'rgba(34, 211, 238, 0.08)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                transition: 'all var(--transition)'
              })}
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div style={{
        padding: '16px',
        borderTop: '1px solid var(--border-1)',
        fontFamily: 'var(--mono)',
        fontSize: '11px',
        color: 'var(--text-3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Survey Circle</span>
          <span style={{ color: 'var(--text-1)' }}>PUN-06</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>CRS</span>
          <span style={{ color: 'var(--text-1)' }}>Local Demo Space</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Engine</span>
          <span style={{ color: 'var(--text-1)' }}>3D-ULPIN v0.9</span>
        </div>
      </div>
    </aside>
  );
}
