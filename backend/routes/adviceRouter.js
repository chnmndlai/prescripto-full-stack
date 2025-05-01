import express from 'express';
import {
  addAdvice,
  getAdviceList,
  getSingleAdvice,
  deleteAdvice,
  updateAdvice,
  getDoctorAdvices, // ✅ эмчийн зөвлөгөө авах функц
} from '../controllers/adviceController.js';

import upload from '../middleware/multer.js';
import authDoctor from '../middleware/authDoctor.js';

const router = express.Router();

router.post('/create', authDoctor, upload.single('image'), addAdvice);
router.get('/', getAdviceList);
router.get('/my-advices', authDoctor, getDoctorAdvices); // ✅ энэ мөр зөв байгаа эсэхийг шалга
router.get('/:id', getSingleAdvice);
router.delete('/:id', authDoctor, deleteAdvice);
router.put('/:id', authDoctor, upload.single('image'), updateAdvice);

export default router;
