# Concordium Wallet Integration Setup

## Overview
This guide will help you integrate the Concordium Wallet for Web (Chrome extension) into the ConnectWallet page.

## Installation

First, install the required Concordium packages:

```bash
npm install @concordium/wallet-connectors @concordium/browser-wallet-api-helpers
```

## Implementation Steps

### 1. Import the Concordium SDK

Add these imports to `src/pages/ConnectWallet.jsx`:

```javascript
import { BrowserWalletConnector } from '@concordium/wallet-connectors'
```

### 2. Implement Wallet Connection

Replace the `handleConnectWallet` function with actual Concordium wallet connection logic:

```javascript
const handleConnectWallet = async () => {
  setIsConnecting(true)
  setError('')
  
  try {
    // Check if browser wallet is available
    if (!window.concordium) {
      throw new Error('Concordium Wallet for Web extension not found. Please install it from the Chrome Web Store.')
    }

    // Create browser wallet connector
    const connector = await BrowserWalletConnector.create()
    
    // Connect to wallet
    const connection = await connector.connect()
    
    // Get the connected account
    const account = await connection.getSelectedAccount()
    
    if (account) {
      setWalletAddress(account)
      setAccountName('Concordium Account') // You can fetch account name if available
      setIsConnected(true)
      setIsConnecting(false)
    } else {
      throw new Error('No account selected in wallet')
    }
    
  } catch (err) {
    console.error('Wallet connection error:', err)
    setError(err.message || 'Failed to connect wallet')
    setIsConnecting(false)
  }
}
```

### 3. Handle Account Changes

Add a listener for account changes:

```javascript
useEffect(() => {
  const setupWalletListener = async () => {
    if (window.concordium) {
      const connector = await BrowserWalletConnector.create()
      
      // Listen for account changes
      connector.on('accountChanged', (newAccount) => {
        if (newAccount) {
          setWalletAddress(newAccount)
        }
      })
      
      // Listen for disconnection
      connector.on('accountDisconnected', () => {
        setIsConnected(false)
        setWalletAddress('')
        setAccountName('')
      })
    }
  }
  
  setupWalletListener()
}, [])
```

## Testing

### Prerequisites
1. Install Concordium Wallet for Web extension from Chrome Web Store
2. Create or import a Concordium account in the wallet
3. Make sure you're connected to Testnet or Mainnet

### Test Flow
1. Navigate to `/connect-wallet` page
2. Click "Connect Concordium Wallet" button
3. Browser wallet extension should pop up asking for permission
4. Approve the connection
5. Your wallet address should appear on the success screen

## Resources

- [Concordium Wallet Connectors Documentation](https://www.npmjs.com/package/@concordium/wallet-connectors)
- [Concordium Browser Wallet Setup](https://docs.concordium.com/en/mainnet/docs/browser-wallet/setup-browser-wallet.html)
- [Concordium Developer Documentation](https://docs.concordium.com/)

## Current Implementation

The current skeleton includes:

1. **Connect Button**: Triggers wallet connection (placeholder implementation)
2. **Manual Entry Form**: Allows users to manually enter wallet address and account name
3. **Success Screen**: Shows connected wallet details
4. **Error Handling**: Displays connection errors
5. **Loading States**: Shows spinner during connection

## Next Steps

1. Install the Concordium packages
2. Implement the actual wallet connection logic
3. Test with Concordium Wallet for Web extension
4. Add additional features like:
   - Network selection (Mainnet/Testnet)
   - Multiple account support
   - Transaction signing
   - Balance display

