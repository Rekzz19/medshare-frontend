const { getConcordiumClient } = require('../config/concordium');
const { executeSmartContractTransaction, validateWalletExport } = require('../config/wallet');

const transactionController = {
  // Create a donation (smart contract update) transaction
  async createDonation(req, res) {
    try {
      const {
        walletExport,       // Wallet export JSON string
        toAddress,         // Recipient account address (not used for contracts)
        amount,            // Amount in CCD (not microCCD)
        memo,              // Optional memo for the donation
        cause              // Medical cause for the donation (for context)
      } = req.body;

      // Validate required fields
      if (!walletExport || !amount) {
        return res.status(400).json({
          error: 'Wallet export and amount are required'
        });
      }

      // Validate amount (basic validation)
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        return res.status(400).json({ error: 'Invalid amount - must be a positive number' });
      }

      // Parse wallet address
      let senderAddress = '4ZJBYQbVp3zVZyjCXfZAAYBVkJMyVj8UKUNj9ox5YqTCBdBq2M'; // Mock sender address
      try {
        const wallet = JSON.parse(walletExport);
        senderAddress = wallet.address || senderAddress;
      } catch (e) {
        console.log('Using mock wallet address for demo');
      }

      // Smart contract details for medical donations
      const donationContract = {
        index: 12260n, // Mock contract index
        subindex: 0n
      };
      const receiveName = 'medshare_donations.make_donation'; // Contract method
      const maxContractExecutionEnergy = 10000n;

      // Parameters for the smart contract call
      const contractParams = {
        amount: numAmount * 1000000, // Convert CCD to microCCD
        cause: cause || 'general',
        memo: memo || null
      };

      console.log('Creating smart contract donation transaction:', {
        sender: senderAddress,
        contract: donationContract,
        method: receiveName,
        params: contractParams,
        amount: numAmount
      });

      // Generate mock smart contract transaction data
      const mockTransactionBytes = `sc_donation_bytes_${Date.now()}`;
      const mockNonce = Date.now() % 1000;
      const mockExpiry = Math.floor(Date.now() / 1000) + 3600;

      // Return smart contract transaction data
      res.json({
        transaction: {
          bytes: mockTransactionBytes,
          hash: `sc_donation_hash_${Date.now()}`,
          estimatedEnergy: '10000', // Higher energy for contract calls
          type: 'updateContract'
        },
        contractDetails: {
          contractAddress: `${donationContract.index.toString()}:${donationContract.subindex.toString()}`,
          receiveName: receiveName,
          maxContractExecutionEnergy: maxContractExecutionEnergy.toString(),
          parameters: JSON.stringify(contractParams)
        },
        transactionDetails: {
          from: senderAddress,
          contract: `${donationContract.index.toString()}:${donationContract.subindex.toString()}`,
          amount: numAmount.toString(), // CCD sent to contract
          amountMicroCcd: (numAmount * 1000000).toString(),
          fee: '0.01', // Mock higher fee for contract execution
          memo: memo || null,
          cause: cause || null,
          method: 'make_donation',
          expiry: mockExpiry.toString(),
          nonce: mockNonce.toString()
        },
        message: 'Smart contract donation transaction prepared. Use Concordium Wallet to sign and submit.'
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

      // Parse wallet (simplified - in production would validate properly)
      let accountAddress = '4ZJBYQbVp3zVZyjCXfZAAYBVkJMyVj8UKUNj9ox5YqTCBdBq2M'; // Mock account address
      try {
        const wallet = JSON.parse(walletExport);
        accountAddress = wallet.address || accountAddress;
      } catch (e) {
        // If parsing fails, use default mock address
        console.log('Using mock wallet address for demo');
      }

      // Validate data (basic validation)
      if (typeof data !== 'string' || data.length === 0) {
        return res.status(400).json({ error: 'Data must be a valid hexadecimal string' });
      }

      // Generate mock transaction data (simplified for demo)
      const mockTransactionBytes = `mock_register_data_bytes_${Date.now()}`;
      const mockNonce = Date.now() % 1000; // Mock nonce
      const mockExpiry = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

      res.json({
        transaction: {
          bytes: mockTransactionBytes,
          hash: `mock_register_hash_${Date.now()}`,
          estimatedEnergy: '700'
        },
        transactionDetails: {
          account: accountAddress,
          dataLength: data.length / 2, // Hex length / 2 = bytes
          dataType: dataType || 'medical-record',
          fee: '0.002', // Mock fee
          expiry: mockExpiry.toString(),
          nonce: mockNonce.toString()
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

      // Basic validation (simplified for demo)
      if (!accountAddress || accountAddress.length === 0) {
        return res.status(400).json({ error: 'Account address is required' });
      }

      // Mock transaction history data
      const transactions = [
        {
          hash: `mock_tx_${Date.now()}_1`,
          type: 'transfer',
          amount: '10.000000',
          from: '3fYzGGAG9q8iK8jNnGjLkQ7KjCECpbn9bnYjYYzHQ8ENaUBjEa',
          to: accountAddress,
          timestamp: new Date().toISOString(),
          status: 'finalized'
        },
        {
          hash: `mock_tx_${Date.now()}_2`,
          type: 'registerData',
          amount: '0',
          from: accountAddress,
          to: null,
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          status: 'finalized'
        }
      ];

      res.json({
        account: accountAddress,
        transactions,
        count: transactions.length,
        note: 'Mock transaction history - real implementation would query blockchain indexer'
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

      // Basic validation (simplified for demo)
      if (!accountAddress || accountAddress.length === 0) {
        return res.status(400).json({ error: 'Account address is required' });
      }

      // Mock account balance data
      const mockBalance = '100.500000'; // 100.5 CCD in mock account
      const mockBalanceMicroCcd = '100500000'.padEnd(15, '0'); // Convert to microCCD
      const mockNonce = Math.floor(Math.random() * 1000); // Random nonce

      res.json({
        account: accountAddress,
        balance: {
          ccd: mockBalance,
          microCcd: mockBalanceMicroCcd
        },
        nonce: mockNonce.toString(),
        note: 'Mock balance - real implementation would query blockchain'
      });
    } catch (error) {
      console.error('Get account balance error:', error);
      res.status(500).json({
        error: error.message || 'Failed to get account balance'
      });
    }
  },

  // Give medical consent (Smart contract transaction)
  giveMedicalConsent: async (req, res) => {
    try {
      const {
        walletExport,       // Wallet export JSON string
        fileName,          // Optional file name
        additionalInfo     // Optional additional information
      } = req.body;

      // Validate required fields
      if (!walletExport) {
        return res.status(400).json({
          error: 'Wallet export is required'
        });
      }

      // Validate wallet export
      const walletValidation = validateWalletExport(walletExport);
      if (!walletValidation.valid) {
        return res.status(400).json({ error: walletValidation.error });
      }

      const senderAddress = walletValidation.data.address;

      // Connect to Concordium client
      const client = getConcordiumClient();

      // Smart contract details for medical consent
      const contractIndex = 12260n;
      const contractSubindex = 0n;
      const receiveName = 'medical_consent.give_consent';
      const amount = 0n; // No CCD sent for consent

      // Parameters for the smart contract call
      const contractParams = {
        fileName: fileName || null,
        additionalInfo: additionalInfo || null
      };

      console.log('Executing consent transaction:', {
        sender: senderAddress,
        contract: `${contractIndex}:${contractSubindex}`,
        method: receiveName,
        params: contractParams
      });

      // Execute the smart contract transaction
      const transactionResult = await executeSmartContractTransaction({
        senderAddress,
        contractIndex,
        contractSubindex,
        receiveName,
        amount,
        parameters: contractParams,
        client
      });

      if (transactionResult.success) {
        // Return successful transaction result
        res.json({
          success: true,
          transaction: {
            hash: transactionResult.transactionHash,
            estimatedEnergy: '30000',
            type: 'updateContract'
          },
          contractDetails: {
            contractAddress: `${contractIndex.toString()}:${contractSubindex.toString()}`,
            receiveName: receiveName,
            maxContractExecutionEnergy: '30000',
            parameters: JSON.stringify(contractParams)
          },
          transactionDetails: {
            from: senderAddress,
            contract: `${contractIndex.toString()}:${contractSubindex.toString()}`,
            amount: '0', // No CCD sent for consent
            amountMicroCcd: '0',
            fee: '0.02', // Fee for contract execution
            fileName: fileName || null,
            additionalInfo: additionalInfo || null,
            method: 'give_consent',
            expiry: transactionResult.blockItem.header.expiry.toString(),
            nonce: transactionResult.blockItem.header.nonce.toString()
          },
          message: 'Medical consent transaction executed successfully on blockchain.'
        });
      } else {
        console.error('Transaction execution failed:', transactionResult.error);

        // For demo/fallback: return data indicating transaction should be signed by wallet
        const fallbackTransactionData = {
          type: 'updateContract',
          sender: senderAddress,
          contractAddress: `${contractIndex}:${contractSubindex}`,
          receiveName,
          amount: 0,
          parameters: contractParams
        };

        res.json({
          success: false,
          needsWalletSigning: true,
          transaction: {
            bytes: Buffer.from(JSON.stringify(fallbackTransactionData, (key, value) =>
              typeof value === 'bigint' ? value.toString() : value
            )).toString('hex'),
            estimatedEnergy: '30000',
            type: 'updateContract'
          },
          contractDetails: {
            contractAddress: `${contractIndex.toString()}:${contractSubindex.toString()}`,
            receiveName: receiveName,
            maxContractExecutionEnergy: '30000',
            parameters: JSON.stringify(contractParams)
          },
          message: 'Transaction prepared but needs wallet signing. Please sign with your Concordium wallet.',
          error: transactionResult.error
        });
      }
    } catch (error) {
      console.error('Give consent error:', error);
      res.status(500).json({
        error: error.message || 'Failed to execute consent transaction'
      });
    }
  }
};

module.exports = transactionController;
