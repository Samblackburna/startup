import React, { useState } from 'react';
import './articles.css';

const articles = [
  { title: "Article Title 1", subtitle: "Subtitle 1", newsSource: "News Source 1", authors: "Author(s) 1", publicationDate: "Publication Date 1", content: "Main Article Content 1" },
  { title: "Article Title 2", subtitle: "Subtitle 2", newsSource: "News Source 2", authors: "Author(s) 2", publicationDate: "Publication Date 2", content: "Main Article Content 2" },
  { title: "Article Title 3", subtitle: "Subtitle 3", newsSource: "News Source 3", authors: "Author(s) 3", publicationDate: "Publication Date 3", content: "Main Article Content 3" },
]

export function Articles() {
  const [articleIndex, setArticleIndex] = useState(0);

  const treatPreviousArticle = () => {
    setArticleIndex((previousArticleIndex) => (previousArticleIndex > 0 ? previousArticleIndex - 1 : articles.length - 1));
  }

  const treatNextArticle = () => {
    setArticleIndex((previousArticleIndex) => (previousArticleIndex < articles.length - 1 ? previousArticleIndex + 1 : 0));
  }

  const currentArticle = articles[articleIndex];

  return (
    <main>
      <div className="side-zone left-zone" onClick={treatPreviousArticle}></div>
      <div className="side-zone right-zone" onClick={treatNextArticle}></div>
      <h1 style={{ margin: 0 }}>{currentArticle.title}</h1>
      <h2 style={{ margin: 0 }}>{currentArticle.subtitle}</h2>
      <div className="article-other-info">
        <h3 className="news-source-name">{currentArticle.newsSource}</h3>
        <h3 className="authors">{currentArticle.authors}</h3>
        <h3 className="publication date">{currentArticle.publicationDate}</h3>
      </div>
      <div className="main-article-content">
        <p>
          {currentArticle.content}
        </p>
      </div>
    </main>
  );
}