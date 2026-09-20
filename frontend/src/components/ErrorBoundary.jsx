import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('3D Context Crashed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-0)',
          color: 'var(--text-1)', padding: '32px', textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💥</div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--danger)', marginBottom: '8px' }}>3D Viewer Crashed</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-3)', maxWidth: '400px', marginBottom: '16px' }}>
            The WebGL context encountered a fatal error. This usually happens if the graphics driver crashes or invalid geometry was passed to the scene.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: 'var(--bg-1)', border: '1px solid var(--border-2)',
              color: 'var(--text-1)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
              fontSize: '13px', fontWeight: 600
            }}
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
