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
      const userAnswer = answers.find((a) => a.index === index);
      if (!userAnswer) return;

      if (question.type === 'radio') {
        if (userAnswer.label === 'Тийм') totalScore += 1;
      }

      if (question.type === 'checkbox') {
        userAnswer.label.forEach((label) => {
          if (label === 'Тийм') totalScore += 1;
        });
      }
    });

    // ✅ Үнэлгээний түвшин
    let level = 'Хэвийн сэтгэлзүйн байдал';
    if (totalScore >= 3 && totalScore <= 5) level = 'Хөнгөн зэргийн сэтгэл гутралын шинжтэй';
    if (totalScore >= 6 && totalScore <= 8) level = 'Дунд зэргийн сэтгэл гутрал';
    if (totalScore >= 9) level = 'Хүнд зэргийн сэтгэл гутрал, эмчид хандах шаардлагатай';

    // ✅ Санамсаргүй зөвлөгөө
    const advices = [
      "Чи ганцаараа биш. Хэн нэгэн үргэлж чамд санаа тавьж байгаа.",
      "Чи юу мэдэрч байгаагаа мэдрэх эрхтэй. Чи хангалттай үнэ цэнэтэй хүн.",
      "Бүх зүйл одоо хэцүү байж болох ч энэ үе өнгөрнө.",
      "Амьдралд амралт авах үе хэрэгтэй. Чи амсхийж болно.",
      "Алхам бүр чамайг урагшлуулж байгаа. Хэдий аажуу ч гэсэн.",
      "Төгс байх албагүй. Чи өөрийнхөөрөө л сайхан.",
      "Хүчтэй хүн уйлж чаддаг. Чамд сэтгэл бий гэдгийн шинж.",
      "Чи өнгөрснийг биш, ирээдүйг өөрчилж чадна.",
      "Өнөөдөр амархан биш байж болох ч чи өнгөрсөн бүхнийг давж гарсан хүн.",
      "Надад итгэ, чи чадна. Чи аль хэдийн олон давааг давсан."
    ];

    const randomAdvice = advices[Math.floor(Math.random() * advices.length)];

    const result = new QuizResult({
      quizId,
      userId,
      score: totalScore,
      level,
      advice: randomAdvice,
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
