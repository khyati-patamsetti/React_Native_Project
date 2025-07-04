
import userModel from '../models/user.js';

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
   
    const normalizedEmail = email.toLowerCase().trim();
    const user = await userModel.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }


    const otpLifetime = 45 * 1000; 
    const isExpired = new Date() - user.otpGeneratedAt > otpLifetime;

    if (isExpired) {
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }
    
    if (user.verficationCode !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    user.isVerfied = true;
    user.verficationCode = null; 
     user.otpGeneratedAt = null;
    await user.save();

    return res.status(200).json({ success: true, message: 'OTP verified successfully' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};