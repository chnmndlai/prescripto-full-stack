import Advice from '../models/adviceModel.js';
import fs from 'fs';

export const addAdvice = async (req, res) => {
  try {
    console.log('REQ BODY:', req.body);   // энд байрлуулна
    console.log('REQ FILE:', req.file);   // энд байрлуулна

    const { title, summary } = req.body;
    const image = req.file?.path;

    if (!title || !summary || !image) {
      return res.status(400).json({ success: false, message: 'Бүх талбарыг бөглөнө үү.' });
    }

    const newAdvice = new Advice({ title, summary, image });
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
    const advice = await Advice.findById(req.params.id);
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

    // Хуучин зураг устгах
    if (deleted.image) {
      fs.unlink(deleted.image, (err) => {
        if (err) console.error('Зураг устгах алдаа:', err);
      });
    }

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

    const updateData = {
      title: title || existing.title,
      summary: summary || existing.summary,
      image: req.file?.path || existing.image,
    };

    // Хуучин зураг устгах
    if (req.file?.path && existing.image && existing.image !== updateData.image) {
      fs.unlink(existing.image, (err) => {
        if (err) console.error('Хуучин зураг устгах алдаа:', err);
      });
    }

    await Advice.findByIdAndUpdate(req.params.id, updateData, { new: true });

    res.json({ success: true, message: 'Зөвлөгөө шинэчлэгдлээ.' });
  } catch (err) {
    console.error('Зөвлөгөө шинэчлэх алдаа:', err);
    res.status(500).json({ success: false, message: 'Серверийн алдаа.' });
  }
};
