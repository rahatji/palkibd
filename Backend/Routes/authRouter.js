const express = require('express');
const { register, loginEmail, sendOtp, loginOtp } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login/email', loginEmail);
router.post('/login/send-otp', sendOtp);
router.post('/login/otp', loginOtp);

module.exports = router;
