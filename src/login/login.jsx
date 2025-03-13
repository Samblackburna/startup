import React from 'react';

export function Login() {
  const handleButtonClick = (event) => {
    event.preventDefault();
  }

  return (
    <main>
      <div>
        <h3 className="sign-in-notice">Sign in or create account</h3>
      </div>
      <form method="get" action="play.html">
        <div style={{ width: '100%' }}>
          <span className="sign-in">Email or Username</span>
          <input type="text" />
        </div>
        <div style={{ width: '100%' }}>
          <span className="sign-in">Password</span>
          <input type="text" />
        </div>
        <div style={{ width: '100%' }} className="button-holder">
          <button style={{ width: '100%' }} type="submit" onClick={handleButtonClick}>Sign in</button>
          <button type="submit" onClick={handleButtonClick}>Create</button>
        </div>
      </form>
    </main>
  );
}