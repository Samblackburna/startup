import React from 'react';

export function Login() {
  const [text, setText] = React.useState('');

  const handleButtonClick = (event) => {
    event.preventDefault();
  }

  function loginUser(event) {
    event.preventDefault();
    localStorage.setItem('user', text);
  }

  function textChange(e) {
    setText(e.target.value);
  }

  return (
    <main>
      <div>
        <h3 className="sign-in-notice">Sign in or create account</h3>
      </div>
      <form>
        <div style={{ width: '100%' }}>
          <span className="sign-in">Email or Username</span>
          <input type="text" onChange={textChange} />
        </div>
        <div style={{ width: '100%' }}>
          <span className="sign-in">Password</span>
          <input type="text" onChange={textChange} />
        </div>
        <div style={{ width: '100%' }} className="button-holder">
          <button style={{ width: '100%' }} type="submit" onClick={loginUser}>Login</button>
          <button type="submit" onClick={handleButtonClick}>Create</button>
        </div>
      </form>
    </main>
  );
}