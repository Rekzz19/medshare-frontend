// Simplified transaction handling for testing
// TODO: Replace with real Concordium SDK integration

// Mock SDK classes
const AccountAddress = { fromBase58: (addr) => ({ address: addr, toString: () => addr }) };
const CcdAmount = { fromMicroCcd: (amt) => ({ microCcdAmount: amt }) };
const TransactionExpiry = {
  futureMinutes: (min) => ({ expiryEpochSeconds: Date.now() / 1000 + min * 60 })
};
const AccountTransactionType = { Update: 'Update' };

// Mock signing service for server-side operations
// In production, you would handle signing differently (see transaction flow below)
const mockSigningService = {
  signTransaction: async (transactionBytes) => {
    console.log(`Mock signing transaction: ${transactionBytes.length} bytes`);
    // Return a mock signature
    return Buffer.from('mock_signature_' + Date.now());
  },

  sendTransaction: async (signedTransaction) => {
    console.log('Mock sending transaction to blockchain');
    // Return a mock transaction hash
    return 'mock_tx_hash_' + Date.now();
  }
};

/**
 * Execute a smart contract transaction (Update Contract)
 * @param {object} options - Transaction parameters
 * @returns {object} Transaction result
 */
const executeSmartContractTransaction = async (options) => {
  const {
    senderAddress,
    contractIndex,
    contractSubindex = 0n,
    receiveName,
    amount = 0n,
    parameters = {},
    client
  } = options;

  try {
    console.log(`Executing smart contract transaction:`);
    console.log(`- Sender: ${senderAddress}`);
    console.log(`- Contract: ${contractIndex}:${contractSubindex}`);
    console.log(`- Method: ${receiveName}`);

    // Create account address
    const accountAddress = AccountAddress.fromBase58(senderAddress);

    // Create CCD amount
    const ccdAmount = CcdAmount.fromMicroCcd(amount);

    // Create transaction expiry (60 minutes from now)
    const expiry = TransactionExpiry.futureMinutes(60);

    // Create transaction header
    const header = {
      expiry,
      nonce: await getNextNonce(client, accountAddress),
      sender: accountAddress
    };

    // Create update contract payload
    const payload = {
      amount: ccdAmount,
      address: { index: contractIndex, subindex: contractSubindex },
      receiveName: receiveName,
      message: {
        parameters: JSON.stringify(parameters)
      }
    };

    // Create transaction
    const transaction = {
      header,
      payload,
      type: AccountTransactionType.Update
    };

    // Convert transaction to serializable format (handle BigInts)
    const serializableTransaction = JSON.stringify(transaction, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    );

    // Sign and send transaction (mock for now)
    const signedTransaction = await mockSigningService.signTransaction(Buffer.from(serializableTransaction));
    const transactionHash = await mockSigningService.sendTransaction(signedTransaction);

    return {
      success: true,
      transactionHash,
      blockItem: {
        header,
        payload
      }
    };

  } catch (error) {
    console.error('Smart contract transaction error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get next account nonce
 * @param {object} client - Concordium client
 * @param {AccountAddress} accountAddress - Account address
 * @returns {bigint} Next nonce
 */
const getNextNonce = async (client, accountAddress) => {
  try {
    const accountInfo = await client.getAccountInfo(accountAddress);
    return accountInfo.accountNonce.nextNonce;
  } catch (error) {
    // Fallback to estimated nonce
    console.warn('Could not get nonce from blockchain, using fallback');
    return BigInt(Date.now() % 1000000);
  }
};

/**
 * Validate wallet export data
 * @param {string} walletExportJson - JSON string of wallet export
 * @returns {object} Validation result
 */
const validateWalletExport = (walletExportJson) => {
  try {
    const wallet = JSON.parse(walletExportJson);

    if (!wallet.address) {
      throw new Error('Wallet export missing address');
    }

    // Basic validation - check if it looks like a Concordium address
    if (!wallet.address.match(/^[2-9A-HJ-NP-Za-km-z]{50,52}$/)) {
      throw new Error('Invalid wallet address format');
    }

    return {
      valid: true,
      data: wallet
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message
    };
  }
};

module.exports = {
  executeSmartContractTransaction,
  validateWalletExport,
  getNextNonce,
  mockSigningService,
  // Export SDK classes
  AccountAddress,
  CcdAmount,
  TransactionExpiry,
  AccountTransactionType
};
