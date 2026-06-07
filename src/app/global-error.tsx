'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#011627',
          color: '#d8dee9',
          padding: '24px',
          fontFamily: 'monospace'
        }}>
          <h2 style={{ color: '#ef4444', marginBottom: '16px', fontWeight: 'bold' }}>
            System Error Occurred
          </h2>
          <p style={{ color: '#5f7d97', fontSize: '12px', marginBottom: '24px', maxWidth: '500px', wordBreak: 'break-all' }}>
            {error.message || 'An unexpected runtime error occurred.'}
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6e9cf1',
              color: '#011627',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Retry Execution
          </button>
        </div>
      </body>
    </html>
  );
}
