import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthState } from './login/authState';

export function PrivateRoute({ authState, children }) {
  if (authState === AuthState.Unknown) {
    // Cool loading screen
    return <div>Loading...</div>;
  }

  if (authState === AuthState.Unauthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
