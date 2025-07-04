
import express from 'express';
import { signup } from '../controllers/signupController.js';
import {login} from '../controllers/loginController.js';
import { register } from '../controllers/controller.js'; 
import {resetPassword} from '../controllers/resetController.js';
import { verifyEmailOtp,resendEmailOtp } from '../controllers/emailOtp.js';
const AuthRoutes = express.Router();


AuthRoutes.post('/signup', signup);
AuthRoutes.post('/login',login);
AuthRoutes.post('/register', register);
AuthRoutes.post('/reset-password',resetPassword);
AuthRoutes.post('/verify-email-otp',verifyEmailOtp);
AuthRoutes.post('/resend-email-otp', resendEmailOtp);
export default AuthRoutes;




