const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendPasswordEmail = async (email, password) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Temporary Password',
    html: `<p>Your temporary password is: <b>${password}</b><br>Please log in and change it.</p>`
  });
};
