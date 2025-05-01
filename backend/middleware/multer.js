import multer from "multer";
import path from "path";
import fs from "fs";

// Uploads хавтасыг үүсгэх (локал файл түр хадгалах)
const uploadDir = "backend/uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Файлыг дискт түр хадгалах тохиргоо
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("📁 Файл хадгалах зам:", uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `${name}-${uniqueSuffix}${ext}`;
    console.log("📸 Файл нэр:", filename);
    cb(null, filename);
  },
});

// Зөвхөн зурган файл хүлээн авах
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.warn("❌ Зурагны MIME төрөл буруу:", file.mimetype);
    cb(new Error('⛔ Зөвхөн JPG, PNG зураг хүлээн авна.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default upload;
