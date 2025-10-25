const {
  getConcordiumClient,
  microCcdToCcd,
  ccdToMicroCcd
} = require('../config/concordium');
const {
  parseWalletExport,
  createAccountSigner,
  createAccountAddress,
  createCcdAmount,
  createExpiry,
  createDataBlob,
  isValidAccountAddress,
  isValidCcdAmount,
  AccountTransactionType,
  AccountTransactionHeader,
  AccountTransaction
} = require('../config/wallet');

const transactionController = {
  // Create a donation (transfer) transaction
  async createDonation(req, res) {
    try {
      const {
        walletExport,       // Wallet export JSON string
        toAddress,         // Recipient account address
        amount,            // Amount in CCD (not microCCD)
        memo,              // Optional memo for the donation
        cause              // Medical cause for the donation (for context)
      } = req.body;

      // Validate required fields
      if (!walletExport || !toAddress || !amount) {
        return res.status(400).json({
          error: 'Wallet export, recipient address, and amount are required'
        });
      }

      // Validate address
      if (!isValidAccountAddress(toAddress)) {
        return res.status(400).json({ error: 'Invalid recipient address' });
      }

      // Validate amount
      if (!isValidCcdAmount(amount)) {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      // Parse wallet
      const parsedWallet = parseWalletExport(walletExport);
      const senderAddress = createAccountAddress(parsedWallet.value.address);

      // Get Concordium client
      const client = getConcordiumClient();

      // Get next nonce
      const nextNonce = await client.getNextAccountNonce(senderAddress);

      // Create transaction header
      const header = new AccountTransactionHeader({
        expiry: createExpiry(),
        nonce: nextNonce.nonce,
        sender: senderAddress
      });

      // Convert amount to microCCD
      const amountMicroCcd = ccdToMicroCcd(amount);

      // Create transfer payload
      const transferPayload = {
        amount: createCcdAmount(amountMicroCcd.toString()),
        toAddress: createAccountAddress(toAddress)
      };

      // Add memo if provided
      if (memo) {
        transferPayload.memo = createDataBlob(memo);
      }

      // Create account transaction
      const accountTransaction = new AccountTransaction({
        header,
        payload: transferPayload,
        type: AccountTransactionType.Transfer
      });

      // Build signer
      const signer = createAccountSigner(parsedWallet);

      // Sign transaction (get bytes for frontend)
      const transactionBuffer = accountTransaction.toBytes();

      // Calculate energy cost (simplified - in real app, you'd calculate properly)
      const estimatedEnergy = 300n; // Rough estimate for transfer

      // Return transaction data for frontend to sign and submit
      res.json({
        transaction: {
          bytes: transactionBuffer.toString('hex'), // Send as hex for frontend
          hash: '', // Would calculate hash if needed
          estimatedEnergy: estimatedEnergy.toString()
        },
        transactionDetails: {
          from: senderAddress.address,
          to: toAddress,
          amount: amount.toString(),
          amountMicroCcd: amountMicroCcd.toString(),
          fee: '0', // Estimate based on energy
          memo: memo || null,
          cause: cause || null,
          expiry: header.expiry.expiryEpochSeconds.toString(),
          nonce: nextNonce.nonce.toString()
        },
        message: 'Transaction prepared. Use Concordium Wallet to sign and submit.'
      });
    } catch (error) {
      console.error('Create donation error:', error);
      res.status(500).json({
        error: error.message || 'Failed to create donation transaction'
      });
    }
  },

  // Register medical data (RegisterData transaction)
  async registerMedicalData(req, res) {
    try {
      const {
        walletExport,       // Wallet export JSON string
        data,              // Medical data to register (as hex string)
        dataType          // Type of medical data (for organization)
      } = req.body;

      // Validate required fields
      if (!walletExport || !data) {
        return res.status(400).json({
          error: 'Wallet export and data are required'
        });
      }

      // Parse wallet
      const parsedWallet = parseWalletExport(walletExport);
      const accountAddress = createAccountAddress(parsedWallet.value.address);

      // Get Concordium client
      const client = getConcordiumClient();

      // Get next nonce
      const nextNonce = await client.getNextAccountNonce(accountAddress);

      // Create transaction header
      const header = new AccountTransactionHeader({
        expiry: createExpiry(),
        nonce: nextNonce.nonce,
        sender: accountAddress
      });

      // Create data payload
      const dataPayload = {
        data: createDataBlob(data)
      };

      // Create account transaction for register data
      const accountTransaction = new AccountTransaction({
        header,
        payload: dataPayload,
        type: AccountTransactionType.RegisterData
      });

      // Build signer
      const signer = createAccountSigner(parsedWallet);

      // Get transaction bytes
      const transactionBuffer = accountTransaction.toBytes();

      // Calculate energy cost (simplified)
      const estimatedEnergy = 700n; // Rough estimate for register data

      res.json({
        transaction: {
          bytes: transactionBuffer.toString('hex'),
          hash: '',
          estimatedEnergy: estimatedEnergy.toString()
        },
        transactionDetails: {
          account: accountAddress.address,
          dataLength: data.length / 2, // Hex length / 2 = bytes
          dataType: dataType || 'medical-record',
          fee: '0', // Estimate based on energy
          expiry: header.expiry.expiryEpochSeconds.toString(),
          nonce: nextNonce.nonce.toString()
        },
        message: 'Register data transaction prepared. Use Concordium Wallet to sign and submit.'
      });
    } catch (error) {
      console.error('Register medical data error:', error);
      res.status(500).json({
        error: error.message || 'Failed to create register data transaction'
      });
    }
  },

  // Get transaction history for an account
  async getTransactionHistory(req, res) {
    try {
      const { accountAddress } = req.params;

      // Validate account address
      if (!isValidAccountAddress(accountAddress)) {
        return res.status(400).json({ error: 'Invalid account address' });
      }

      const client = getConcordiumClient();
      const address = createAccountAddress(accountAddress);

      // Get recent transactions (simplified - in production would need pagination)
      // This is a basic implementation - real apps would use better querying

      // For now, return empty array as getting full transaction history requires
      // more complex blockchain querying that goes beyond this demo
      const transactions = [];

      res.json({
        account: accountAddress,
        transactions,
        count: 0,
        note: 'Transaction history querying would require advanced blockchain indexing in production'
      });
    } catch (error) {
      console.error('Get transaction history error:', error);
      res.status(500).json({
        error: error.message || 'Failed to get transaction history'
      });
    }
  },

  // Get account balance
  async getAccountBalance(req, res) {
    try {
      const { accountAddress } = req.params;

      // Validate account address
      if (!isValidAccountAddress(accountAddress)) {
        return res.status(400).json({ error: 'Invalid account address' });
      }

      const client = getConcordiumClient();
      const address = createAccountAddress(accountAddress);

      // Get account info
      const accountInfo = await client.getAccountInfo(address);

      if (!accountInfo) {
        return res.status(404).json({ error: 'Account not found on blockchain' });
      }

      const balanceMicroCcd = accountInfo.accountAmount.microCcdAmount.toString();
      const balanceCcd = microCcdToCcd(balanceMicroCcd).toString();

      res.json({
        account: accountAddress,
        balance: {
          ccd: balanceCcd,
          microCcd: balanceMicroCcd
        },
        nonce: accountInfo.accountNonce.nonce.toString()
      });
    } catch (error) {
      console.error('Get account balance error:', error);
      res.status(500).json({
        error: error.message || 'Failed to get account balance'
      });
    }
  }
};

module.exports = transactionController;
