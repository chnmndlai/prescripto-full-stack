import Advice from '../models/adviceModel.js';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

export const addAdvice = async (req, res) => {
  try {
    const { title, summary } = req.body;
    const doctorId = req.user?.id; // JWT-ээр дамжуулан doctorId авна
    const localPath = req.file?.path;

    if (!title || !summary || !localPath) {
      return res.status(400).json({ success: false, message: 'Бүх талбарыг бөглөнө үү.' });
    }

    const result = await cloudinary.uploader.upload(localPath, {
      folder: 'prescripto/advice',
    });

    fs.unlinkSync(localPath);

    const newAdvice = new Advice({
      title,
      summary,
      image: result.secure_url,
      doctorId,
    });

    await newAdvice.save();

    res.status(201).json({ success: true, message: 'Зөвлөгөө амжилттай нэмэгдлээ.', advice: newAdvice });
  } catch (err) {
    console.error('Зөвлөгөө нэмэх алдаа:', err);
    res.status(500).json({ success: false, message: 'Серверийн алдаа.' });
  }
};

export const getAdviceList = async (req, res) => {
  try {
    const advice = await Advice.find().sort({ createdAt: -1 });
    res.json({ success: true, advice });
  } catch (err) {
    console.error('Зөвлөгөө авах алдаа:', err);
    res.status(500).json({ success: false, message: 'Мэдээлэл авахад алдаа гарлаа.' });
  }
};

export const getSingleAdvice = async (req, res) => {
  try {
    const advice = await Advice.findById(req.params.id).populate('doctorId', 'name email');
    if (!advice) return res.status(404).json({ success: false, message: 'Зөвлөгөө олдсонгүй' });
    res.json({ success: true, advice });
  } catch (err) {
    console.error('Зөвлөгөө олж авах алдаа:', err);
    res.status(500).json({ success: false, message: 'Серверийн алдаа.' });
  }
};

export const deleteAdvice = async (req, res) => {
  try {
    const deleted = await Advice.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Устгах зөвлөгөө олдсонгүй' });
    res.json({ success: true, message: 'Зөвлөгөө амжилттай устгагдлаа.' });
  } catch (err) {
    console.error('Устгах алдаа:', err);
    res.status(500).json({ success: false, message: 'Серверийн алдаа.' });
  }
};

export const updateAdvice = async (req, res) => {
  try {
    const { title, summary } = req.body;
    const existing = await Advice.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Зөвлөгөө олдсонгүй' });

    let image = existing.image;
    if (req.file?.path) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'prescripto/advice',
      });
      fs.unlinkSync(req.file.path);
      image = result.secure_url;
    }

    const updatedAdvice = await Advice.findByIdAndUpdate(
      req.params.id,
      { title, summary, image },
      { new: true }
    );

    res.json({ success: true, message: 'Зөвлөгөө шинэчлэгдлээ.', advice: updatedAdvice });
  } catch (err) {
    console.error('Зөвлөгөө шинэчлэх алдаа:', err);
    res.status(500).json({ success: false, message: 'Серверийн алдаа.' });
  }
};

export const getAllAdvice = async (req, res) => {
  try {
    const advice = await Advice.find().populate('doctorId', 'name email');
    res.status(200).json({ success: true, advice });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Алдаа гарлаа' });
  }
};
