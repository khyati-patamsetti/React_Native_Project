
import mongoose from "mongoose";

const DbCon = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('MongoDB is connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

export default DbCon;
 