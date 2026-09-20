import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './layouts/AppShell';
import LandingShell from './layouts/LandingShell';
import Landing from './pages/Landing';
import Overview from './pages/Overview';
import PropertyMap from './pages/PropertyMap';
import Parcels from './pages/Parcels';
import Buildings from './pages/Buildings';
import VerticalUnits from './pages/VerticalUnits';
import Validation from './pages/Validation';
import Reports from './pages/Reports';
import './styles.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LandingShell />}>
          <Route path="/" element={<Landing />} />
        </Route>
        
        <Route element={<AppShell />}>
          <Route path="/overview" element={<Overview />} />
          <Route path="/map" element={<PropertyMap />} />
          <Route path="/parcels" element={<Parcels />} />
          <Route path="/buildings" element={<Buildings />} />
          <Route path="/units" element={<VerticalUnits />} />
          <Route path="/validation" element={<Validation />} />
          <Route path="/reports" element={<Reports />} />
          {/* Catch-all to fallback to /map if authenticated or / depending on flow. For demo, redirect unknown to map */}
          <Route path="*" element={<Navigate to="/map" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

