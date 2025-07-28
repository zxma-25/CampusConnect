# CampusConnect Authentication System

This website now uses a file-based authentication system with the `users.txt` file.

## How Authentication Works

1. **User Credentials Storage**: User credentials are stored in `users.txt` in the format `email,password` (one user per line)
2. **Login Process**: Users can sign in through the modal on the homepage
3. **Authentication**: The server validates credentials against the `users.txt` file
4. **Session**: Upon successful login, user information is stored in the browser's session storage

## Sample Users

The following test users are available in `users.txt`:
- `admin@campus.edu` / `admin123`
- `student1@campus.edu` / `password123`
- `student2@campus.edu` / `mypassword`
- `teacher@campus.edu` / `teachpass`
- `lesedi.mahlangu@campus.edu` / `lesedi2024`

## Running the Application

1. Install dependencies: `npm install`
2. Start the server: `node server.js`
3. Open your browser to `http://localhost:3000`
4. Click the sign-in modal and use any of the sample credentials

## Adding New Users

To add new users, simply add new lines to `users.txt` in the format:
```
email@domain.com,password
```

**Note**: This is a demo authentication system. In production, passwords should be hashed and stored securely.

## Features

- ✅ File-based user authentication
- ✅ Login modal with validation
- ✅ Error handling for invalid credentials
- ✅ Session storage for logged-in users
- ✅ Responsive design
- ✅ Enter key support for login form