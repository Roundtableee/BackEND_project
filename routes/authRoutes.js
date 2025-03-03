// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.get('/users', authMiddleware, authController.getAllUsers);
router.get('/users/:id', authMiddleware, authController.getSingleUser);

module.exports = router;
