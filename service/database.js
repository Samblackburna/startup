const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const userCollection = db.collection('user');
const articlesCollection = db.collection('articles');

(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log(`Connect to database`);
    
    // Creating sample articles
    const existingArticles = await articlesCollection.findOne({ source: "Sam's News Source" });
    if (!existingArticles) {
      const sampleArticles = [
        {
          title: 'Breaking News: Local Hero Saves the Day',
          content: 'A local hero stepped in to save the day in an incredible act of bravery...',
          source: "Sam's News Source",
          date: new Date(),
        },
        {
          title: 'Community Spotlight: Small Businesses Thriving',
          content: 'Small businesses in the area are seeing a resurgence thanks to community support...',
          source: "Sam's News Source",
          date: new Date(),
        },
        {
          title: 'Weather Update: Sunny Days Ahead',
          content: 'The weather forecast predicts sunny skies for the next week...',
          source: "Sam's News Source",
          date: new Date(),
        },
      ];

      await articlesCollection.insertMany(sampleArticles);
      console.log("Sample articles for 'Sam's News Source' have been added.");
    }
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
})();

function getUser(email) {
  return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function addUser(user) {
  await userCollection.insertOne(user);
}

async function updateUser(user) {
  await userCollection.updateOne({ email: user.email }, { $set: user });
}

async function getArticlesBySource(source) {
  return articlesCollection.find({ source: source }).toArray();
}

module.exports = {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
};