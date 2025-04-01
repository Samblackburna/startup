import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Articles } from './articles/articles';
import { NewsSourceHome } from './newsSourceHome/newsSourceHome';
import { PrivateRoute } from './PrivateRoute';
import { AuthState } from './login/authState';

export default function App() {
  const [authState, setAuthState] = useState(AuthState.Unknown);
  const [userName, setUserName] = useState(null);
  const [selectedNewsSource, setSelectedNewsSource] = useState('the-wall-street-journal');

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/status');
        if (response.ok) {
          const body = await response.json();
          setUserName(body.email);
          setAuthState(AuthState.Authenticated);
        } else {
          setAuthState(AuthState.Unauthenticated);
        }
      } catch (error) {
        setAuthState(AuthState.Unauthenticated);
      }
    }

    checkAuth();
  }, []);

  function handleAuthChange(newUserName, newAuthState) {
    setUserName(newUserName);
    setAuthState(newAuthState);
  }

  return (
    <BrowserRouter>
      <div className="body">
        <header>
          <nav>
            <img className="logo" alt="Quilted News" src="/QuiltedLogo.png" />
            <ul>
              <li className="nav-item">
                <NavLink className="nav-link active" to="/">Sign In</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="articles">Articles</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="newsSourceHome">My News Source</NavLink>
              </li>
            </ul>
          </nav>
          <hr style={{ marginBottom: "2px" }} />
          <hr style={{ marginTop: "0", paddingTop: "0" }} />
        </header>

        <Routes>
          <Route
            path='/'
            element={
              <Login
                userName={userName}
                authState={authState}
                onAuthChange={handleAuthChange}
              />
            }
          />
          <Route
            path='/articles'
            element={
              <PrivateRoute authState={authState}>
                <Articles selectedNewsSource={selectedNewsSource} />
              </PrivateRoute>
            }
          />
          <Route
            path='/newsSourceHome'
            element={
              <NewsSourceHome
                selectedNewsSource={selectedNewsSource}
                setSelectedNewsSource={setSelectedNewsSource}
              />
            }
          />
          <Route path='*' element={<NotFound />} />
        </Routes>

        <hr style={{ marginBottom: "0" }} />
        <footer>
          <span className="text-reset">Sam Blackburn</span>
          <a href="https://github.com/Samblackburna/startup">GitHub</a>
        </footer>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}