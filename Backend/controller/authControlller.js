const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/UserModel');
const { sendOtpSMS, generateOtp } = require('../utils/smsUtil');
const { sendPasswordEmail } = require('../utils/emailUtil');
const { successResponse } = require('../responseController');

const otpStore = {}; // temp in-memory

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register with temp password
exports.register = async (req, res, next) => {
  try {
    const { email, mobile } = req.body;
    if (!email || !mobile) throw createError(400, 'Email and phone required');

    const exists = await User.findOne({ $or: [{ email }, { mobile }] });
    if (exists) throw createError(409, 'User already exists');

    const tempPass = Math.random().toString(36).slice(-8);
    const hashedPass = await bcrypt.hash(tempPass, 10);

    const user = await User.create({
      email,
      mobile,
      password: hashedPass,
      isVerified: false
    });

    await sendPasswordEmail(email, tempPass);
    const token = generateToken(user);

    successResponse(res, { message: 'Registered. Temp password sent to email.' }, { token, user });
  } catch (err) {
    next(err);
  }
};

// Email + Password login
exports.loginEmail = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw createError(401, 'Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw createError(401, 'Invalid credentials');

    const token = generateToken(user);
    successResponse(res, { message: 'Login successful' }, { token, user });
  } catch (err) {
    next(err);
  }
};

// Send OTP to phone
exports.sendOtp = async (req, res, next) => {
  try {
    const { mobile } = req.body;
    const user = await User.findOne({ mobile });
    if (!user) throw createError(404, 'User not found');

    const otp = generateOtp();
    otpStore[mobile] = otp;
    await sendOtpSMS(mobile, otp);

    successResponse(res, { message: 'OTP sent' });
  } catch (err) {
    next(err);
  }
};

// Login with OTP
exports.loginOtp = async (req, res, next) => {
  try {
    const { mobile, otp } = req.body;
    if (otpStore[mobile] !== otp) throw createError(401, 'Invalid OTP');

    delete otpStore[mobile];
    const user = await User.findOne({ mobile });
    if (!user) throw createError(404, 'User not found');

    const token = generateToken(user);
    successResponse(res, { message: 'Login successful' }, { token, user });
  } catch (err) {
    next(err);
  }
};
