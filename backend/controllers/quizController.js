// backend/controllers/quizController.js
const Quiz = require("../models/quizModel");

exports.submitQuiz = async (req, res) => {
  try {
    const { answers, userId } = req.body;
    const newQuiz = new Quiz({ answers, user: userId });
    await newQuiz.save();
    res.status(201).json({ message: "Тест амжилттай хадгалагдлаа" });
  } catch (err) {
    res.status(500).json({ message: "Алдаа гарлаа", error: err.message });
  }
};

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("user", "name email");
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: "Уншихад алдаа гарлаа" });
  }
};
