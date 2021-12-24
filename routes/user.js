const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const skillController = require('../controllers/skillController');
const portfolioController = require('../controllers/portfolioController');
router.post('/signIn', authController.signIn);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/activate/:token', authController.activate);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:token', authController.resetPassword);
router.use(authController.auth);
router.get('/me', userController.getMe);
router.post('/create', userController.create);
router.patch(
	'/portfolio/:id/image',
	portfolioController.uploadPortfolioPhoto,
	portfolioController.resizePortfolioPhoto,
	portfolioController.updateImage
);
router.get('/portfolio', portfolioController.getMyAll);
router.patch('/portfolio/:id/info', portfolioController.updateInfo);
router.patch('/portfolio/:id/addTag', portfolioController.addTag);
router.patch(
	'/image',
	userController.uploadUserPhoto,
	userController.resizeUserPhoto,
	userController.updateImage
);
router.patch('/addSkill', skillController.create);
router.get('/skill', skillController.getMyAll);
router.patch('/skill/:id', skillController.update);
router.delete('/skill/:id', skillController.delete);
router.patch('/me/update',userController.update);
router.patch('/me/authupdate', userController.updateMe);
module.exports = router;
