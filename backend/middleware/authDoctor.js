import jwt from 'jsonwebtoken';

const authDoctor = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Та нэвтэрсэн байх шаардлагатай.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id };
    req.doctorId = decoded.id;
    req.userId = decoded.id;

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Токен хүчингүй.' });
  }
};

export default authDoctor;
