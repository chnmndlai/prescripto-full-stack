import jwt from 'jsonwebtoken';

// User authentication middleware
const authUser = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Нэвтрэх эрхгүй байна. Дахин нэвтэрнэ үү.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // ⬅️ зөв газар хадгалж байна
    next();
  } catch (error) {
    console.error('🔒 JWT Error:', error);
    res.status(401).json({ success: false, message: 'Токен хүчингүй байна.' });
  }
};

export default authUser;
