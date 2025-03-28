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
    fetch(`http://localhost:4000/api/articles?source=${selectedNewsSource}`)
      .then((response) => response.json())
      .then((data) => {
        setFilteredArticles(data);
        setArticleIndex(0);
      })
      .catch((error) => console.error('Error fetching articles:', error));
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
        <p>
          {currentArticle.url || 'No URL Available'}
        </p>
        <a href={currentArticle.url} target="_blank" rel="noopener noreferrrer">Read Full Article</a>
      </div>
    </main>
  );
}