import jwt from 'jsonwebtoken';

const authDoctor = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Нэвтрэх шаардлагатай.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // 👈 Зөв онооно
    next();
  } catch (error) {
    console.error('authDoctor error:', error);
    res.status(401).json({ success: false, message: 'Токен хүчингүй эсвэл хугацаа дууссан байна.' });
  }
};

export default authDoctor;
