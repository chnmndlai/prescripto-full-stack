import jwt from 'jsonwebtoken';

const authDoctor = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.json({ success: false, message: 'Not Authorized Login Again' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body.docId = decoded.id;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Invalid or Expired Token' });
  }
};

export default authDoctor;
