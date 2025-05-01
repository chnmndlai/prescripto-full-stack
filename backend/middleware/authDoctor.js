import jwt from 'jsonwebtoken';

const authDoctor = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Authorization header-аас токеныг авах

  if (!token) {
    return res.status(401).json({ success: false, message: 'Та нэвтэрсэн байх шаардлагатай.' }); // Токен байхгүй бол алдаа харуулах
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Токеныг шалгаж, баталгаажуулах

    req.user = { id: decoded.id }; // Токен зөв байвал хэрэглэгчийн ID-ийг дамжуулах
    req.doctorId = decoded.id;      // Эмчийн ID-ийг дамжуулах
    req.userId = decoded.id;        // Энэ ID-г бусад хэсгүүдэд хэрэглэх

    next(); // Шалгалт амжилттай бол дараагийн middleware рүү шилжих
  } catch (error) {
    res.status(401).json({ success: false, message: 'Токен хүчингүй.' }); // Хэрэв токен буруу эсвэл хүчингүй бол алдаа харуулах
  }
};

export default authDoctor;
