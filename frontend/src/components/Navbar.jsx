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
      height: '64px',
      background: 'var(--bg-2)',
      borderBottom: '1px solid var(--border-1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      gap: '24px'
    }}>
      {/* Left: Logo & Brand */}
      <Link to="/" style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
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
          <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            3D ULPIN & VERTICAL PROPERTY MAPPING SYSTEM
          </span>
        </div>
      </Link>

      {/* Center: Nav Links */}
      <nav style={{ flex: '1 1 auto', display: 'flex', justifyContent: 'center', gap: '4px', height: '100%', overflow: 'hidden' }}>
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '0 12px', height: '100%',
              color: isActive ? 'var(--text-1)' : 'var(--text-3)',
              textDecoration: 'none', fontSize: '13px', fontWeight: 500,
              whiteSpace: 'nowrap', transition: 'color var(--transition)',
              borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent'
            })}
          >
            {({ isActive }) => (
              <>
                <link.icon size={16} color={isActive ? 'var(--accent)' : 'currentColor'} />
                <span>{link.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Right: Search, Demo, Avatar */}
      <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
        
        {/* Global Search */}
        <div style={{ position: 'relative', minWidth: '240px', maxWidth: '360px', flex: '1 1 auto' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={16} color={isSearchFocused ? 'var(--accent)' : 'var(--text-3)'} style={{ position: 'absolute', left: '12px', transition: 'color var(--transition)' }} />
            <input
              type="text"
              placeholder="Search ULPIN, parcel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              style={{
                width: '100%', background: 'var(--bg-1)', border: isSearchFocused ? '1px solid var(--accent)' : '1px solid var(--border-2)',
                borderRadius: '6px', padding: '8px 12px 8px 36px', color: 'var(--text-1)',
                fontSize: '13px', outline: 'none', transition: 'all var(--transition)'
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
                  {['MH-PUN-P123456 (Parcel)', '09-12345-0012-L03-R (Unit)', 'Pune Metro B1'].map(recent => (
                    <div 
                      key={recent}
                      onClick={() => handleSearchSelect(recent)}
                      style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-2)', cursor: 'pointer', borderBottom: '1px solid var(--border-2)', whiteSpace: 'nowrap' }}
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
                    `MH-PUN-${searchQuery.toUpperCase()}-001`,
                    `3D-ULPIN: 09-${searchQuery}-12345`,
                    `${searchQuery} Commercial Complex`
                  ].map(result => (
                    <div 
                      key={result}
                      onClick={() => handleSearchSelect(result)}
                      style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-1)', cursor: 'pointer', borderBottom: '1px solid var(--border-2)', whiteSpace: 'nowrap' }}
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
            border: '1px solid var(--border-2)', color: 'var(--text-3)',
            background: 'transparent', padding: '6px 12px',
            borderRadius: '16px', fontSize: '11px', fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap'
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--warning)'; e.currentTarget.style.color = 'var(--warning)'; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.color = 'var(--text-3)'; }}
        >
          <Radio size={14} />
          Demo Mode
        </button>

        <button style={{ position: 'relative', color: 'var(--text-2)', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <Bell size={18} />
          <div style={{
            position: 'absolute', top: '-2px', right: '-2px', width: '6px', height: '6px',
            background: 'var(--danger)', borderRadius: '50%', border: '1px solid var(--bg-2)'
          }} />
        </button>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          paddingLeft: '16px', borderLeft: '1px solid var(--border-2)', whiteSpace: 'nowrap'
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
          </div>
        </div>
      </div>
    </header>
  );
}
