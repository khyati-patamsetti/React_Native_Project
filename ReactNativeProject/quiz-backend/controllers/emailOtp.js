


import userModel from '../models/user.js';
import { sendEmail } from '../middleware/mailer.js'; 


const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const verifyEmailOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const now = new Date();
    const otpAgeMinutes = (now - user.emailOtpGeneratedAt) / (1000 * 60);

    if (
      user.emailVerficationCode !== otp ||
      otpAgeMinutes > 5
    ) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isEmailVerfied = true;
    user.emailVerficationCode = null;
    user.emailOtpGeneratedAt = null;
    await user.save();

    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const resendEmailOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerfied) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    const otp = generateOTP();
    user.emailVerficationCode = otp;
    user.emailOtpGeneratedAt = new Date();
    await user.save();

   
    
    await sendEmail(
  user.username,
  user.email,
  otp
);


    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(' Resend OTP error:', error); 
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
