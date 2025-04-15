import express from 'express';
import { saveQuizResult, getAllResults } from '../controllers/quizResultController.js';

const router = express.Router();

router.post('/', saveQuizResult);
router.get('/', getAllResults); // эмч бүх үр дүнг харах

export default router;
