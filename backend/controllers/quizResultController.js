import QuizModel from '../models/quizModel.js';
import QuizResult from '../models/quizResultModel.js';

// ✅ Тест бөглөж хадгалах
export const saveQuizResult = async (req, res) => {
  try {
    const { quizId, answers, userId } = req.body;

    const quiz = await QuizModel.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Тест олдсонгүй' });
    }

    let totalScore = 0;

    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      if (!userAnswer) return;

      if (question.type === 'radio') {
        const matched = question.options.find(opt => opt.label === userAnswer.label);
        if (matched) totalScore += matched.value;
      }

      if (question.type === 'checkbox') {
        userAnswer.forEach((selected) => {
          const matched = question.options.find(opt => opt.label === selected.label);
          if (matched) totalScore += matched.value;
        });
      }
    });

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
    console.error('❌ Хариу хадгалах алдаа:', err);
    return res.status(500).json({ success: false, message: 'Серверийн алдаа.', error: err.message });
  }
};

// ✅ Бүх тестийн үр дүн
export const getAllResults = async (req, res) => {
  try {
    const results = await QuizResult.find().populate('userId', 'name email');
    return res.json({ success: true, results });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Унших үед алдаа гарлаа.' });
  }
};

// ✅ 2. 7 хоног / сард бөглөсөн тестүүдийн статистик
export const getQuizStats = async (req, res) => {
  try {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);

    const monthAgo = new Date(now);
    monthAgo.setMonth(now.getMonth() - 1);

    const weekly = await QuizResult.aggregate([
      { $match: { createdAt: { $gte: weekAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          avgScore: { $avg: '$score' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthly = await QuizResult.aggregate([
      { $match: { createdAt: { $gte: monthAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          avgScore: { $avg: '$score' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ success: true, weekly, monthly });
  } catch (err) {
    console.error('📊 Статистик авах алдаа:', err);
    res.status(500).json({ success: false, message: 'Статистик авах үед алдаа гарлаа' });
  }
};

// ✅ 3. Тестийн үр дүнгийн тойм
export const getQuizOverview = async (req, res) => {
  try {
    const topQuiz = await QuizResult.aggregate([
      {
        $group: {
          _id: '$quizId',
          count: { $sum: 1 },
          avgScore: { $avg: '$score' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const populated = await QuizModel.populate(topQuiz, { path: '_id', select: 'title' });

    res.json({ success: true, overview: populated });
  } catch (err) {
    console.error('📊 Тойм авах алдаа:', err);
    res.status(500).json({ success: false, message: 'Тестийн тойм авах үед алдаа гарлаа' });
  }
};
