const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();
const fetch = require('node-fetch');
require('dotenv').config();
const cors = require('cors');
app.use(cors());

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

console.log('Starting server...');

const authCookieName = 'token';

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
  if (await findUser('email', req.body.email)) {
    res.status(409).send({ msg: 'That User Already Exists' });
  } else {
    const user = await createUser(req.body.email, req.body.password);

    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  }
});

// GetAuth login an existing user
apiRouter.post('/auth/login', async (req, res) => {

  const user = await findUser('email', req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
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
});

// End Importing Articles

// From SIMON: ASYNC functions
async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  };
  users.push(user);

  return user;
}

async function findUser(field, value) {
  if (!value) return null;

  return users.find((u) => u[field] === value);
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
