# Frontend Integration Guide

This guide will help you connect your frontend application to this authentication backend.

## Table of Contents
- [API Base URL](#api-base-url)
- [Authentication Flow](#authentication-flow)
- [API Endpoints](#api-endpoints)
- [JavaScript/React Examples](#javascriptreact-examples)
- [Token Management](#token-management)
- [Error Handling](#error-handling)
- [CORS Configuration](#cors-configuration)

---

## API Base URL

```
http://localhost:3000
```

For production, replace with your deployed backend URL.

---

## Authentication Flow

1. **User Registration** → Receive JWT token
2. **User Login** → Receive JWT token
3. **Store Token** → Save in localStorage/sessionStorage
4. **Include Token** → Send in Authorization header for protected routes
5. **Handle Expiration** → Token expires after 24 hours

---

## API Endpoints

### Public Endpoints (No Authentication Required)

#### 1. Register User
- **URL:** `POST /api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```
- **Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-10-25T12:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 2. Login User
- **URL:** `POST /api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-10-25T12:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Protected Endpoints (Authentication Required)

**All protected endpoints require the Authorization header:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### 3. Get User Profile
- **URL:** `GET /api/auth/profile`
- **Headers:** `Authorization: Bearer YOUR_TOKEN`
- **Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-10-25T12:00:00.000Z",
    "updatedAt": "2024-10-25T12:00:00.000Z"
  }
}
```

#### 4. Update User Profile
- **URL:** `PUT /api/auth/profile`
- **Headers:** 
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_TOKEN`
- **Body:**
```json
{
  "name": "Updated Name"
}
```
- **Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Updated Name",
    "createdAt": "2024-10-25T12:00:00.000Z",
    "updatedAt": "2024-10-25T12:05:00.000Z"
  }
}
```

---

## JavaScript/React Examples

### 1. Vanilla JavaScript (Fetch API)

#### Register User
```javascript
async function registerUser(email, password, name) {
  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (response.ok) {
      // Save token to localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('Registration successful:', data);
      return data;
    } else {
      console.error('Registration failed:', data.error);
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Usage
registerUser('user@example.com', 'password123', 'John Doe');
```

#### Login User
```javascript
async function loginUser(email, password) {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Save token to localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('Login successful:', data);
      return data;
    } else {
      console.error('Login failed:', data.error);
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Usage
loginUser('user@example.com', 'password123');
```

#### Get User Profile
```javascript
async function getUserProfile() {
  try {
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch('http://localhost:3000/api/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Profile:', data.user);
      return data.user;
    } else {
      console.error('Failed to get profile:', data.error);
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Usage
getUserProfile();
```

#### Update User Profile
```javascript
async function updateUserProfile(name) {
  try {
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch('http://localhost:3000/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    const data = await response.json();

    if (response.ok) {
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('Profile updated:', data.user);
      return data.user;
    } else {
      console.error('Failed to update profile:', data.error);
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Usage
updateUserProfile('New Name');
```

#### Logout User
```javascript
function logoutUser() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  console.log('User logged out');
  // Redirect to login page
  window.location.href = '/login';
}

// Usage
logoutUser();
```

---

### 2. React Example with Axios

First, install axios:
```bash
npm install axios
```

#### Create an API service file (`src/services/api.js`)

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  // Register user
  register: async (email, password, name) => {
    const response = await api.post('/api/auth/register', { email, password, name });
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (name) => {
    const response = await api.put('/api/auth/profile', { name });
    return response.data;
  },
};

export default api;
```

#### React Component Example

```javascript
import React, { useState } from 'react';
import { authAPI } from './services/api';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authAPI.login(email, password);
      
      // Save token and user data
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      console.log('Login successful:', data);
      // Redirect to dashboard or home page
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

export default LoginForm;
```

---

## Token Management

### Storing the Token

**Option 1: localStorage (Persists across browser sessions)**
```javascript
localStorage.setItem('authToken', token);
```

**Option 2: sessionStorage (Cleared when browser closes)**
```javascript
sessionStorage.setItem('authToken', token);
```

### Retrieving the Token
```javascript
const token = localStorage.getItem('authToken');
```

### Removing the Token (Logout)
```javascript
localStorage.removeItem('authToken');
localStorage.removeItem('user');
```

### Checking if User is Authenticated
```javascript
function isAuthenticated() {
  const token = localStorage.getItem('authToken');
  return !!token;
}
```

---

## Error Handling

### Common Error Responses

| Status Code | Error | Meaning |
|-------------|-------|---------|
| 400 | Email and password are required | Missing required fields |
| 400 | User already exists | Email already registered |
| 401 | Invalid credentials | Wrong email or password |
| 401 | No token provided | Missing Authorization header |
| 401 | Invalid token | Token is malformed or invalid |
| 401 | Token expired | Token has expired (24 hours) |
| 404 | User not found | User doesn't exist |
| 500 | Registration/Login failed | Server error |

### Example Error Handling
```javascript
try {
  const data = await loginUser(email, password);
} catch (error) {
  if (error.message === 'Invalid credentials') {
    alert('Wrong email or password');
  } else if (error.message === 'Token expired') {
    alert('Session expired. Please login again');
    // Redirect to login
  } else {
    alert('An error occurred. Please try again');
  }
}
```

---

## CORS Configuration

The backend is already configured to accept requests from any origin (CORS enabled).

If you need to restrict CORS to specific origins in production, update `src/index.js`:

```javascript
// Replace this:
app.use(cors());

// With this:
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
}));
```

---

## Complete Frontend Example (HTML + JavaScript)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Auth Demo</title>
</head>
<body>
  <div id="auth-section">
    <h2>Login</h2>
    <input type="email" id="email" placeholder="Email">
    <input type="password" id="password" placeholder="Password">
    <button onclick="login()">Login</button>
    <button onclick="register()">Register</button>
  </div>

  <div id="profile-section" style="display: none;">
    <h2>Profile</h2>
    <p id="user-info"></p>
    <input type="text" id="new-name" placeholder="New Name">
    <button onclick="updateProfile()">Update Name</button>
    <button onclick="logout()">Logout</button>
  </div>

  <script>
    const API_URL = 'http://localhost:3000';

    // Check if user is logged in on page load
    window.onload = function() {
      const token = localStorage.getItem('authToken');
      if (token) {
        showProfile();
      }
    };

    async function login() {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          showProfile();
        } else {
          alert(data.error);
        }
      } catch (error) {
        alert('Login failed');
      }
    }

    async function register() {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name: 'User' })
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          showProfile();
        } else {
          alert(data.error);
        }
      } catch (error) {
        alert('Registration failed');
      }
    }

    function showProfile() {
      const user = JSON.parse(localStorage.getItem('user'));
      document.getElementById('auth-section').style.display = 'none';
      document.getElementById('profile-section').style.display = 'block';
      document.getElementById('user-info').textContent = 
        `Email: ${user.email}, Name: ${user.name}`;
    }

    async function updateProfile() {
      const name = document.getElementById('new-name').value;
      const token = localStorage.getItem('authToken');

      try {
        const response = await fetch(`${API_URL}/api/auth/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ name })
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('user', JSON.stringify(data.user));
          showProfile();
          alert('Profile updated!');
        } else {
          alert(data.error);
        }
      } catch (error) {
        alert('Update failed');
      }
    }

    function logout() {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      document.getElementById('auth-section').style.display = 'block';
      document.getElementById('profile-section').style.display = 'none';
    }
  </script>
</body>
</html>
```

---

## Quick Start Checklist

- [ ] Make sure backend is running (`npm run dev`)
- [ ] Update API_BASE_URL in your frontend code
- [ ] Implement register/login functions
- [ ] Store JWT token in localStorage after successful auth
- [ ] Include token in Authorization header for protected routes
- [ ] Handle token expiration (401 errors)
- [ ] Implement logout functionality
- [ ] Test all endpoints

---

## Need Help?

- Check that the backend server is running on `http://localhost:3000`
- Verify CORS is enabled (already configured)
- Check browser console for errors
- Use browser DevTools Network tab to inspect requests/responses
- Make sure you're sending the correct headers and body format

Happy coding! 🚀

