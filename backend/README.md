# MedShare Backend

A Node.js backend server with Concordium blockchain integration for the MedShare medical data sharing platform.

## Features

- **Authentication**: JWT-based user authentication with registration and login
- **Concordium Integration**: Create various blockchain transactions including:
  - CCD transfers (donations) with optional memos
  - Register medical data on blockchain
  - Account balance querying
  - Transaction history (basic implementation)
- **Security**: Password hashing, JWT tokens, input validation
- **API**: RESTful endpoints with proper error handling

## Quick Start

### Installation

```bash
cd backend
npm install
```

### Environment Setup

Copy `.env` and configure as needed:

```bash
cp .env.example .env
# Edit .env with your settings
```

### Development

```bash
npm run dev  # Runs with nodemon
```

### Production

```bash
npm start
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | User login | ❌ |
| `GET` | `/api/auth/profile` | Get user profile | ✅ |
| `PUT` | `/api/auth/profile` | Update profile | ✅ |

### Transactions

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/transactions/donate` | Create donation transaction | ✅ |
| `POST` | `/api/transactions/register-data` | Register medical data | ✅ |
| `GET` | `/api/transactions/history/:accountAddress` | Get transaction history | ❌ |
| `GET` | `/api/transactions/balance/:accountAddress` | Get account balance | ❌ |

### Health Check

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/health` | Server health check | ❌ |

## Usage Examples

### User Registration

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"John Doe"}'
```

### Create Donation Transaction

```bash
curl -X POST http://localhost:3000/api/transactions/donate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "walletExport": "{\"address\":\"your-wallet-address\"}",
    "toAddress": "recipient-wallet-address",
    "amount": "5",
    "memo": "Cancer Research Donation",
    "cause": "cancer-research"
  }'
```

## Architecture

```
/backend
├── src/
│   ├── config/          # Concordium & wallet configuration
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth middleware
│   ├── models/          # User model
│   └── routes/          # API routes
├── package.json
├── .env                 # Environment variables
└── README.md
```

## Dependencies

- **Express**: Web framework
- **@concordium/web-sdk**: Concordium blockchain integration
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **cors**: Cross-origin requests

## Environment Variables

```bash
PORT=3000
JWT_SECRET=your-secret-key
CONCORDIUM_NODE_URL=https://grpc.testnet.concordium.com
CONCORDIUM_NETWORK=testnet
```

## Security Notes

- Change the JWT secret in production
- Use HTTPS in production
- Implement rate limiting for production
- Store user data in a proper database (MongoDB/PostgreSQL)
- Validate wallet exports more thoroughly in production

## License

ISC
