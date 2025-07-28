# CampusConnect Authentication System

This website uses a client-side file-based authentication system that works with GitHub Pages and static hosting.

## How Authentication Works

1. **User Credentials Storage**: User credentials are stored in `users.txt` in the format `email,password` (one user per line)
2. **Login Process**: Users can sign in through the modal on the homepage
3. **Authentication**: JavaScript fetches and validates credentials against the `users.txt` file client-side
4. **Session**: Upon successful login, user information is stored in the browser's session storage
5. **GitHub Pages Compatible**: No server required - works with static hosting platforms

## Sample Users

The following test users are available in `users.txt`:
- `admin@campus.edu` / `admin123`
- `student1@campus.edu` / `password123`
- `student2@campus.edu` / `mypassword`
- `teacher@campus.edu` / `teachpass`
- `lesedi.mahlangu@campus.edu` / `lesedi2024`

## Running the Application

### Option 1: GitHub Pages (Recommended)
1. Push the files to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Visit your GitHub Pages URL
4. Use any of the sample credentials to sign in

### Option 2: Local Development with Server
1. Install dependencies: `npm install`
2. Start the server: `node server.js`
3. Open your browser to `http://localhost:3000`
4. Use any of the sample credentials to sign in

### Option 3: Local Static Files
1. Simply open `index.html` in your browser
2. Use any of the sample credentials to sign in
3. Note: Some browsers may block file:// requests, use a local server if needed

## Adding New Users

To add new users, simply add new lines to `users.txt` in the format:
```
email@domain.com,password
```

**Note**: This is a demo authentication system. In production, passwords should be hashed and stored securely.

## Features

- ✅ Client-side file-based authentication
- ✅ GitHub Pages compatible (no server required)
- ✅ Login modal with validation
- ✅ Error handling for invalid credentials
- ✅ Session storage for logged-in users
- ✅ Automatic login state persistence
- ✅ Logout functionality with session cleanup
- ✅ Responsive design
- ✅ Enter key support for login form
- ✅ Dynamic UI updates after login