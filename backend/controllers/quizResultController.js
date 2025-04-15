import QuizResult from '../models/quizResultModel.js';

export const saveQuizResult = async (req, res) => {
  try {
    const { score, level, createdAt, userId } = req.body;

    const newResult = new QuizResult({ score, level, createdAt, userId });
    await newResult.save();

    res.status(201).json({ success: true, message: 'Quiz хадгалагдлаа.', result: newResult });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Серверийн алдаа.', error: err.message });
  }
};

export const getAllResults = async (req, res) => {
  try {
    const results = await QuizResult.find().populate('userId', 'name email');
    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Унших үед алдаа гарлаа.' });
  }
};
