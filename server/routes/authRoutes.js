const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login); // <--- Đảm bảo có dòng này

module.exports = router;