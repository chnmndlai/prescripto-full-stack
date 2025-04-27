import Advice from '../models/adviceModel.js';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';

// ✅ Зөвлөгөө нэмэх
export const addAdvice = async (req, res) => {
  try {
    const { title, summary } = req.body;
    const doctorId = req.user?.id;
    
    if (!title || !summary || !req.file) {
      return res.status(400).json({ success: false, message: 'Гарчиг, тайлбар болон зураг шаардлагатай.' });
    }

    const localPath = req.file.path;

    const result = await cloudinary.uploader.upload(localPath, {
      folder: 'prescripto/advice',
    });

    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }

    const newAdvice = new Advice({
      title,
      summary,
      image: result.secure_url,
      doctorId,
    });

    await newAdvice.save();

    res.status(201).json({ success: true, message: 'Зөвлөгөө амжилттай нэмэгдлээ.', advice: newAdvice });
  } catch (err) {
    console.error('💥 Зөвлөгөө нэмэх алдаа:', err.message);
    res.status(500).json({ success: false, message: 'Серверийн алдаа.', error: err.message });
  }
};


// ✅ Бүх зөвлөгөө жагсаах
export const getAdviceList = async (req, res) => {
  try {
    const advice = await Advice.find().sort({ createdAt: -1 });
    res.json({ success: true, advice });
  } catch (err) {
    console.error('💥 Зөвлөгөө жагсаах алдаа:', err.message);
    res.status(500).json({ success: false, message: 'Мэдээлэл авахад алдаа.', error: err.message });
  }
};

// ✅ Нэг зөвлөгөө авах
export const getSingleAdvice = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ ID формат шалгах
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID формат буруу байна.' });
    }

    const advice = await Advice.findById(id).populate('doctorId', 'name email');

    if (!advice) {
      return res.status(404).json({ success: false, message: 'Зөвлөгөө олдсонгүй.' });
    }

    res.json({ success: true, advice });
  } catch (err) {
    console.error('💥 Нэг зөвлөгөө авах алдаа:', err.message);
    res.status(500).json({ success: false, message: 'Серверийн алдаа.', error: err.message });
  }
};

// ✅ Зөвлөгөө устгах
export const deleteAdvice = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID формат буруу байна.' });
    }

    const deleted = await Advice.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Устгах зөвлөгөө олдсонгүй.' });
    }

    res.json({ success: true, message: 'Зөвлөгөө амжилттай устгагдлаа.' });
  } catch (err) {
    console.error('💥 Зөвлөгөө устгах алдаа:', err.message);
    res.status(500).json({ success: false, message: 'Серверийн алдаа.', error: err.message });
  }
};

// ✅ Зөвлөгөө шинэчлэх
export const updateAdvice = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID формат буруу байна.' });
    }

    const { title, summary } = req.body;
    const existing = await Advice.findById(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Зөвлөгөө олдсонгүй.' });
    }

    let image = existing.image;

    if (req.file?.path) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'prescripto/advice',
      });
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      image = result.secure_url;
    }

    const updatedAdvice = await Advice.findByIdAndUpdate(
      id,
      { title, summary, image },
      { new: true }
    );

    res.json({ success: true, message: 'Зөвлөгөө шинэчлэгдлээ.', advice: updatedAdvice });
  } catch (err) {
    console.error('💥 Зөвлөгөө шинэчлэх алдаа:', err.message);
    res.status(500).json({ success: false, message: 'Серверийн алдаа.', error: err.message });
  }
};

// ✅ Бүх зөвлөгөөг авах (populate хийсэн)
export const getAllAdvice = async (req, res) => {
  try {
    const advice = await Advice.find().populate('doctorId', 'name email');
    res.status(200).json({ success: true, advice });
  } catch (err) {
    console.error('💥 Бүх зөвлөгөө авах алдаа:', err.message);
    res.status(500).json({ success: false, message: 'Мэдээлэл авахад алдаа.', error: err.message });
  }
};
