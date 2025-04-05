import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Unauthenticated } from './unauthenticated';
import { Authenticated } from './authenticated';
import { AuthState } from './authState';

export function Login({ userName, authState, onAuthChange }) {
  console.log('authState:', authState);
  console.log('userName:', userName);
  return (
    <main className="loginPageSignedIn">
      <div>
        {authState !== AuthState.Unknown}
        {authState === AuthState.Authenticated && (
          <Authenticated
            userName={userName}
            onLogout={() => onAuthChange(null, AuthState.Unauthenticated)}
          />
        )}
        {authState === AuthState.Unauthenticated && (
          <Unauthenticated
            userName={userName}
            onLogin={(loginUserName) => {
              onAuthChange(loginUserName, AuthState.Authenticated);
            }}
          />
        )}
      </div>
    </main>
  );
}
/*
  export function Login() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  function handleLogin(event) {
    event.preventDefault();
    if (username) {
      localStorage.setItem('user', username);
      navigate('/articles');
    } else {
      alert('Please enter a username or email to sign in.');
    }
  }

  function handleUsernameChange(e) {
    setUsername(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  return (
    <main>
      <div>
        <h3 className="sign-in-notice">Sign in or create account</h3>
      </div>
      <form onSubmit={handleLogin}>
        <div style={{ width: '100%' }}>
          <span className="sign-in">Email or Username</span>
          <input type="text" value={username} onChange={handleUsernameChange} />
        </div>
        <div style={{ width: '100%' }}>
          <span className="sign-in">Password</span>
          <input type="password" value={password} onChange={handlePasswordChange} />
        </div>
        <div style={{ width: '100%' }} className="button-holder">
          <button style={{ width: '100%' }} type="submit">Login</button>
          <button style={{ width: '100%' }} type="submit">Create Account</button>
        </div>
      </form>
    </main>
  );
}
  */