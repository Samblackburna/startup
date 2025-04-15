const { WebSocketServer } = require('ws');
const { getArticlesBySource, articlesCollection } = require('./database');

// finding avaulable port
const PORT = process.env.PORT || 8080;

// Create a WebSocket server
const wss = new WebSocketServer({ port: PORT });
console.log(`WebSocket server started on ws://0.0.0.0:${wss.options.port}`);

// Function to broadcast a message to all connected clients
function broadcast(data) {
  // diagnosing posting issue
  console.log('Broadcasting data:', data);
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
      const article = sampleArticles.shift();
      article.date = new Date(); // Update the "date" field

      const { _id, ...articleWithoutId } = article;

      await articlesCollection.insertOne(articleWithoutId);

      broadcast({
        type: 'new-article',
        article: articleWithoutId,
      });

      console.log('Broadcasted new article:', articleWithoutId.title);
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
  // diagnosing posting issue
  console.log('Scheduler Running')
  await postNewArticle();
  await deleteOldArticles();
}, 2 * 60 * 1000);