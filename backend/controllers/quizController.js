import QuizModel from '../models/quizModel.js';
import cloudinary from '../config/cloudinary.js';

// 🧠 Шинэ тест үүсгэх
export const createQuiz = async (req, res) => {
  try {
    const { title, summary, questions } = req.body;
    const doctorId = req.userId || req.doctorId;

    if (!title || !summary || !req.file || !questions) {
      return res.status(400).json({
        success: false,
        message: "Гарчиг, тайлбар, зураг болон асуултуудыг оруулна уу.",
      });
    }

    // 🖼 Cloudinary зураг upload
    const uploadedImage = await cloudinary.uploader.upload(req.file.path);

    // 📦 multipart form-аас ирсэн асуултыг parse хийнэ
    const parsedQuestions = JSON.parse(questions);

    // ✅ Асуулт бүрийн type, option-уудыг шалгаж стандартжуулах
    const validatedQuestions = parsedQuestions.map((q) => ({
      question: q.question,
      type: q.type === 'checkbox' ? 'checkbox' : 'radio',
      options: q.options.map((opt) => ({
        label: opt.label,
        value: typeof opt.value === 'number' ? opt.value : 0,
      })),
    }));

    const newQuiz = new QuizModel({
      title,
      summary,
      image: uploadedImage.secure_url,
      doctor: doctorId,
      questions: validatedQuestions,
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
    const doctorId = req.userId || req.doctorId;
    const quizzes = await QuizModel.find({ doctor: doctorId }).sort({ createdAt: -1 });
    return res.json({ success: true, quizzes });
  } catch (err) {
    console.error("❌ Тест авахад алдаа:", err);
    return res.status(500).json({ success: false, message: "Тест ачааллахад алдаа", error: err.message });
  }
};

// ❌ Тест устгах
export const deleteQuiz = async (req, res) => {
  try {
    await QuizModel.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  } catch (err) {
    console.error("❌ Тест устгах үед алдаа:", err);
    return res.status(500).json({ success: false, message: "Устгах үед алдаа гарлаа", error: err.message });
  }
};

// 📋 Бүх тестүүд авах (populate хийсэн хувилбар)
export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await QuizModel.find()
      .sort({ createdAt: -1 })
      .populate('doctor', 'name speciality'); // ✅ Энд эмчийн нэр, мэргэжлийг populate хийв
    return res.json({ success: true, quizzes });
  } catch (err) {
    console.error("❌ Бүх тест ачааллах үед алдаа:", err);
    return res.status(500).json({ success: false, message: "Бүх тест ачааллахад алдаа", error: err.message });
  }
};

// 📄 ID-р тест авах
export const getQuizById = async (req, res) => {
  try {
    const quiz = await QuizModel.findById(req.params.id).populate('doctor', 'name speciality');
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Тест олдсонгүй" });
    }
    return res.json({ success: true, quiz });
  } catch (err) {
    console.error("❌ Тест ачааллах үед алдаа:", err);
    return res.status(500).json({ success: false, message: "Тест ачааллахад алдаа гарлаа", error: err.message });
  }
};
