export default function UnitDetails({ selectedUnit }) {
  return (
    <div style={{ padding: '20px', color: '#e2e8f0' }}>
      <h3 style={{ marginBottom: '16px', color: '#38bdf8' }}>Unit Details</h3>
      {selectedUnit ? (
        <p>Selected: {selectedUnit}</p>
      ) : (
        <p style={{ color: '#94a3b8' }}>Click a unit to view details.</p>
      )}
    </div>
  );
}
