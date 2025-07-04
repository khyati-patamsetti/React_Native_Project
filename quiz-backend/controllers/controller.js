

import { SendVerficationCode } from '../middleware/Email.js'; 
import userModel from '../models/user.js';

const register = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

   
    const verficationCode = Math.floor(100000 + Math.random() * 900000).toString(); 

    
    let user = await userModel.findOne({ email });

    if (user) {
      
      user.verficationCode = verficationCode;
      user.otpGeneratedAt = new Date();
    } else {
      
      user = new userModel({
        email,
        verficationCode,
        otpGeneratedAt: new Date(),
        
      });
    }

    await user.save();

   
    await  SendVerficationCode(email, verficationCode); 

    return res.status(200).json({ success: true, message: 'OTP has been sent to your email' });

  } catch (error) {
    console.error('Error in register controller:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export { register };
