
import express from 'express';
import userModel from '../models/user.js';
import { sendEmail } from '../middleware/mailer.js';

const router = express.Router();

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post('/resend-email-otp', async (req, res) => {
  const { email } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const otp = generateOtp();
  const otpExpiry = Date.now() + 5 * 60 * 1000;

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

 
  await sendEmail(
    email,
    'Your OTP Code',
    `Your One-Time Password (OTP) is: ${otp}`
  );

  console.log(` OTP sent to ${email}: ${otp}`);

  res.json({ message: "OTP resent successfully" });
});

export default router;
