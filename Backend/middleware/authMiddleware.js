const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/UserModel');

exports.protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw createError(401, "Not authorized, no token");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) throw createError(401, "User not found");

    next();
  } catch (err) {
    next(createError(401, "Not authorized"));
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') next();
  else next(createError(403, "Admin only"));
};
