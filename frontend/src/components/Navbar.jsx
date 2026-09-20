import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutGrid, Map, Layers, Building2, Boxes, ShieldCheck, FileText, Search, Radio, Bell, User } from 'lucide-react';
import logoUrl from '../assets/logo.svg';

export default function Navbar({ onShowInfo, onShowDemo }) {
  const navLinks = [
    { to: '/overview', icon: LayoutGrid, label: 'Overview' },
    { to: '/map', icon: Map, label: '3D Property Map' },
    { to: '/parcels', icon: Layers, label: 'Parcels' },
    { to: '/buildings', icon: Building2, label: 'Buildings' },
    { to: '/units', icon: Boxes, label: 'Vertical Units' },
    { to: '/validation', icon: ShieldCheck, label: 'Validation' },
    { to: '/reports', icon: FileText, label: 'Reports' },
  ];

  return (
    <header style={{
      height: '60px',
      background: 'var(--bg-2)',
      borderBottom: '1px solid var(--border-1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Left: Logo & Brand */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
        <div style={{
          width: '32px', height: '32px', background: 'var(--bg-3)',
          borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          <img src={logoUrl} alt="BHU-3D Logo" style={{ width: '20px', height: '20px' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            BHU-3D
          </span>
          <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            3D ULPIN & VERTICAL PROPERTY MAPPING
          </span>
        </div>
      </Link>

      {/* Center: Nav Links */}
      <nav style={{ display: 'flex', gap: '8px', height: '100%' }}>
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '0 12px', height: '100%',
              color: isActive ? 'var(--accent)' : 'var(--text-2)',
              textDecoration: 'none', fontSize: '13px', fontWeight: 500,
              position: 'relative', transition: 'color var(--transition)'
            })}
          >
            {({ isActive }) => (
              <>
                <link.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                <span>{link.label}</span>
                {isActive && (
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: '2px', background: 'var(--accent)',
                    borderTopLeftRadius: '2px', borderTopRightRadius: '2px',
                    boxShadow: '0 -2px 8px rgba(34, 211, 238, 0.5)'
                  }} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Right: Search, Demo, Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          position: 'relative', width: '400px', display: 'flex', alignItems: 'center'
        }}>
          <Search size={16} color="var(--text-3)" style={{ position: 'absolute', left: '12px' }} />
          <input
            type="text"
            placeholder="Search ULPIN, parcel, building, unit…"
            style={{
              width: '100%', background: 'var(--bg-1)', border: '1px solid var(--border-2)',
              borderRadius: '6px', padding: '8px 12px 8px 36px', color: 'var(--text-1)',
              fontSize: '13px', outline: 'none', transition: 'border-color var(--transition)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-2)'}
          />
        </div>

        <button
          onClick={onShowDemo}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            border: '1px solid var(--warning)', color: 'var(--warning)',
            background: 'rgba(245, 158, 11, 0.1)', padding: '6px 12px',
            borderRadius: '16px', fontSize: '11px', fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.05em'
          }}
        >
          <Radio size={14} />
          DEMO MODE
        </button>

        <button style={{ position: 'relative', color: 'var(--text-2)' }}>
          <Bell size={18} />
          <div style={{
            position: 'absolute', top: '1px', right: '2px', width: '6px', height: '6px',
            background: 'var(--danger)', borderRadius: '50%', border: '1px solid var(--bg-2)'
          }} />
        </button>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          paddingLeft: '16px', borderLeft: '1px solid var(--border-2)'
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'var(--bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent)'
          }}>
            <User size={16} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-1)' }}>Survey Admin</span>
            <span style={{ fontSize: '10px', color: 'var(--text-3)' }}>Lucknow Circle</span>
          </div>
        </div>
      </div>
    </header>
  );
}
