const { WebSocketServer } = require('ws');
const { getArticlesBySource, articlesCollection } = require('./database');

// Create a WebSocket server
const wss = new WebSocketServer({ port: 8080 });
console.log('WebSocket server started on ws://localhost:8080');

// Function to broadcast a message to all connected clients
function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Function to rotate through sample articles and broadcast them
async function postNewArticle() {
  try {
    const sampleArticles = await getArticlesBySource("Sam's News Source");

    if (sampleArticles.length > 0) {
      // Rotate through the articles
      const article = sampleArticles.shift(); // Get the first article
      article.publicationDate = new Date(); // Update the publication date to now

      // Insert the updated article back into the database
      await articlesCollection.insertOne(article);

      // Broadcast the new article to all connected clients
      broadcast({
        type: 'new-article',
        article,
      });

      console.log('Broadcasted new article:', article.title);
    }
  } catch (error) {
    console.error('Error posting new article:', error);
  }
}

// Function to delete articles older than 12 minutes
async function deleteOldArticles() {
  try {
    const twelveMinutesAgo = new Date(Date.now() - 12 * 60 * 1000);
    const result = await articlesCollection.deleteMany({
      publicationDate: { $lt: twelveMinutesAgo },
    });

    if (result.deletedCount > 0) {
      console.log(`Deleted ${result.deletedCount} old articles.`);
    }
  } catch (error) {
    console.error('Error deleting old articles:', error);
  }
}

// Schedule the posting of new articles every 2 minutes
setInterval(async () => {
  await postNewArticle();
  await deleteOldArticles();
}, 2 * 60 * 1000);