import jwt from 'jsonwebtoken';

// User authentication middleware
const authUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Нэвтрэх эрхгүй байна. Дахин нэвтэрнэ үү.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error('🔒 JWT Error:', error);
    res.status(401).json({ success: false, message: 'Токен хүчингүй байна.' });
  }
};

export default authUser;
