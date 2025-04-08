// backend/models/quizModel.js
const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  answers: { type: Object, required: true },
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Quiz", quizSchema);
