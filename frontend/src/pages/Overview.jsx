import React, { useEffect, useState } from 'react';
import { Layers, Building2, Boxes, PackageOpen, AlertTriangle, ShieldCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Overview() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/overview-stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Failed to fetch stats", err));
  }, []);

  const chartData = [
    { name: 'Jan', units: 0, verified: 0 },
    { name: 'Feb', units: 0, verified: 0 },
    { name: 'Mar', units: 0, verified: 0 },
    { name: 'Apr', units: 0, verified: 0 },
    { name: 'May', units: 4, verified: 2 },
    { name: 'Jun', units: 14, verified: 14 },
  ];

  const kpis = [
    { title: 'TOTAL PARCELS', value: stats?.total_parcels || '--', icon: Layers },
    { title: '3D BUILDINGS', value: stats?.buildings || '--', icon: Building2 },
    { title: 'VERTICAL UNITS', value: stats?.units || '--', icon: Boxes },
    { title: 'UNDERGROUND ASSETS', value: stats?.underground || '--', icon: PackageOpen },
    { title: 'SPATIAL CONFLICTS', value: stats?.conflicts || 0, icon: AlertTriangle, color: 'var(--danger)' },
    { title: 'VERIFIED PROPERTIES', value: stats?.verified || '--', icon: ShieldCheck, color: 'var(--success)' },
  ];

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px', height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '8px' }}>Land Administration Overview</h1>
        <div style={{ fontSize: '13px', color: 'var(--text-3)' }}>
          Lucknow Circle · Synthetic demonstration dataset · 3D-ULPIN engine v0.9
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }}>
        {kpis.map((kpi, i) => (
          <div key={i} style={{
            background: 'var(--bg-2)', border: '1px solid var(--border-1)',
            borderRadius: '12px', padding: '16px', position: 'relative'
          }}>
            <kpi.icon size={20} color={kpi.color || 'var(--text-3)'} style={{ position: 'absolute', top: '16px', right: '16px' }} />
            <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '8px' }}>
              {kpi.title}
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '4px' }}>
              {!stats ? <span style={{ opacity: 0.5 }}>...</span> : kpi.value}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-4)' }}>Synthetic Demo Dataset</div>
          </div>
        ))}
      </div>

      {/* 2-Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '8fr 4fr', gap: '24px', flex: 1, minHeight: '300px' }}>
        {/* Chart */}
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border-1)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-1)' }}>VERTICAL UNIT REGISTRATION</h2>
            <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>Synthetic snapshot — not time-series</span>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-2)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-4)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-4)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-3)', borderColor: 'var(--border-1)', borderRadius: '8px', color: 'var(--text-1)' }}
                  itemStyle={{ color: 'var(--text-1)' }}
                />
                <Area type="monotone" dataKey="units" stroke="var(--accent)" fillOpacity={1} fill="url(#colorUnits)" name="Total Units" />
                <Area type="monotone" dataKey="verified" stroke="var(--success)" fillOpacity={1} fill="url(#colorVerified)" name="Verified" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity */}
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border-1)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-1)', marginBottom: '24px' }}>RECENT SPATIAL ACTIVITY</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, overflowY: 'auto' }}>
            {!stats ? (
              <div style={{ color: 'var(--text-3)', fontSize: '13px' }}>Loading activity...</div>
            ) : stats.activity.length === 0 ? (
              <div style={{ color: 'var(--text-3)', fontSize: '13px' }}>No recent activity</div>
            ) : (
              stats.activity.map((act, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: act.color, marginTop: '6px', flexShrink: 0 }}></div>
                  <div>
                    <div style={{ fontSize: '13px', color: 'var(--text-1)', marginBottom: '4px' }}>{act.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-4)' }}>{act.time}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
