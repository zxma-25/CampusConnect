const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Enable CORS for all origins
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const usersFile = path.join(__dirname, 'users.txt');
  fs.readFile(usersFile, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Server error');
    const users = data.split('\n').map(line => line.trim().split(','));
    const user = users.find(u => u[0] === email && u[1] === password);
    if (user) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));