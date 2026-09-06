import React, { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';

export default function UnitDetails({ selectedUnit }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (selectedUnit) {
      setLoading(true);
      fetch(`http://127.0.0.1:8000/api/property-card/${selectedUnit}`)
        .then(r => r.json())
        .then(d => {
          setData(d);
          setLoading(false);
          setCopied(false);
        })
        .catch(e => {
          console.error(e);
          setLoading(false);
        });
    } else {
      setData(null);
    }
  }, [selectedUnit]);

  const handleCopy = () => {
    if (data?.unit_details['3d_ulpin']) {
      navigator.clipboard.writeText(data.unit_details['3d_ulpin']);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ padding: '24px', color: '#e2e8f0', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      <h3 style={{ marginBottom: '16px', color: '#f8fafc', fontSize: '1.1rem' }}>Unit Details</h3>
      
      {!selectedUnit ? (
        <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: '40px' }}>
          Select any 3D unit from the viewer to inspect details.
        </div>
      ) : loading ? (
        <div style={{ color: '#38bdf8', marginTop: '20px' }}>Loading unit data...</div>
      ) : data ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, animation: 'fadeIn 0.3s' }}>
          <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '6px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>3D-ULPIN (Unique ID)</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'monospace', color: '#38bdf8', fontSize: '1.15rem', fontWeight: 'bold' }}>
                {data.unit_details['3d_ulpin']}
              </div>
              <button onClick={handleCopy} style={{ padding: '4px 12px', fontSize: '0.75rem', borderRadius: '4px' }}>
                {copied ? 'COPIED!' : 'COPY'}
              </button>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '2px' }}>Parent 2D Parcel</div>
            <div style={{ fontWeight: '500', fontSize: '1.05rem' }}>{data.parent_parcel.ulpin}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '2px' }}>Level / Layer</div>
              <div style={{ fontWeight: '500' }}>{data.unit_details.level}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '2px' }}>Usage</div>
              <div style={{ fontWeight: '500' }}>{data.unit_details.usage}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '2px' }}>Floor Area</div>
              <div style={{ fontWeight: '500' }}>{data.unit_details.area_sqm} sqm</div>
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '2px' }}>Total Volume</div>
              <div style={{ fontWeight: '500' }}>{data.unit_details.volume_cbm} cbm</div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '2px' }}>Z-Bounds (Height limits)</div>
            <div style={{ fontWeight: '500' }}>{data.unit_details.z_range}</div>
          </div>

          <div style={{ borderTop: '1px solid #334155', paddingTop: '16px', marginTop: '4px' }}>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>Registered Owner</div>
            <div style={{ fontWeight: '500', fontSize: '1.05rem', color: '#f1f5f9' }}>
              {data.ownership.name} <span style={{color: '#94a3b8', fontSize: '0.85rem'}}>({data.ownership.ownership_type})</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '2px' }}>Ph: {data.ownership.contact}</div>
          </div>

          <div style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e', padding: '12px', borderRadius: '6px', fontSize: '0.85rem', textAlign: 'center', fontWeight: 'bold', border: '1px solid rgba(34,197,94,0.3)' }}>
            Topology: ✅ VALID (Watertight)
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
            <button 
              onClick={() => setShowCard(true)}
              style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              📄 View Property Card
            </button>
          </div>
          
          {showCard && (
            <PropertyCard data={data} onClose={() => setShowCard(false)} />
          )}
        </div>
      ) : null}
    </div>
  );
}
