const { WebSocketServer } = require('ws');
const { getArticlesBySource, articlesCollection } = require('./database');

function initializeWebSocket(server) { //analagous to peerProxy function from Simon, I just figured this name was more generally appropriate
    const wss = new WebSocketServer({ server });
    console.log(`WebSocket server started on ws://${server.address().address}:${server.address().port}`);

    // Function to broadcast a message to all connected clients
    function broadcast(data) {
        console.log('Sharing data:', data); // Just for debugging
        wss.clients.forEach((client) => {
            if (client.readyState === client.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }

    // Function to rotate through sample articles and 'broadcast' them
    async function postNewArticle() {
        try {
            const sampleArticles = await getArticlesBySource("Sam's News Source");

            if (sampleArticles.length > 0) {  
                // Rotate through the articles
                const article = sampleArticles.shift();
                article.date = new Date(); // Debugging the date field

                const { _id, ...articleWithoutId } = article;

                await articlesCollection.insertOne(articleWithoutId);

                // Broadcast new article with a notification message
                broadcast({
                    type: 'new-article',
                    article: articleWithoutId,
                    notification: `New article posted: ${articleWithoutId.title}`
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
                console.log(`Deleted ${result.deletedCount} old article(s).`);
            }
        } catch (error) {
            console.error('Error deleting old articles:', error);
        }
    }

    // Schedule the posting of new articles every 2 minutes
    setInterval(async () => {
        console.log('Scheduler Running');
        await postNewArticle();
        await deleteOldArticles();
    }, 2 * 60 * 1000);

    // Optionally return the ws instance for further use
    return wss;
}

module.exports = { initializeWebSocket };