import React from 'react';

import Button from 'react-bootstrap/Button';
import { MessageDialog } from './messageDialog';

export function Unauthenticated(props) {
  const [userName, setUserName] = React.useState(props.userName || '');
  const [password, setPassword] = React.useState('');
  const [displayError, setDisplayError] = React.useState(null);

  async function loginUser() {
    loginOrCreate(`/api/auth/login`);
  }

  async function createUser() {
    loginOrCreate(`/api/auth/create`);
  }

  async function loginOrCreate(endpoint) {
    const response = await fetch(endpoint, {
      method: 'post',
      body: JSON.stringify({ email: userName, password: password }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      credentials: 'include',
    });
    if (response?.status === 200) {
      localStorage.setItem('userName', userName);
      props.onLogin(userName);
    } else {
      const body = await response.json();
      setDisplayError(`⚠ Error: ${body.msg}`);
    }
  }

  return (
    <>
      <div>
        <div>
          <span style={{  }}>Sign In or Create Account</span>
          <input type='text' value={userName} onChange={(e) => setUserName(e.target.value)} placeholder='Email or Username' style={{ marginBottom: 7 }}/>
        </div>
        <div>
          <input type='password' onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
        </div>
        <Button variant='secondary' onClick={() => loginUser()} disabled={!userName || !password}>
          Login
        </Button>
        <Button variant='secondary' onClick={() => createUser()} disabled={!userName || !password}>
          Create
        </Button>
      </div>

      <MessageDialog message={displayError} onHide={() => setDisplayError(null)} />
    </>
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