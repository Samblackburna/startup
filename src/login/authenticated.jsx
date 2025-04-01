import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import './authenticated.css';

export function Authenticated(props) {
  const navigate = useNavigate();

  function logout() {
    // Call the backend to log out the user
    fetch(`/api/auth/logout`, {
      method: 'DELETE',
    })
      .catch(() => {
        // Handle any errors (e.g., offline mode)
        console.error('Error logging out');
      })
      .finally(() => {
        // Clear local storage and notify parent component
        localStorage.removeItem('userName');
        props.onLogout();
      });
  }

  return (
    <div>
      <div className="playerName">{props.userName}</div>
      <Button variant="primary" onClick={() => navigate('/articles')}>
        Articles
      </Button>
      <Button variant="secondary" onClick={logout}>
        Logout
      </Button>
    </div>
  );
}
