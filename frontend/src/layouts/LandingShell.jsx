import React from 'react';
import { Outlet } from 'react-router-dom';

export default function LandingShell() {
  return (
    <div className="app-shell" style={{ background: 'var(--bg-0)', minHeight: '100vh' }}>
      <Outlet />
    </div>
  );
}
