import express from 'express';
import {
  saveQuizResult,
  getAllResults,
  getQuizStats,
  getQuizOverview
} from '../controllers/quizResultController.js';

const router = express.Router();

// ✅ Тест бөглөж хадгалах
router.post('/', saveQuizResult);

// ✅ Бүх үр дүнг (эмч) харах
router.get('/', getAllResults);

// ✅ Сүүлийн 7 хоног ба сард бөглөсөн тестүүдийн тоо ба дундаж оноо
router.get('/stats', getQuizStats);

// ✅ Хамгийн их бөглөгдсөн тестүүдийн дундаж онооны тойм
router.get('/overview', getQuizOverview);

export default router;
