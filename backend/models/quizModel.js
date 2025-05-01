import mongoose from "mongoose";

// 🧠 Сэтгэлзүйн тестийн схем
const quizSchema = new mongoose.Schema(
  {
    // Тестийн гарчиг
    title: {
      type: String,
      required: true,
    },

    // Товч тайлбар
    summary: {
      type: String, // ⚠️ Frontend-д "summary" гэж нэрлэсэн тул ингэж үлдээнэ
      required: true,
    },

    // Зургийн линк (Cloudinary URL)
    image: {
      type: String,
      required: true,
    },

    // Тест үүсгэсэн эмч
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    // Тестийн асуултууд
    questions: [
      {
        question: { type: String, required: true }, // асуулт
        type: { type: String, default: 'yesno' },  // асуултын төрлүүд (yesno, multiple choice, гэх мэт)
      },
    ],
  },
  {
    timestamps: true, // createdAt, updatedAt автоматаар нэмэгдэнэ
  }
);

// 📦 Модел үүсгэх
const QuizModel = mongoose.model("Quiz", quizSchema);

export default QuizModel;
