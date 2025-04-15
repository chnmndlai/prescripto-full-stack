import mongoose from 'mongoose';

const quizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  score: Number,
  level: String,
  createdAt: Date
});

export default mongoose.model('QuizResult', quizResultSchema);
