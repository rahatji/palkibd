const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Generate a random default password (8 chars)
const generateTempPassword = () => Math.random().toString(36).slice(-8);

const userSchema = mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true, trim: true },
  mobile: { type: String, unique: true },
  password: { type: String, required: true , default: generateTempPassword},
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: ['admin', 'user'], default: 'user' }
}, { timestamps: true });

// Instance method to get plain password BEFORE hashing
userSchema.methods.getPlainPassword = function () {
  return this._plainPassword;
};

// Middleware to keep track of plain password for email
userSchema.pre('validate', function (next) {
  if (!this.password) {
    const tempPass = generateTempPassword();
    this.password = tempPass;
    this._plainPassword = tempPass; // save original for email
  } else {
    this._plainPassword = this.password;
  }
  next();
});
// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);


