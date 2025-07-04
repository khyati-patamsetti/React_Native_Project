import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import DbCon from './libs/db.js'; 
import AuthRoutes from './routes/route.js';
import otpRoutes from './routes/otpRoutes.js';
import scoreRoutes from './routes/scoreRoutes.js'; 

dotenv.config();
await DbCon(); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/auth', AuthRoutes);
app.use('/otp', otpRoutes);
app.use('/score', scoreRoutes); 

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
