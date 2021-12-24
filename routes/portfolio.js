const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const portfolioController = require('../controllers/portfolioController');
router.use(authController.auth, authController.isAdmin);
router.get('/',portfolioController.getAll);
module.exports = router;
