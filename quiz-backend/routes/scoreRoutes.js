import express from 'express';
import Score from '../models/Score.js';

const router = express.Router();

router.post('/submit-score', async (req, res) => {
  const { username, score, selectedCategory, correct, wrong, notAnswered, timeTaken } = req.body;

  try {
    const updatedScore = await Score.findOneAndUpdate(
      { username, selectedCategory },
      {
        score,
        correct,
        wrong,
        notAnswered,
        timeTaken,
        createdAt: new Date(),
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'Score updated successfully', data: updatedScore });
  } catch (error) {
    console.error('Error updating score:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/total/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const scores = await Score.find({ username });
    const total = scores.reduce((sum, s) => sum + (s.score || 0), 0);

    res.status(200).json({ totalPoints: total });
  } catch (error) {
    console.error('Error fetching total score:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Score.aggregate([
      { $group: { _id: '$username', totalPoints: { $sum: '$score' } } },
      { $sort: { totalPoints: -1 } },
      { $project: { username: '$_id', totalPoints: 1, _id: 0 } }
    ]);
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

export default router;