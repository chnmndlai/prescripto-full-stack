import mongoose from 'mongoose';

const quizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }, // ➕ энэ байх ёстой
  score: Number,
  level: String
}, { timestamps: true }); // ✅ createdAt автоматаар орно

export default mongoose.model('QuizResult', quizResultSchema);
