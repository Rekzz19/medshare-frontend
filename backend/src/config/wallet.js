const {
  AccountAddress,
  CcdAmount,
  TransactionExpiry,
  DataBlob,
  AccountTransactionType,
  AccountTransactionHeader,
  AccountTransaction,
  signTransaction,
  buildAccountSigner
} = require('@concordium/web-sdk');

/**
 * Parse wallet export data
 * @param {string} walletExportJson - JSON string of wallet export
 * @returns {object} Parsed wallet data
 */
const parseAndValidateWalletExport = (walletExportJson) => {
  try {
    const wallet = JSON.parse(walletExportJson);
    // For now, just return the parsed wallet - in production you'd validate it
    return { value: { address: wallet.address } }; // Simplified structure
  } catch (error) {
    throw new Error(`Failed to parse wallet export: ${error.message}`);
  }
};

/**
 * Build account signer from parsed wallet
 * @param {object} parsedWallet - Parsed wallet data
 * @returns {object} Account signer
 */
const createAccountSigner = (parsedWallet) => {
  return buildAccountSigner(parsedWallet);
};

/**
 * Create account address from base58 string
 * @param {string} address - Base58 encoded account address
 * @returns {AccountAddress} Concordium account address object
 */
const createAccountAddress = (address) => {
  return AccountAddress.fromBase58(address);
};

/**
 * Create CCD amount from microCCD value
 * @param {number|string} microCcd - Amount in microCCD
 * @returns {CcdAmount} CCD amount object
 */
const createCcdAmount = (microCcd) => {
  return CcdAmount.fromMicroCcd(BigInt(microCcd));
};

/**
 * Create transaction expiry (future minutes)
 * @param {number} minutes - Minutes in the future
 * @returns {TransactionExpiry} Transaction expiry object
 */
const createExpiry = (minutes = 60) => {
  return TransactionExpiry.futureMinutes(minutes);
};

/**
 * Create data blob from buffer or hex string
 * @param {Buffer|string} data - Data buffer or hex string
 * @returns {DataBlob} Data blob object
 */
const createDataBlob = (data) => {
  if (typeof data === 'string' && data.startsWith('0x')) {
    return new DataBlob(Buffer.from(data.slice(2), 'hex'));
  } else if (typeof data === 'string') {
    return new DataBlob(Buffer.from(data, 'hex'));
  } else {
    return new DataBlob(data);
  }
};

/**
 * Validate account address
 * @param {string} address - Account address string
 * @returns {boolean} Whether address is valid
 */
const isValidAccountAddress = (address) => {
  try {
    AccountAddress.fromBase58(address);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Validate credential registration ID
 * @param {string} credId - Credential ID string
 * @returns {boolean} Whether credId is valid
 */
const isValidCredentialId = (credId) => {
  try {
    new CredentialRegistrationId(credId);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Validate CCD amount
 * @param {number|string} amount - CCD amount
 * @returns {boolean} Whether amount is valid
 */
const isValidCcdAmount = (amount) => {
  try {
    CcdAmount.fromMicroCcd(BigInt(amount));
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  parseWalletExport: parseAndValidateWalletExport,
  createAccountSigner,
  createAccountAddress,
  createCcdAmount,
  createExpiry,
  createDataBlob,
  isValidAccountAddress,
  isValidCredentialId,
  isValidCcdAmount,
  // Export SDK classes for direct use
  AccountAddress,
  CcdAmount,
  TransactionExpiry,
  DataBlob,
  AccountTransactionType,
  AccountTransactionHeader,
  AccountTransaction
};
