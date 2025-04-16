import express from "express";
import cors from "cors";
import 'dotenv/config';
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

// Routes
import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";
import adviceRouter from "./routes/adviceRouter.js";
import quizResultRouter from "./routes/quizResultRoute.js";

const app = express();
const port = process.env.PORT || 4000;

// ✅ __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ DB ба Cloudinary холбох
connectDB();
connectCloudinary();

// ✅ Body Parser
app.use(express.json());

// ✅ Ажиллаж буй frontend origin-уудыг зөвшөөрөх
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174'
];

app.use(cors({
  origin: function (origin, callback) {
    // Postman or no origin
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS blocked this origin: " + origin));
    }
  },
  credentials: true,
}));

// ✅ Uploads static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ API маршрут бүртгэл
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/advice", adviceRouter);
app.use("/api/quiz-results", quizResultRouter);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("✅ Prescripto API working!");
});

// ✅ Сервер ажиллуулах
app.listen(port, () => {
  console.log(`🚀 Server started on PORT: ${port}`);
});
