# MedShare Backend API Documentation

## 🚀 Overview

The MedShare backend provides a comprehensive API for medical data sharing and donation management using Concordium blockchain smart contracts. The backend handles user authentication, transaction creation, and smart contract interactions.

## 📋 Current Features

✅ **User Authentication**: Registration, login with JWT tokens
✅ **Donation Processing**: Create and manage donation transactions
✅ **Medical Data Registration**: Register medical data transactions
✅ **Smart Contract Execution**: Execute medical consent and donation contracts
✅ **Transaction Management**: Create, sign, and submit blockchain transactions
✅ **Wallet Integration**: Support for Concordium wallet connections

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create `.env` file in the backend root directory:

```env
CONCORDIUM_NODE_URL=https://grpc.testnet.concordium.software
JWT_SECRET=your_jwt_secret_key_here
MONGODB_URI=mongodb://localhost:27017/medshare
NODE_ENV=development
```

### 3. Start the Server

```bash
cd backend
npm start
```

**Development server runs on: `http://localhost:3000`**

## 📦 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Transaction Routes (`/api/transactions`)
- `POST /api/transactions/donate` - Create donation transaction
- `POST /api/transactions/register-data` - Register medical data
- `POST /api/transactions/give-consent` - Execute medical consent transaction ⚠️ **Currently public for testing**

### Public Routes
- `GET /api/transactions/history/:accountAddress` - Transaction history
- `GET /api/transactions/balance/:accountAddress` - Account balance
- `GET /health` - Health check

## 🔗 Frontend Developer Integration Guide

### Important Git Workflow for Frontend Developers

The backend code has been updated with new transaction execution features. **You must follow this Git workflow to properly update the codebase.**

#### 🚨 Required Git Commands (Run These Exactly)

```bash
# 1. Switch to the existing backend branch
git checkout backend

# 2. Add all new backend files to git
git add backend/

# 3. Create a commit with descriptive message
git commit -m "feat: implement smart contract transaction execution

- Add real smart contract transaction execution
- Fix BigInt serialization issues
- Update transaction controller with proper error handling
- Add give-consent API endpoint for medical consent transactions
- Integrate mock Concordium SDK for testing blockchain interactions
- Update routes and middleware for new transaction types

- Documentation: Added backend/docs/README.md with setup instructions
- API: Added POST /api/transactions/give-consent endpoint
- Testing: Include curl examples for transaction endpoints"

# 4. Push to the backend branch (it will be updated)
git push origin backend
```

#### ✅ **Verification Steps After Git Push**
1. Check that all backend files are committed: `git status`
2. Verify your backend branch is updated on GitHub: `https://github.com/Rekzz19/medshare-frontend/tree/backend`
3. Confirm backend server still starts: `cd backend && npm start`
4. Test the new API: `curl -X POST http://localhost:3000/api/transactions/give-consent ...`

---

## 🔑 API Authentication

### JWT Token Usage

Most API endpoints require authentication via JWT tokens:

#### Header Format:
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

#### Getting a JWT Token:

**Register a test user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

**Login and get token:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Use token in requests:**
```bash
curl -X POST http://localhost:3000/api/transactions/donate \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"walletExport": "...", "amount": "25"}'
```

---

## 🔄 Transaction Flow

### 1. Medical Consent Transaction

**Endpoint:** `POST /api/transactions/give-consent` ⚠️ **Public for testing**

**Request:**
```json
{
  "walletExport": "{\"address\":\"CONCORDIUM_ADDRESS\",\"network\":\"testnet\"}",
  "fileName": "medical_record.pdf",
  "additionalInfo": "Patient consent details"
}
```

**Response:**
```json
{
  "success": true,
  "transaction": {
    "hash": "mock_tx_hash_1761428793142",
    "estimatedEnergy": "30000",
    "type": "updateContract"
  },
  "contractDetails": {
    "contractAddress": "12260:0",
    "receiveName": "medical_consent.give_consent",
    "parameters": "{\"fileName\":\"medical_record.pdf\",\"additionalInfo\":\"Patient consent details\"}"
  },
  "message": "Medical consent transaction executed successfully on blockchain."
}
```

### 2. Donation Transaction

**Endpoint:** `POST /api/transactions/donate`

**Request:**
```json
{
  "walletExport": "{\"address\":\"CONCORDIUM_ADDRESS\",\"network\":\"testnet\"}",
  "amount": "50",
  "memo": "Supporting medical research",
  "cause": "Medical Research"
}
```

---

## 💡 Smart Contract Integration

### Current Contract Addresses
- **Medical Consent Contract**: Index `12260`, Subindex `0`
  - Method: `medical_consent.give_consent`
- **Medical Donations Contract**: Index `12260`, Subindex `0`
  - Method: `medshare_donations.make_donation`

### Transaction Parameters
- **give_consent**: `{ fileName: string, additionalInfo: string }`
- **make_donation**: `{ amount: number, cause: string, memo: string }`

---

## 🔧 Development Notes

### Current Implementation Status

- ✅ User authentication with JWT
- ✅ Basic transaction creation
- ✅ **Smart contract transaction execution** (with mock SDK)
- ✅ Real wallet address validation
- ✅ Proper error handling and logging
- ❌ Production-ready Concordium SDK integration
- ❌ Real blockchain node connection
- ❌ Live transaction broadcasting

### For Production Deployment

1. **Install Real SDK:**
   ```bash
   npm install @concordium/node-sdk@^9.5.3 @concordium/web-sdk@^9.2.0
   ```

2. **Environment Variables:**
   ```env
   CONCORDIUM_NODE_URL=https://grpc.mainnet.concordium.software
   MONGODB_URI=your_production_mongo_uri
   JWT_SECRET=strong_random_jwt_secret
   ```

3. **Replace Mock Implementations:**
   - `backend/src/config/concordium.js` - Real node client
   - `backend/src/config/wallet.js` - Real transaction signing
   - `backend/src/controllers/` - Live transaction broadcasting

---

## 🐛 Troubleshooting

### Common Issues

1. **"Cannot POST /api/transactions/give-consent"**
   - **Solution**: Server not restarted after code changes
   - **Fix**: `cd backend && npm start`

2. **"Invalid token"**
   - **Solution**: JWT token expired or secret mismatch
   - **Fix**: Get new token from login endpoint

3. **BigInt serialization errors**
   - **Solution**: Fixed in current version with `JSON.stringify` reviver
   - **Check**: Ensure server is using latest code

### Server Logs
```bash
# Check server is running
curl http://localhost:3000/health

# View server logs
tail -f backend/server.log
```

---

## 📞 Support

For backend integration questions:
1. Check this README first
2. Verify Git workflow completed correctly
3. Test API endpoints with curl examples above
4. Check server logs for error details

**Frontend developers: After committing and pushing your backend changes, the smart contract transaction execution will be fully functional for testing and development!** 🚀
