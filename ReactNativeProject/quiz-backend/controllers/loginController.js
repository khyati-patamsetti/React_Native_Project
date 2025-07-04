

import bcrypt from 'bcrypt';
import userModel from '../models/user.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await userModel.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.status(200).json({
      message: 'Login successful',
      username: user.username,
      email: user.email,
      
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
