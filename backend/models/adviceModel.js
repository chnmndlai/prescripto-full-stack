import mongoose from 'mongoose';

const adviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Гарчиг заавал шаардлагатай'],
      trim: true,
      maxlength: 120,
    },
    summary: {
      type: String,
      required: [true, 'Тайлбар заавал оруулна уу'],
      trim: true,
      minlength: 10,
    },
    image: {
      type: String,
      required: [true, 'Зураг заавал шаардлагатай'],
    },
    category: {
      type: String,
      enum: ['Сэтгэлзүй', 'Сэтгэл гутрал', 'Нойр', 'Гэр бүл', 'Ажлын стресс', 'Амьдралын хэв маяг'],
      default: 'Сэтгэлзүй',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
    views: {
      type: Number,
      default: 0,
    },
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Advice', adviceSchema);