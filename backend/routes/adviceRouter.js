import express from 'express';
import Advice from '../models/adviceModel.js';

const adviceRouter = express.Router();

// GET advice by ID (Detail view)
adviceRouter.get('/:id', async (req, res) => {
  try {
    const advice = await Advice.findById(req.params.id);
    if (!advice) {
      return res.status(404).json({ success: false, message: 'Зөвлөгөө олдсонгүй' });
    }
    res.json({ success: true, advice });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Серверийн алдаа' });
  }
});

export default adviceRouter;
