import express from 'express';
import {
  createQuiz,
  getDoctorQuizzes,
  deleteQuiz,
  getAllQuizzes,
  getQuizById
} from '../controllers/quizController.js';

import authDoctor from '../middleware/authDoctor.js';
import multer from 'multer';

const router = express.Router();

// 📦 Multer config — зөвхөн зураг авах
const storage = multer.diskStorage({});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Зөвхөн зураг файл байж болно'), false);
  }
};
const upload = multer({ storage, fileFilter });

// ✅ Тест үүсгэх (эмч л үүсгэнэ)
router.post('/create', authDoctor, upload.single('image'), createQuiz);

// ✅ Өөрийн тестүүдийг авах
router.get('/my-quizzes', authDoctor, getDoctorQuizzes);

// ✅ Тест устгах (эмчийн эрхтэй)
router.delete('/:id', authDoctor, deleteQuiz);

// 🌐 Бүх тест — нийтэд зориулсан
router.get('/all', getAllQuizzes);

// 🌐 Тест ID-аар авах
router.get('/:id', getQuizById);

export default router;
