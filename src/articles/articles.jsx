import React, { useState, useEffect } from 'react';
import './articles.css';

// This is a mock list of articles that will be fetched from a backend once I have a server set up
const articles = [
  { title: "Article Title 1", subtitle: "Subtitle 1", newsSource: "New York Times", authors: "Author(s) 1", publicationDate: "Publication Date 1", content: "Main Article Content 1" },
  { title: "Article Title 2", subtitle: "Subtitle 2", newsSource: "New York Times", authors: "Author(s) 2", publicationDate: "Publication Date 2", content: "Main Article Content 2" },
  { title: "Article Title 3", subtitle: "Subtitle 3", newsSource: "Salt Lake Tribune", authors: "Author(s) 3", publicationDate: "Publication Date 3", content: "Main Article Content 3" },
  { title: "Article Title 4", subtitle: "Subtitle 4", newsSource: "Salt Lake Tribune", authors: "Author(s) 4", publicationDate: "Publication Date 4", content: "Main Article Content 4" },
  { title: "Article Title 5", subtitle: "Subtitle 5", newsSource: "Sam's News Source", authors: "Author(s) 5", publicationDate: "Publication Date 5", content: "Main Article Content 5" },
  { title: "Article Title 6", subtitle: "Subtitle 6", newsSource: "Sam's News Source", authors: "Author(s) 6", publicationDate: "Publication Date 6", content: "Main Article Content 6" },
]

export function Articles({ selectedNewsSource }) {
  const [articleIndex, setArticleIndex] = useState(0);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [articles, setArticles] = useState([]);
  const [notification, setNotification] = useState(null);

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
    const ws = new WebSocket('ws://localhost:8080');
    
    // diagnosing posting issue
    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'new-article') {
        const newArticle = message.article;

        // Add the new article to the list of articles
        setArticles((prevArticles) => [newArticle, ...prevArticles]);

        // Optionally update filteredArticles if it needs to reflect the new article
        setFilteredArticles((prevFilteredArticles) => [newArticle, ...prevFilteredArticles]);

        // Show a notification
        setNotification(`New article posted: ${newArticle.title}`);
        setTimeout(() => setNotification(null), 5000); // Clear notification after 5 seconds
      }
    };

    return () => ws.close();
  }, []);

  const treatPreviousArticle = () => {
    setArticleIndex((previousArticleIndex) =>
      previousArticleIndex > 0 ? previousArticleIndex - 1 : filteredArticles.length - 1
    );
  };

  const treatNextArticle = () => {
    setArticleIndex((previousArticleIndex) =>
      previousArticleIndex < filteredArticles.length - 1 ? previousArticleIndex + 1 : 0
    );
  };

  let currentArticle;
  try {
    currentArticle = filteredArticles[articleIndex];
  } catch (error) {
    console.error('Error accessing current article:', error);
    currentArticle = null;
  }

  console.log('Current Article:', currentArticle);

  if (!currentArticle) {
    return (
      <main>
        <h1>No articles available for the selected news source.</h1>
      </main>
    );
  }

  return (
    <main>
      {notification && <div className="notification">{notification}</div>}
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
        <p>{currentArticle.content || 'No Content Available'}</p>
        <a href={currentArticle.url} target="_blank" rel="noopener noreferrer">
          Read Full Article
        </a>
      </div>
      <div>
        {articles.map((article, index) => (
          <div key={index}>
            <h2>{article.title}</h2>
            <p>{article.subtitle}</p>
            <p>{new Date(article.publicationDate).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </main>
  );
}