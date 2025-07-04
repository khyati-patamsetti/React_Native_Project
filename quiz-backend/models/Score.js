import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  username: { type: String, required: true },
  score: { type: Number, required: true },
  selectedCategory: String,
  correct: Number,
  wrong: Number,
  notAnswered: Number,
  timeTaken: Number,
  createdAt: { type: Date, default: Date.now }
});

const Score = mongoose.model('Score', scoreSchema);
export default Score;
