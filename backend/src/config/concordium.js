const { ConcordiumGRPCNodeClient, detectConcordiumProvider } = require('@concordium/web-sdk');

// Create and configure Concordium Node Client
const getConcordiumClient = () => {
  const nodeUrl = process.env.CONCORDIUM_NODE_URL || 'https://grpc.testnet.concordium.com';
  return new ConcordiumGRPCNodeClient(nodeUrl);
};

// Wallet API instance (for querying wallet information)
const getWalletApi = () => {
  // In a real implementation, you'd connect to the wallet through WalletConnect
  // This is a simplified setup for development
  return null; // Web SDK handles wallet differently
};

// Helper function to convert microCCD to CCD
const microCcdToCcd = (amount) => {
  return BigInt(amount) / BigInt(1000000);
};

// Helper function to convert CCD to microCCD
const ccdToMicroCcd = (amount) => {
  return BigInt(amount) * BigInt(1000000);
};

// Test connection to Concordium node
const testConnection = async () => {
  try {
    const client = getConcordiumClient();
    const status = await client.getConsensusStatus();
    console.log('Concordium connection successful. Block height:', status.lastFinalizedBlockHeight);
    return true;
  } catch (error) {
    console.error('Concordium connection failed:', error.message);
    return false;
  }
};

module.exports = {
  getConcordiumClient,
  getWalletApi,
  microCcdToCcd,
  ccdToMicroCcd,
  testConnection
};
