import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import adminRouter from "./routes/adminRoute.js"
import adviceRouter from './routes/adviceRouter.js';

// ✅ ЭНЭХҮҮ МӨРНҮҮДИЙН ДООР app-г зарлах ёстой
const app = express()
const port = process.env.PORT || 4000

// DB ба Cloudinary холболтууд
connectDB()
connectCloudinary()

// Middlewares
app.use(express.json())
app.use(cors())

// API Endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter) // энд байна
app.use("/api/doctor", doctorRouter)
app.use('/api/advice', adviceRouter) // энэ ч бас энд байх ёстой

// Test route
app.get("/", (req, res) => {
  res.send("API Working")
})

// Server start
app.listen(port, () => console.log(`🚀 Server started on PORT: ${port}`))
