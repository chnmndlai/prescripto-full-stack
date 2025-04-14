import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "backend/uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, uploadDir);
  },
  filename: function (req, file, callback) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    callback(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage: storage });
export default upload;