const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();


app.use(express.json());
app.use(express.static('.')); // Serve static files from the current directory

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Authentication endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email and password are required' 
    });
  }

  const usersFile = path.join(__dirname, 'users.txt');
  
  // Check if users file exists
  if (!fs.existsSync(usersFile)) {
    return res.status(500).json({ 
      success: false, 
      message: 'User database not found' 
    });
  }

  fs.readFile(usersFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading users file:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Server error occurred' 
      });
    }

    try {
      // Parse users data
      const users = data.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
          const parts = line.split(',');
          return { email: parts[0], password: parts[1] };
        });

      // Find matching user
      const user = users.find(u => u.email === email.trim() && u.password === password);
      
      if (user) {
        res.json({ 
          success: true, 
          message: 'Login successful',
          user: { email: user.email } // Don't send password back
        });
      } else {
        res.status(401).json({ 
          success: false, 
          message: 'Invalid email or password' 
        });
      }
    } catch (parseError) {
      console.error('Error parsing users data:', parseError);
      res.status(500).json({ 
        success: false, 
        message: 'Error processing user data' 
      });
    }
  });
});

// List all users
app.get('/api/users', (req, res) => {
  const usersFile = path.join(__dirname, 'users.txt');
  fs.readFile(usersFile, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Could not read users file' });
    }
    const users = data.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        const parts = line.split(',');
        return { email: parts[0], password: parts[1] };
      });
    res.json({ success: true, users });
  });
});

// Add a new user
app.post('/api/users', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }
  const usersFile = path.join(__dirname, 'users.txt');
  // Check for duplicate
  fs.readFile(usersFile, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ success: false, message: 'Could not read users file' });
    const exists = data.split('\n').some(line => line.split(',')[0] === email);
    if (exists) return res.status(409).json({ success: false, message: 'User already exists' });
    fs.appendFile(usersFile, `\n${email},${password}`, err => {
      if (err) return res.status(500).json({ success: false, message: 'Could not add user' });
      res.json({ success: true, message: 'User added' });
    });
  });
});

// Remove a user
app.delete('/api/users', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email required' });
  const usersFile = path.join(__dirname, 'users.txt');
  fs.readFile(usersFile, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ success: false, message: 'Could not read users file' });
    const lines = data.split('\n');
    const filtered = lines.filter(line => line.split(',')[0] !== email);
    if (lines.length === filtered.length) return res.status(404).json({ success: false, message: 'User not found' });
    fs.writeFile(usersFile, filtered.join('\n'), err => {
      if (err) return res.status(500).json({ success: false, message: 'Could not remove user' });
      res.json({ success: true, message: 'User removed' });
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to access the website`);
});