const express = require('express');
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/users', userController.UserRegister);

router.post('/users/login', userController.UserLogin);

router.get('/users/me', auth, userController.userProfile);

router.post('/users/me/logout', auth, userController.userLogout);

router.post('/users/me/logoutall', auth, userController.userLogoutAllDevices);

module.exports = router