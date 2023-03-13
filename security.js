const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const secretKey = 'mysecretkey';

// middleware to parse JSON request body
app.use(bodyParser.json());

// middleware for authenticating token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// sample route for authenticating a user
app.post('/login', (req, res) => {
  // TODO: check user credentials and generate token
  const username = req.body.username;
  const password = req.body.password;
  if (username === 'admin' && password === 'password') {
    const user = { username: username };
    const token = jwt.sign(user, secretKey);
    res.json({ token: token });
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

// sample protected route that requires authentication
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

// start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
