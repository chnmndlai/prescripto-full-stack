// backend/routes/quizRoute.js
const express = require("express");
const router = express.Router();
const { submitQuiz, getAllQuizzes } = require("../controllers/quizController");
const { authDoctor, authUser } = require("../middleware/authUser");

router.post("/submit", authUser, submitQuiz);
router.get("/all", authDoctor, getAllQuizzes); // зөвхөн эмч нар хянаж үзнэ

module.exports = router;
