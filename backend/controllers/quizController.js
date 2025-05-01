import QuizModel from '../models/quizModel.js';
import cloudinary from '../config/cloudinary.js';

// 🧠 Шинэ тест үүсгэх
export const createQuiz = async (req, res) => {
  try {
    const { title, summary } = req.body;
    const doctorId = req.userId;

    console.log("📥 Received form data:", req.body);
    console.log("📁 Uploaded file:", req.file);

    if (!title || !summary || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Гарчиг, тайлбар болон зургийг оруулна уу."
      });
    }

    const uploadedImage = await cloudinary.uploader.upload(req.file.path);

    const newQuiz = new QuizModel({
      title,
      summary, // ✨ Модел дээр summary гэж нэрлэсэн байх ёстой
      image: uploadedImage.secure_url,
      doctor: doctorId, // ✨ Модел дээр doctor гэж нэрлэсэн байх ёстой
    });

    await newQuiz.save();

    return res.status(201).json({
      success: true,
      quiz: newQuiz,
    });
  } catch (err) {
    console.error("❌ Тест үүсгэх үед алдаа:", err);
    return res.status(500).json({
      success: false,
      message: "Тест үүсгэхэд алдаа гарлаа",
      error: err.message,
    });
  }
};

// 🩺 Эмчийн оруулсан тестүүдийг авах
export const getDoctorQuizzes = async (req, res) => {
  try {
    const quizzes = await QuizModel.find({ doctor: req.userId });
    return res.json({ success: true, quizzes });
  } catch (err) {
    console.error("❌ Тест авахад алдаа:", err);
    return res.status(500).json({
      success: false,
      message: "Тест ачааллахад алдаа",
      error: err.message,
    });
  }
};

// ❌ Тест устгах
export const deleteQuiz = async (req, res) => {
  try {
    await QuizModel.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  } catch (err) {
    console.error("❌ Тест устгах үед алдаа:", err);
    return res.status(500).json({
      success: false,
      message: "Устгах үед алдаа гарлаа",
      error: err.message,
    });
  }
};


// 📋 Бүх тестүүдийг авах (public list)
export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await QuizModel.find().sort({ createdAt: -1 });
    return res.json({ success: true, quizzes });
  } catch (err) {
    console.error("❌ Бүх тест ачааллах үед алдаа:", err);
    return res.status(500).json({
      success: false,
      message: "Бүх тест ачааллахад алдаа",
      error: err.message,
    });
  }
};
// 📄 Тест ID-р авах
export const getQuizById = async (req, res) => {
  try {
    const quiz = await QuizModel.findById(req.params.id); // id-г params-аас авч байна
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Тест олдсонгүй" });
    }
    return res.json({ success: true, quiz });
  } catch (err) {
    console.error("❌ Тест ачааллах үед алдаа:", err);
    return res.status(500).json({
      success: false,
      message: "Тест ачааллахад алдаа гарлаа",
      error: err.message,
    });
  }
};
