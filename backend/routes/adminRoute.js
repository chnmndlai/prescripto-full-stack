import express from 'express';
import { loginAdmin, appointmentsAdmin, appointmentCancel, addDoctor, allDoctors, adminDashboard } from '../controllers/adminController.js';
import { changeAvailablity } from '../controllers/doctorController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';
import { addAdvice, getAdviceList, deleteAdvice, updateAdvice } from '../controllers/adviceController.js';

const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin);
adminRouter.post("/add-doctor", authAdmin, upload.single('image'), addDoctor);
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);
adminRouter.get("/all-doctors", authAdmin, allDoctors);
adminRouter.post("/change-availability", authAdmin, changeAvailablity);
adminRouter.get("/dashboard", authAdmin, adminDashboard);

// Advice routes
adminRouter.get('/advice-list', authAdmin, getAdviceList);
adminRouter.post('/add-advice', authAdmin, upload.single('image'), addAdvice);
adminRouter.delete('/delete-advice/:id', authAdmin, deleteAdvice);
adminRouter.post('/update-advice/:id', authAdmin, upload.single('image'), updateAdvice);

export default adminRouter;
