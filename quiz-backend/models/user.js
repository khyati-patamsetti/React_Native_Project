

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
     lowercase: true, 
    trim: true ,
  },
  password: {
    type: String,
    required: true,
  },
  verficationCode: {
    type: String,
    default: null, 
  },
  otpGeneratedAt: {
    type: Date,
    default: null, 
  },
  emailVerficationCode:{
    type:String,
    default:null,
  },
  emailOtpGeneratedAt:{
    type:Date,
    default:null,
  },
  isEmailVerfied: { type: Boolean, default: false },
}, { timestamps: true });

const userModel = mongoose.model("User", userSchema);
export default userModel;


