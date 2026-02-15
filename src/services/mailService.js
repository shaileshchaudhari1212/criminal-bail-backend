const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

exports.sendResetMail = async (email, token) => {

  const link = `${process.env.RESET_URL}?token=${token}`;

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Password Reset',
    html: `
      <h3>Password Reset</h3>
      <p>Click link below to reset:</p>
      <a href="${link}">${link}</a>
    `
  });
};
