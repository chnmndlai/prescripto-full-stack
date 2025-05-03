import QuizModel from '../models/quizModel.js';
import QuizResult from '../models/quizResultModel.js';

export const saveQuizResult = async (req, res) => {
  try {
    const { quizId, answers, userId } = req.body;

    const quiz = await QuizModel.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Тест олдсонгүй' });
    }

    let totalScore = 0;

    // Асуулт бүрийн оноог тооцоолох
    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index];

      if (!userAnswer) return;

      if (question.type === 'radio') {
        const matched = question.options.find(opt => opt.label === userAnswer.label);
        if (matched) {
          totalScore += matched.value;
        }
      }

      if (question.type === 'checkbox') {
        userAnswer.forEach((selected) => {
          const matched = question.options.find(opt => opt.label === selected.label);
          if (matched) {
            totalScore += matched.value;
          }
        });
      }
    });

    // Үнэлгээний түвшин
    let level = 'Бага';
    if (totalScore >= 8) level = 'Дунд';
    if (totalScore >= 15) level = 'Өндөр';

    const result = new QuizResult({
      quizId,
      userId,
      score: totalScore,
      level,
      createdAt: new Date(),
    });

    await result.save();

    return res.status(201).json({
      success: true,
      message: 'Тест хадгалагдлаа.',
      result,
    });
  } catch (err) {
    console.error("❌ Хариу хадгалах алдаа:", err);
    return res.status(500).json({ success: false, message: 'Серверийн алдаа.', error: err.message });
  }
};

export const getAllResults = async (req, res) => {
  try {
    const results = await QuizResult.find().populate('userId', 'name email');
    return res.json({ success: true, results });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Унших үед алдаа гарлаа.' });
  }
};
