import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import adminRouter from "./routes/adminRoute.js"
import adviceRouter from './routes/adviceRouter.js'

// ✅ app-ийг зарлаж байна
const app = express()
const port = process.env.PORT || 4000

// ✅ DB болон Cloudinary холболт
connectDB()
connectCloudinary()

// ✅ Middleware-ууд
app.use(express.json())
app.use(cors())

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
