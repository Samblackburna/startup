const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();
const DB = require('./database.js');
const { getArticlesBySource } = require('./database');

const authCookieName = 'token';

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

console.log('Starting server...');

const users = [];

// As per service instructions: The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// As per service instructions
app.use(express.json());

// Cookie parser middleware for authentication tokens
app.use(cookieParser());

// Front end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// From SIMON: CreateAuth a new user
apiRouter.post('/auth/create', async (req, res) => {
  const user = await findUser('email', req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      await DB.updateUser(user);
      setAuthCookie(res, user.token);
      res.send({ email: user.email });
      return;
    } else {
      res.status(401).send({ msg: 'Unauthorized' });
    }
  }

  const newUser = await createUser(req.body.email, req.body.password);
  setAuthCookie(res, newUser.token);
  res.send({ email: newUser.email });
});

// GetAuth login an existing user
apiRouter.post('/auth/login', async (req, res) => {
  const user = await findUser('email', req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      await DB.updateUser(user);
      setAuthCookie(res, user.token);
      res.send({ email: user.email });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth logout a user
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    delete user.token;
    DB.updateUser(user);
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Middleware to verify that the user is authorized to call an endpoint
const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

apiRouter.get('/auth/status', async (req, res) => {
  console.log('Cookies:', req.cookies);
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    res.send({ email: user.email });
  } else {
    console.log('Unauthorized');
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// Begin Importing articles

// API Key: 8a96e12dfe284e6880c7d5bfac7dbedf

apiRouter.get('/articles', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (!user) {
    res.status(401).send({ msg: 'Unauthorized' });
    return;
  }

  const source = req.query.source;

  if (source === "Sam's News Source") {
    // Fetch articles from MongoDB
    try {
      const articles = await getArticlesBySource(source);
      console.log('Fetched articles from MongoDB:', articles.length)

      // Transform the articles to match frontend expectations
      const transformedArticles = articles.map((article) => ({
        title: article.title,
        subtitle: article.subtitle || '',
        newsSource: article.source || 'Unknown Source',
        authors: article.authors || 'Unknown Author(s)',
        publicationDate: article.date || new Date(),
        content: article.content || '',
        url: article.url || '#',
      }));

      res.json(transformedArticles);
    } catch (error) {
      console.error('Error fetching articles from MongoDB:', error);
      res.status(500).json({ error: 'Failed to fetch articles from database' });
    }
  } else {
    // Fetch articles from external API
    const URL = `https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=8a96e12dfe284e6880c7d5bfac7dbedf`;
    try {
      const response = await fetch(URL);
      const articles = await response.json();

      // Transform the articles to match frontend expectations
      const transformedArticles = articles.articles.map((article) => ({
        title: article.title,
        subtitle: article.description || '', // Use description as subtitle
        newsSource: article.source.name, // Use source.name as newsSource
        authors: article.author || 'Unknown', // Use author or default to 'Unknown'
        publicationDate: article.publishedAt, // Use publishedAt as publicationDate
        content: article.content || '', // Use content or default to an empty string
        url: article.url, // Full URL
      }));

      res.send(transformedArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
      res.status(500).send({ msg: 'Failed to fetch articles' });
    }
  }
});

// End Importing Articles
// Begin setting news source
apiRouter.put('/user/news-source', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (!user) {
    res.status(401).send({ msg: 'Unauthorized' });
    return;
  }

  const { newsSource } = req.body;
  if (!newsSource) {
    res.status(400).send({ msg: 'News source is required' });
    return;
  }

  user.newsSource = newsSource;
  await DB.updateUser(user);
  res.status(200).send({ msg: 'News source updated successfully' });
});
// End setting news source

apiRouter.get('/user/profile', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (!user) {
    res.status(401).send({ msg: 'Unauthorized' });
    return;
  }

  res.send({ email: user.email, newsSource: user.newsSource || '' });
});

app.get('/api/articles', async (req, res) => {
  try {
    const articles = await getArticlesBySource("Sam's News Source");
    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// From SIMON: ASYNC functions
async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  };
  await DB.addUser(user);

  return user;
}

async function findUser(field, value) {
  if (!value) return null;

  if (field === 'token') {
    return DB.getUserByToken(value);
  }
  return DB.getUser(value);
}

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
