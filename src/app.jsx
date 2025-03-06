import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
  return (
    <div className="body bg-white text-dark">
      <header>
        <nav>
        <img className="logo" alt="Quilted News" src="/QuiltedLogo.png" />
          <ul>
            <li className="nav-item">
              <a className="nav-link active" href="index.html">Sign In</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="article.html">Articles</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="newsSourceHome.html">My News Source</a>
            </li>
          </ul>
        </nav>
        <hr style={{ marginBottom: "2px" }} />
        <hr style={{ marginTop: "0", paddingTop: "0" }} />
      </header>

      <main>App components go here</main>
      
      <footer>
        <hr />
        <span className="text-reset">Samuel Blackburn</span>
        <a href="https://github.com/Samblackburna/startup">GitHub</a>
      </footer>
    </div>
  );
}