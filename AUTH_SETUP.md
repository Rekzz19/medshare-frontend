# Authentication Setup Guide

This document explains how the authentication system is implemented in the MedShare frontend application.

## Overview

The authentication system is fully integrated with the backend API and includes:
- User registration
- User login
- Protected routes
- User profile management
- Token-based authentication with JWT
- Automatic token refresh handling

## Architecture

### 1. API Service (`src/services/api.js`)
- Axios instance configured with base URL (`http://localhost:3000`)
- Automatic token injection in request headers
- Automatic token expiration handling
- Redirects to login on 401 errors

### 2. Auth Context (`src/context/AuthContext.jsx`)
- Global authentication state management
- Provides authentication methods to all components
- Persists user data in localStorage
- Validates token on app load

### 3. Protected Routes (`src/components/ProtectedRoute.jsx`)
- Wrapper component for routes that require authentication
- Redirects unauthenticated users to login page
- Shows loading state while checking authentication

## Features Implemented

### ✅ User Registration
- **Page:** `/signup`
- **Features:**
  - Full name, email, password fields
  - Password confirmation validation
  - Password strength validation (min 6 characters)
  - Error handling with user-friendly messages
  - Automatic login after successful registration
  - Google OAuth signup button (centered)

### ✅ User Login
- **Page:** `/login`
- **Features:**
  - Email and password fields
  - Show/hide password toggle
  - Remember me checkbox
  - Forgot password link (UI only)
  - Error handling with user-friendly messages
  - Automatic redirect to home after login
  - Social login UI (Google, GitHub)

### ✅ User Dashboard
- **Page:** `/dashboard` (Protected)
- **Features:**
  - Display user profile information
  - Edit profile name
  - View account statistics
  - Member since date
  - Last updated date

### ✅ Navigation Bar
- **Dynamic display based on auth state:**
  - **Not authenticated:** Shows Login and Sign Up buttons
  - **Authenticated:** Shows user name and Logout button
- **Features:**
  - User icon with name display
  - Logout functionality
  - Smooth transitions

### ✅ Landing Page
- **Dynamic "Get Started" button:**
  - Redirects to `/signup` if not authenticated
  - Redirects to `/dashboard` if authenticated

## How to Use

### Starting the Backend

1. Make sure the backend server is running:
```bash
cd backend
npm run dev
```

The backend should be running on `http://localhost:3000`

### Starting the Frontend

1. Install dependencies (if not already done):
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to the URL shown (usually `http://localhost:5173`)

## Testing the Authentication Flow

### 1. Register a New User
1. Click "Sign Up" in the navigation bar
2. Fill in the form:
   - Full Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
3. Check "I agree to the Terms of Service and Privacy Policy"
4. Click "Create Account"
5. You should be automatically logged in and redirected to the home page

### 2. Login with Existing User
1. Click "Logout" if you're logged in
2. Click "Login" in the navigation bar
3. Enter your credentials:
   - Email: `john@example.com`
   - Password: `password123`
4. Click "Sign In"
5. You should be logged in and redirected to the home page

### 3. Access Protected Dashboard
1. Make sure you're logged in
2. Click "Go to Dashboard" on the home page (or navigate to `/dashboard`)
3. You should see your profile information
4. Try editing your name and saving

### 4. Test Protected Route
1. Logout if you're logged in
2. Try to access `/dashboard` directly
3. You should be automatically redirected to `/login`

## Authentication Methods Available

### From `useAuth()` Hook

```javascript
import { useAuth } from '../context/AuthContext'

function MyComponent() {
  const { 
    user,              // Current user object
    loading,           // Loading state
    isAuthenticated,   // Boolean: is user logged in?
    login,             // Function: login(email, password)
    register,          // Function: register(email, password, name)
    logout,            // Function: logout()
    updateProfile      // Function: updateProfile(name)
  } = useAuth()
  
  // Use these methods in your component
}
```

### Example: Login

```javascript
const handleLogin = async () => {
  const result = await login('user@example.com', 'password123')
  
  if (result.success) {
    console.log('Login successful!', result.data)
    // Redirect or update UI
  } else {
    console.error('Login failed:', result.error)
    // Show error message
  }
}
```

### Example: Register

```javascript
const handleRegister = async () => {
  const result = await register('user@example.com', 'password123', 'John Doe')
  
  if (result.success) {
    console.log('Registration successful!', result.data)
    // Redirect or update UI
  } else {
    console.error('Registration failed:', result.error)
    // Show error message
  }
}
```

### Example: Update Profile

```javascript
const handleUpdate = async () => {
  const result = await updateProfile('New Name')
  
  if (result.success) {
    console.log('Profile updated!', result.data)
  } else {
    console.error('Update failed:', result.error)
  }
}
```

## Token Management

### Storage
- Tokens are stored in `localStorage` under the key `authToken`
- User data is stored in `localStorage` under the key `user`

### Automatic Handling
- Tokens are automatically added to all API requests via axios interceptor
- Expired tokens trigger automatic logout and redirect to login page
- Token validation happens on app load

### Manual Token Access
```javascript
// Get token
const token = localStorage.getItem('authToken')

// Get user data
const user = JSON.parse(localStorage.getItem('user'))

// Clear auth data (logout)
localStorage.removeItem('authToken')
localStorage.removeItem('user')
```

## Error Handling

All authentication methods return a result object:

```javascript
{
  success: true/false,
  data: { ... },      // On success
  error: "message"    // On failure
}
```

Common errors:
- `"Invalid credentials"` - Wrong email or password
- `"User already exists"` - Email already registered
- `"Email and password are required"` - Missing fields
- `"Token expired"` - Session expired, need to login again

## Security Features

1. **JWT Token Authentication** - Secure token-based auth
2. **Password Validation** - Minimum 6 characters required
3. **Automatic Token Expiration** - Tokens expire after 24 hours
4. **Protected Routes** - Unauthorized access blocked
5. **HTTPS Ready** - Works with HTTPS in production
6. **CORS Enabled** - Backend configured for cross-origin requests

## Customization

### Change API Base URL

Edit `src/services/api.js`:
```javascript
const API_BASE_URL = 'https://your-production-api.com'
```

### Add More Protected Routes

Edit `src/main.jsx`:
```javascript
<Route 
  path="/your-route" 
  element={
    <ProtectedRoute>
      <YourComponent />
    </ProtectedRoute>
  } 
/>
```

### Customize Token Storage

Edit `src/context/AuthContext.jsx` to use `sessionStorage` instead:
```javascript
// Replace localStorage with sessionStorage
sessionStorage.setItem('authToken', data.token)
sessionStorage.setItem('user', JSON.stringify(data.user))
```

## Troubleshooting

### "Network Error" or "Failed to fetch"
- Make sure the backend server is running on `http://localhost:3000`
- Check CORS configuration in the backend

### "Token expired" immediately after login
- Check that backend and frontend times are synchronized
- Verify JWT secret is configured correctly in backend

### Redirected to login after refresh
- Check browser console for errors
- Verify token is being stored in localStorage
- Check that backend `/api/auth/profile` endpoint is working

## Next Steps

Consider implementing:
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Social authentication (Google, GitHub OAuth)
- [ ] Two-factor authentication
- [ ] Session timeout warnings
- [ ] Remember me functionality with longer token expiration
- [ ] User roles and permissions

## Support

For issues or questions:
1. Check the browser console for errors
2. Check the backend logs
3. Verify API endpoints are responding correctly
4. Review the FRONTEND_INTEGRATION.md document

