
import bcrypt from 'bcrypt';
import userModel from '../models/user.js';
import { sendEmail } from '../middleware/mailer.js';

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await userModel.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpTimestamp = new Date();

    const user = new userModel({
      username,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      emailVerficationCode: otp,
      emailOtpGeneratedAt: otpTimestamp,
      isEmailVerfied: false,
    });

    await user.save();

    
    await sendEmail(
  user.username,
  user.email,
  otp
);


    return res.status(201).json({ message: 'Signup successful. OTP sent to email.' });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
