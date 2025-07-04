

import bcrypt from 'bcrypt';
import userModel from '../models/user.js';

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await userModel.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: 'User with this email does not exist' });
    }

   
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
