# Authentication System

A complete authentication system built with Express.js, Node.js, and Prisma.

## Features

- User registration with email and password
- User login with JWT token generation
- Password hashing with bcrypt
- Protected routes with JWT authentication middleware
- User profile management
- PostgreSQL database with Prisma ORM

## Setup Instructions

### 1. Install Dependencies

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

### 2. Database Setup

Start the Prisma Postgres database:

```bash
npx prisma dev
```

This will start a local PostgreSQL database. The DATABASE_URL in your `.env` file is already configured.

### 3. Run Database Migrations

Create the database tables:

```bash
npm run prisma:migrate
```

When prompted, give your migration a name (e.g., "init").

### 4. Start the Server

For development (with auto-reload):

```bash
npm run dev
```

For production:

```bash
npm start
```

The server will run on `http://localhost:3000` by default.

## API Endpoints

### Public Endpoints

#### Register a New User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword",
  "name": "John Doe" (optional)
}
```

Response:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt-token"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

Response:
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt-token"
}
```

### Protected Endpoints (Require Authentication)

Add the JWT token to the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

#### Get User Profile
```
GET /api/auth/profile
Authorization: Bearer <your-jwt-token>
```

Response:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Update User Profile
```
PUT /api/auth/profile
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Jane Doe"
}
```

Response:
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Jane Doe",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Environment Variables

The `.env` file contains:

- `DATABASE_URL`: PostgreSQL connection string (configured by Prisma)
- `JWT_SECRET`: Secret key for JWT token generation (change this in production!)
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)

**Important**: Change the `JWT_SECRET` to a strong, random string in production!

## Project Structure

```
├── src/
│   ├── config/
│   │   └── database.js       # Prisma client configuration
│   ├── controllers/
│   │   └── authController.js # Authentication logic
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── routes/
│   │   └── auth.js           # Authentication routes
│   └── index.js              # Express server setup
├── prisma/
│   └── schema.prisma         # Database schema
├── .env                      # Environment variables
└── package.json
```

## Useful Commands

- `npm run dev` - Start development server with auto-reload
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## Security Notes

1. **JWT_SECRET**: Change the JWT secret in production to a strong, random string
2. **Password Hashing**: Passwords are hashed using bcrypt with 10 salt rounds
3. **Token Expiration**: JWT tokens expire after 24 hours
4. **CORS**: CORS is enabled for all origins (configure for production)

## Next Steps

- Add password reset functionality
- Add email verification
- Add refresh tokens
- Add rate limiting
- Add input validation with a library like Joi or Zod
- Add more comprehensive error handling
- Add logging
- Add tests

