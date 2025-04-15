import express from 'express';
import {
  addAdvice,
  getAdviceList,
  getSingleAdvice,
  deleteAdvice,
  updateAdvice,
} from '../controllers/adviceController.js';

import upload from '../middleware/multer.js';
import authDoctor from '../middleware/authDoctor.js';

const router = express.Router();

// зөвлөгөө нэмэх (эмчийн эрхээр)
router.post('/create', authDoctor, upload.single('image'), addAdvice);

// бүх зөвлөгөөг авах (нийтэд)
router.get('/', getAdviceList);

// ганц зөвлөгөө дэлгэрэнгүйгээр авах
router.get('/:id', getSingleAdvice);

// зөвлөгөө устгах (эмч/админ тохирох бол)
router.delete('/:id', authDoctor, deleteAdvice);

// зөвлөгөө шинэчлэх
router.put('/:id', authDoctor, upload.single('image'), updateAdvice);

export default router;
