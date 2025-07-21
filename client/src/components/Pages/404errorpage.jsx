import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Error404Page() {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h1 style={{ fontSize: '4rem', color: '#dc3545' }}>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <button
        style={{
          marginTop: '2rem',
          padding: '0.75rem 2rem',
          fontSize: '1.2rem',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
        onClick={() => navigate(-1)}
      >
        Go Back
      </button>
    </div>
  );
}
