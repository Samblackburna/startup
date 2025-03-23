import React, { useState, useEffect } from 'react';

export function PrivateRoute({ children }) {
  const [showNotice, setShowNotice] = useState(false);
  const user = localStorage.getItem('user');

  if (!user) {
    return (
      <div>
        {showNotice && (
          <div className="alert alert-warning">
            You must sign in to access this page.
          </div>
        )}
        <main>
          <h1>Please sign in to view articles.</h1>
        </main>
      </div>
    );
  }

  return children;
}
