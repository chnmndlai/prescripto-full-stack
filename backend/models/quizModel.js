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
      type: String,
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

    // 🧠 Тестийн асуултууд
    questions: [
      {
        question: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ['radio', 'checkbox', 'yesno'],
          default: 'radio',
        },
        options: [
          {
            label: {
              type: String,
              required: true,
            },
            value: {
              type: mongoose.Schema.Types.Mixed, // string, number, boolean г.м
              required: true,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true, // createdAt, updatedAt автоматаар
  }
);

// 📦 Модел үүсгэх
const QuizModel = mongoose.model("Quiz", quizSchema);

export default QuizModel;
