import express from 'express';
import { createQuiz, getDoctorQuizzes, deleteQuiz, getAllQuizzes, getQuizById } from '../controllers/quizController.js';
import authDoctor from '../middleware/authDoctor.js';
import multer from 'multer';

const storage = multer.diskStorage({});
const upload = multer({ storage });

const router = express.Router();

router.post('/create', authDoctor, upload.single('image'), createQuiz); // ✅
router.get('/my-quizzes', authDoctor, getDoctorQuizzes);
router.delete('/:id', authDoctor, deleteQuiz);
router.get('/all', getAllQuizzes);
router.get('/:id', getQuizById);  // ✅

export default router;
