
import express from 'express';
import userModel from '../models/user.js';
import { SendVerficationCode } from '../middleware/Email.js'; 

const router = express.Router();


router.post('/verify', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.verficationCode !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  
  user.isVerfied = true;                
  user.verficationCode = null; 
  user.otpGeneratedAt=null;        
  await user.save();

  return res.status(200).json({ message: 'OTP verified successfully' });
});


router.post('/resend', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const verficationCode = Math.floor(100000 + Math.random() * 900000).toString();

  user.verficationCode = verficationCode;
  user.otpGeneratedAt = new Date();
  await user.save();

  await SendVerficationCode(email, verficationCode); 

  return res.status(200).json({ message: 'OTP has been resent to your email' });
});

export default router;
