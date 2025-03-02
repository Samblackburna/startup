import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
  return (
    <div className="body bg-light text-dark">
      <header>
        <nav>
          <img className="logo" alt="Quilted News" src="/public/QuiltedLogo.png" />
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
        <hr style="margin-bottom: 2px;"/>
        <hr style="margin-top: 0; padding-top: 0;"/>
      </header>
      <main>

      </main>
      <footer>
        <hr />
        <span class="text-reset">Samuel Blackburn</span>
        <a href="https://github.com/Samblackburna/startup">GitHub</a>
      </footer>
    </div>
  );
}