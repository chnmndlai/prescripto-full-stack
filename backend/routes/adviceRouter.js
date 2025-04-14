import express from 'express';
import {
  addAdvice,
  getAdviceList,
  getSingleAdvice,
  deleteAdvice,
  updateAdvice
} from '../controllers/adviceController.js';

import multer from '../middleware/multer.js';
import authDoctor from '../middleware/authDoctor.js';

const router = express.Router();

router.post('/create', authDoctor, multer.single('image'), addAdvice);
router.get('/', getAdviceList);
router.get('/:id', getSingleAdvice);
router.delete('/:id', deleteAdvice);
router.put('/:id', multer.single('image'), updateAdvice);

export default router;
