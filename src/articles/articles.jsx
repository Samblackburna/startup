import React from 'react';
import './articles.css';

const articles = [
  { title: "Article Title 1", subtitle: "Subtitle 1", newsSource: "News Source 1", authors: "Author(s) 1", publicationDate: "Publication Date 1", content: "Main Article Content 1" },
  { title: "Article Title 2", subtitle: "Subtitle 2", newsSource: "News Source 2", authors: "Author(s) 2", publicationDate: "Publication Date 2", content: "Main Article Content 2" },
  { title: "Article Title 3", subtitle: "Subtitle 3", newsSource: "News Source 3", authors: "Author(s) 3", publicationDate: "Publication Date 3", content: "Main Article Content 3" },
]

export function Articles() {
  return (
    <main>
      <h1 style={{ margin: 0 }}>Article Title</h1>
      <h2 style={{ margin: 0 }}>Subtitle</h2>
      <div className="article-other-info">
        <h3 className="news-source-name">News Source</h3>
        <h3 className="authors">Author(s)</h3>
        <h3 className="publication date">Publication Date</h3>
      </div>
      <div className="main-article-content">
        <p>
          Main Article Content
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, in. Consectetur praesentium ullam pariatur maiores commodi aspernatur magni eaque repellat, libero rem alias tempore sit, magnam corrupti molestiae! Tempore, excepturi. Lorem ipsum dolor sit amet, consectetur adipisicing elit. A et fugit earum quam itaque consequuntur. Voluptatibus quod officiis at reprehenderit enim tenetur molestiae. Praesentium, reprehenderit? Quo accusantium in repellendus tenetur.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi at, tempore facilis ipsam cum est saepe velit sed quisquam architecto ratione ab officia doloremque libero facere beatae quo iste. Optio? Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aperiam numquam id inventore adipisci animi dicta quis vel corrupti maxime vero, eius in est, ab voluptatem! Facilis, quis autem? Repellendus, sapiente!
        </p>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam, quas consectetur at dicta impedit quis molestiae, quos voluptas explicabo voluptates repellat sequi rem consequuntur magnam vero quia provident, minus cumque! Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt aperiam ea, sed, ex, harum ipsam distinctio nisi autem eveniet veniam laboriosam animi neque officia esse voluptate nemo reprehenderit qui quas?
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio quam, aliquam ipsa quibusdam saepe quae earum ipsam, architecto nostrum dolorum quos molestias sunt consequatur corrupti quasi, ratione magni nisi officia! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur voluptas optio minima quia temporibus fuga, asperiores neque sed, doloribus iusto a cupiditate! Minima quo et dolor quod maxime numquam dicta. Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium accusamus dolorum iste porro, corporis alias, dignissimos, repellat vitae doloribus expedita possimus delectus mollitia distinctio labore necessitatibus earum officia nobis eum.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. In ullam ea necessitatibus reprehenderit commodi dolor dignissimos sint dolores hic omnis quam quaerat aperiam earum eos, labore minus delectus optio! Quasi. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit aspernatur temporibus officiis, fugiat rem repellendus eos error explicabo hic at quaerat dolores vitae, nam, quam sed modi expedita cumque eius. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iste minus recusandae omnis quo error voluptates, molestiae odit accusantium, enim quis harum minima totam asperiores doloremque modi corporis perspiciatis accusamus iusto.
        </p>
      </div>
    </main>
  );
}