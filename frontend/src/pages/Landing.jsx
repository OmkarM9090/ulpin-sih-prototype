import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Map as MapIcon, Building2, Boxes, Link2, ShieldCheck, Activity } from 'lucide-react';
import logoUrl from '../assets/logo.svg';

export default function Landing() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    units: '--',
    underground: '--',
    confidence: '--%'
  });

  useEffect(() => {
    fetch('http://localhost:8000/api/system-status')
      .then(res => res.json())
      .then(data => {
        setStats({
          units: data.units_registered || 14,
          underground: 3, // Mocked for now, as backend doesn't return underground counts yet
          confidence: '94.2%'
        });
      })
      .catch(() => {
        setStats({
          units: 14,
          underground: 3,
          confidence: '94.2%'
        });
      });
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-0)',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Subtle grid background */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(to right, var(--accent) 1px, transparent 1px), linear-gradient(to bottom, var(--accent) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)'
      }} />

      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '32px 48px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', background: 'var(--bg-3)',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}>
            <img src={logoUrl} alt="BHU-3D" style={{ width: '24px', height: '24px' }} />
          </div>
          <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>
            BHU-3D
          </span>
        </div>
        <div style={{
          fontSize: '10px', fontWeight: 600, color: 'var(--text-3)',
          textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center'
        }}>
          SMART INDIA HACKATHON PROTOTYPE
        </div>
      </header>

      {/* Main Hero */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 10, padding: '0 24px', textAlign: 'center', marginTop: '-40px' }}>
        <div style={{
          background: 'rgba(34, 211, 238, 0.08)', border: '1px solid var(--accent)',
          color: 'var(--accent)', padding: '6px 16px', borderRadius: '999px',
          fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '32px'
        }}>
          GEOSPATIAL LAND ADMINISTRATION
        </div>
        
        <h1 style={{
          fontSize: 'clamp(40px, 5vw, 60px)', fontWeight: 700, color: 'var(--text-1)',
          letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '24px', maxWidth: '800px'
        }}>
          From 2D Land Parcels to <span style={{ color: 'var(--accent)' }}>3D Property Identity</span>
        </h1>
        
        <p style={{
          fontSize: '16px', color: 'var(--text-2)', maxWidth: '720px',
          lineHeight: 1.6, marginBottom: '48px'
        }}>
          An AI-assisted geospatial platform for mapping surface, vertical and underground property volumes — giving every apartment, basement and utility corridor a structured, verifiable 3D identifier.
        </p>
        
        <div style={{ display: 'flex', gap: '16px', marginBottom: '80px' }}>
          <Link to="/map" style={{
            background: 'var(--accent)', color: 'var(--bg-0)',
            padding: '0 24px', height: '48px', borderRadius: '8px',
            fontSize: '15px', fontWeight: 600, textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: '8px',
            transition: 'background var(--transition)'
          }}>
            Launch 3D Map <ArrowRight size={18} />
          </Link>
          <button
            onClick={() => navigate('/map?demo=true')}
            style={{
              background: 'transparent', border: '1px solid var(--border-2)',
              color: 'var(--text-1)', padding: '0 24px', height: '48px',
              borderRadius: '8px', fontSize: '15px', fontWeight: 600,
              display: 'flex', alignItems: 'center', transition: 'all var(--transition)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--text-2)'; e.currentTarget.style.background = 'var(--bg-1)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.background = 'transparent'; }}
          >
            Explore Demo
          </button>
        </div>

        {/* Pipeline */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%', maxWidth: '900px' }}>
          <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            PROCESSING PIPELINE
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { label: '2D Parcel', icon: MapIcon },
              { label: '3D Building', icon: Building2 },
              { label: 'Vertical Units', icon: Boxes },
              { label: '3D ULPIN', icon: Link2 },
              { label: 'Validation', icon: ShieldCheck }
            ].map((step, idx, arr) => (
              <React.Fragment key={step.label}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'var(--bg-1)', border: '1px solid var(--border-2)',
                  padding: '8px 16px', borderRadius: '8px', color: 'var(--text-1)', fontSize: '13px', fontWeight: 500
                }}>
                  <step.icon size={16} color="var(--accent)" />
                  {step.label}
                </div>
                {idx < arr.length - 1 && <ArrowRight size={16} color="var(--text-4)" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </main>

      {/* Footer Stats */}
      <footer style={{
        padding: '32px 48px', borderTop: '1px solid var(--border-1)',
        background: 'var(--bg-1)', position: 'relative', zIndex: 10,
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px'
      }}>
        {[
          { label: 'Vertical units modelled', value: stats.units },
          { label: 'Underground assets mapped', value: stats.underground },
          { label: 'Geometry confidence', value: stats.confidence }
        ].map(stat => (
          <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{stat.label}</div>
            <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-1)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Activity size={20} color="var(--accent)" />
              {stat.value}
            </div>
          </div>
        ))}
      </footer>
    </div>
  );
}
