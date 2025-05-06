import express from 'express';
import {
  addAdvice,
  getAdviceList,
  getSingleAdvice,
  deleteAdvice,
  updateAdvice,
  getDoctorAdvices, // ✅ Эмчийн зөвлөгөө авах
} from '../controllers/adviceController.js';

import upload from '../middleware/multer.js';
import authDoctor from '../middleware/authDoctor.js';
import AdviceModel from '../models/adviceModel.js'; // ✅ AdviceModel импортлох

const router = express.Router();

// ✅ Зөвлөгөө үүсгэх (эмч)
router.post('/create', authDoctor, upload.single('image'), addAdvice);

// ✅ Бүх зөвлөгөөг авах
router.get('/', getAdviceList);

// ✅ Эмчийн зөвлөгөө
router.get('/my-advices', authDoctor, getDoctorAdvices);

// ✅ Нэг зөвлөгөө авах
router.get('/:id', getSingleAdvice);

// ✅ Зөвлөгөө устгах
router.delete('/:id', authDoctor, deleteAdvice);

// ✅ Зөвлөгөө засах
router.put('/:id', authDoctor, upload.single('image'), updateAdvice);

// ✅ 🆕 Хадгалсан зөвлөгөөг олон ID-аар авах API
router.post('/list-many', async (req, res) => {
  try {
    const { adviceIds } = req.body;
    if (!adviceIds || !Array.isArray(adviceIds)) {
      return res.status(400).json({ success: false, message: "adviceIds массив илгээнэ үү" });
    }

    const advice = await AdviceModel.find({ _id: { $in: adviceIds } }).populate('doctor');
    res.json({ success: true, advice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Advice татахад алдаа гарлаа.' });
  }
});

export default router;
