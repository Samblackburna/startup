import React, { useState, useEffect } from 'react';
import './articles.css';

export function Articles({ selectedNewsSource }) {
  const [articleIndex, setArticleIndex] = useState(0);
  const [filteredArticles, setFilteredArticles] = useState([]);

  console.log('Selected News Source:', selectedNewsSource);

  /* useEffect(() => {
    try {
      const filtered = articles.filter(article => article.newsSource === selectedNewsSource);
      setFilteredArticles(filtered);
      setArticleIndex(0);
    } catch (error) {
      console.error("Error filtering articles:", error);
    }
  }, [selectedNewsSource]); */

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
    const wsHost = window.location.hostname;
    const wsPort = 8080;
    const wsUrl = `${wsProtocol}://${wsHost}:${wsPort}`;

    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      const newArticle = JSON.parse(event.data);
      setArticles((prevArticles) => [newArticle, prevArticles]);
      setFilteredArticles((prevArticles) => [newArticle, prevArticles]); 
    };

    return () => ws.close();
  }, []);

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
        <a href={currentArticle.url} target="_blank" rel="noopener noreferrrer">Read Full Article</a>
      </div>
    </main>
  );
}