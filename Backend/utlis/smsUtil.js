const axios = require('axios');

exports.generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.sendOtpSMS = async (phone, otp) => {
  const payload = new URLSearchParams();
  payload.append('token', process.env.GREENWEB_API_TOKEN);
  payload.append('to', phone);
  payload.append('message', `Your OTP is: ${otp}`);

  const res = await axios.post('https://api.bdbulksms.net/api.php', payload);
  return res.data;
};
