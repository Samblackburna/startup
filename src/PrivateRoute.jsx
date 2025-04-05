import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthState } from './login/authState';

export function PrivateRoute({ authState, children }) {
  if (authState === AuthState.Unknown) {
    // Cool loading screen
    return <div>Loading...</div>;
  }

  if (authState === AuthState.Unauthenticated) {
    return (
      <div style={{ textAlign: 'center', marginBottom: '400px' }}>
        <h3 style={{ textWeight: ''}}>Sign in to access articles.</h3>
      </div>
    )
  }

  return children;
}
