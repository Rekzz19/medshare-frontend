const express = require('express');
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/auth');

const router = express.Router();

// Protected routes (require authentication)
router.post('/donate', auth, transactionController.createDonation);
router.post('/register-data', auth, transactionController.registerMedicalData);
// Temporarily make give-consent public for testing
router.post('/give-consent', transactionController.giveMedicalConsent);

// Public routes (for general blockchain information)
router.get('/history/:accountAddress', transactionController.getTransactionHistory);
router.get('/balance/:accountAddress', transactionController.getAccountBalance);

module.exports = router;
