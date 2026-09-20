import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutGrid, Map, Layers, Building2, Boxes, ShieldCheck, FileText, Search, Radio, Bell, User, Clock, ChevronRight } from 'lucide-react';
import logoUrl from '../assets/logo.svg';
import { useToast } from './Toast';

export default function Navbar({ onShowInfo, onShowDemo }) {
  const addToast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const navLinks = [
    { to: '/overview', icon: LayoutGrid, label: 'Overview' },
    { to: '/map', icon: Map, label: '3D Property Map' },
    { to: '/parcels', icon: Layers, label: 'Parcels' },
    { to: '/buildings', icon: Building2, label: 'Buildings' },
    { to: '/units', icon: Boxes, label: 'Vertical Units' },
    { to: '/validation', icon: ShieldCheck, label: 'Validation' },
    { to: '/reports', icon: FileText, label: 'Reports' },
  ];

  const handleSearchSelect = (result) => {
    addToast(`Navigating to ${result}`, 'success');
    setIsSearchFocused(false);
    setSearchQuery('');
  };

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
        
        {/* Global Search */}
        <div style={{ position: 'relative', width: '400px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={16} color={isSearchFocused ? 'var(--accent)' : 'var(--text-3)'} style={{ position: 'absolute', left: '12px', transition: 'color var(--transition)' }} />
            <input
              type="text"
              placeholder="Search ULPIN, parcel, building, unit…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              style={{
                width: '100%', background: 'var(--bg-1)', border: isSearchFocused ? '1px solid var(--accent)' : '1px solid var(--border-2)',
                borderRadius: '6px', padding: '8px 12px 8px 36px', color: 'var(--text-1)',
                fontSize: '13px', outline: 'none', transition: 'border-color var(--transition)',
                boxShadow: isSearchFocused ? '0 0 0 3px rgba(34, 211, 238, 0.1)' : 'none'
              }}
            />
          </div>

          {/* Search Dropdown */}
          {isSearchFocused && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px',
              background: 'var(--bg-2)', border: '1px solid var(--border-1)',
              borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              overflow: 'hidden', zIndex: 110, display: 'flex', flexDirection: 'column'
            }}>
              {!searchQuery ? (
                <>
                  <div style={{ padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border-2)' }}>
                    Recent Searches
                  </div>
                  {['UP-LKO-P123456 (Parcel)', '09-12345-0012-L03-R (Unit)', 'Lucknow Metro B1'].map(recent => (
                    <div 
                      key={recent}
                      onClick={() => handleSearchSelect(recent)}
                      style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-2)', cursor: 'pointer', borderBottom: '1px solid var(--border-2)' }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-3)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <Clock size={14} color="var(--text-4)" />
                      {recent}
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div style={{ padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border-2)' }}>
                    Mock Results for "{searchQuery}"
                  </div>
                  {[
                    `UP-LKO-${searchQuery.toUpperCase()}-001`,
                    `3D-ULPIN: 09-${searchQuery}-12345`,
                    `${searchQuery} Commercial Complex`
                  ].map(result => (
                    <div 
                      key={result}
                      onClick={() => handleSearchSelect(result)}
                      style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-1)', cursor: 'pointer', borderBottom: '1px solid var(--border-2)' }}
                      onMouseOver={(e) => { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.color = 'var(--accent)'; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-1)'; }}
                    >
                      <span>{result}</span>
                      <ChevronRight size={14} />
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
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
