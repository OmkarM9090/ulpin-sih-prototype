export default function Viewer3D({ explodeValue, showLabels, onSelect }) {
  return (
    <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
      <p>Three.js 3D Canvas Placeholder</p>
      <p>Explode: {explodeValue}%</p>
      <p>Labels: {showLabels ? 'On' : 'Off'}</p>
    </div>
  );
}
