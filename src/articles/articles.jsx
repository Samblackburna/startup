import React, { useState, useEffect } from 'react';
import './articles.css';

export function Articles({ selectedNewsSource }) {
  const [articleIndex, setArticleIndex] = useState(0);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [notification, setNotification] = useState('');

  console.log('Selected News Source:', selectedNewsSource);

  useEffect(() => {
    fetch(`/api/articles?source=${selectedNewsSource}`)
      .then((response) => response.json())
      .then((data) => {
        setFilteredArticles(data);
        setArticleIndex(0);
      })
      .catch((error) => console.error('Error fetching articles:', error));
  }, [selectedNewsSource]);

  useEffect(() => {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    // If we're in development with Vite (port 5173), use 4000 where your Node server runs -- Will this work in production?
    let wsHost = window.location.host;
    if (window.location.port === '5173') {
      wsHost = `${window.location.hostname}:4000`;
    }
    const wsUrl = `${wsProtocol}://${wsHost}`;

    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      const newArticle = JSON.parse(event.data);
      setFilteredArticles((prevArticles) => [newArticle.article || newArticle, ...prevArticles]);
      if (newArticle.notification) {
        setNotification(newArticle.notification);
        // Clear notification after 5 seconds
        setTimeout(() => setNotification(''), 5000);
      }
    };

    return () => ws.close();
  }, [selectedNewsSource]);

  const treatPreviousArticle = () => {
    setArticleIndex((previousArticleIndex) => 
      (previousArticleIndex > 0 ? previousArticleIndex - 1 : filteredArticles.length - 1)
    );
  };

  const treatNextArticle = () => {
    setArticleIndex((previousArticleIndex) => 
      (previousArticleIndex < filteredArticles.length - 1 ? previousArticleIndex + 1 : 0)
    );
  };

  let currentArticle;
  try {
    currentArticle = filteredArticles[articleIndex];
  } catch (error) {
    console.error("Error accessing current article:", error);
    currentArticle = null;
  }

  if (!currentArticle) {
    return (
      <main>
        <h1>No articles available for the selected news source.</h1>
      </main>
    );
  }

  return (
    <main>
      {notification && (
        <div className="notification" onClick={() => {
          setArticleIndex(0);
          setNotification('');
        }}>
          {notification}
        </div>
      )}
      <div className="side-zone left-zone" onClick={treatPreviousArticle}></div>
      <div className="side-zone right-zone" onClick={treatNextArticle}></div>
      <h1 style={{ margin: 0 }}>{currentArticle.title || 'No Title Available'}</h1>
      <h2 style={{ margin: 0 }}>{currentArticle.subtitle || 'No Subtitle Available'}</h2>
      <div className="article-other-info">
        <h3 className="news-source-name">{currentArticle.newsSource || 'Unknown Source'}</h3>
        <h3 className="authors">{currentArticle.authors || 'Unknown Author(s)'}</h3>
        <h3 className="publication date">{currentArticle.publicationDate || 'Unknown Date'}</h3>
      </div>
      <div className="main-article-content">
        <p>
          {currentArticle.content || 'No Content Available'}
        </p>
        <a href={currentArticle.url} target="_blank" rel="noopener noreferrer">Read Full Article</a>
      </div>
    </main>
  );
}