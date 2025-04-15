import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import adminRouter from "./routes/adminRoute.js"
import adviceRouter from './routes/adviceRouter.js'
import path from "path";
import { fileURLToPath } from "url";
import quizResultRouter from './routes/quizResultRoute.js';
const app = express()
const port = process.env.PORT || 4000

// ✅ DB болон Cloudinary холболт
connectDB()
connectCloudinary()

// ✅ Middleware-ууд
app.use(express.json())
app.use(cors())

// ✅ __dirname workaround (Node ES module дээр)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Зураг үзүүлэх static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ✅ API маршрутууд
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/doctor", doctorRouter)
app.use('/api/advice', adviceRouter)  // ← Зөвлөгөөний API

// ✅ Тест маршрутаар шалгах
app.get("/", (req, res) => {
  res.send("API Working")
})

// ✅ Сервер ажиллуулах
app.listen(port, () => console.log(`🚀 Server started on PORT: ${port}`))

app.use('/api/quiz-results', quizResultRouter);