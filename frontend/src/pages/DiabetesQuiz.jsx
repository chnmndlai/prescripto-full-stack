import React, { useState } from 'react';
import axios from 'axios';

const DiabetesQuiz = () => {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false); // ✨ Шинэ нэмэлт

  const handleChange = (e) => {
    setAnswers({
      ...answers,
      [e.target.name]: parseInt(e.target.value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Бүх 8 асуултыг бөглөсөн эсэхийг шалгах
    if (Object.keys(answers).length < 8) {
      alert("Бүх асуултад хариулна уу!");
      return;
    }

    const totalScore = Object.values(answers).reduce((acc, val) => acc + val, 0);

    let riskLevel = '';
    if (totalScore <= 4) riskLevel = 'Бага';
    else if (totalScore <= 8) riskLevel = 'Дунд';
    else riskLevel = 'Өндөр';

    const displayResult =
      riskLevel === 'Бага'
        ? `✅ Таны нийт оноо: ${totalScore}. Эрсдэл бага байна.`
        : riskLevel === 'Дунд'
        ? `⚠️ Таны нийт оноо: ${totalScore}. Дунд эрсдэлтэй байна.`
        : `🚨 Таны нийт оноо: ${totalScore}. Өндөр эрсдэлтэй! Та эмчид хандаарай.`;

    setResult(displayResult);
    setShowResult(true); // ✨ Илгээсний дараа л харуулна

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/quiz-results`, {
        score: totalScore,
        level: riskLevel,
        createdAt: new Date(),
        userId: localStorage.getItem('userId') || null
      });
    } catch (err) {
      console.error('Quiz хадгалах үед алдаа:', err);
    }
  };

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Чихрийн шижингийн эрсдэлийн үнэлгээ</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Асуултууд */}
        {[
          {
            question: "1. Таны нас хэд вэ?",
            name: "q1",
            options: ["40-с доош", "40–49", "50–59", "60-аас дээш"],
            values: [0, 1, 2, 3],
          },
          {
            question: "2. Таны Биеийн жингийн индекс (BMI) хэд вэ?",
            name: "q2",
            options: ["<25", "25–30", ">30"],
            values: [0, 1, 2],
          },
          {
            question: "3. Та өдөр бүр дасгал хөдөлгөөн хийдэг үү?",
            name: "q3",
            options: ["Тийм", "Үгүй"],
            values: [0, 1],
          },
          {
            question: "4. Таны аав, ээж, ах дүүсээс хэн нэг нь чихрийн шижинтэй юу?",
            name: "q4",
            options: ["Үгүй", "Тийм"],
            values: [0, 2],
          },
          {
            question: "5. Таны бүсэлхийн тойрог хэд вэ?",
            name: "q5",
            options: ["Эрсдэлгүй", "Эрсдэлтэй"],
            values: [0, 1],
          },
          {
            question: "6. Таны цусны даралт өндөр үү?",
            name: "q6",
            options: ["Үгүй", "Тийм"],
            values: [0, 1],
          },
          {
            question: "7. Та чихрийн шижинтэй жирэмсэлж байсан уу?",
            name: "q7",
            options: ["Үгүй", "Тийм"],
            values: [0, 1],
          },
          {
            question: "8. Та чихрийн шижингийн урьдчилсан оноштой байсан уу?",
            name: "q8",
            options: ["Үгүй", "Тийм"],
            values: [0, 2],
          },
        ].map(({ question, name, options, values }, idx) => (
          <div key={idx}>
            <p>{question}</p>
            {options.map((option, i) => (
              <label key={i} className="block">
                <input
                  type="radio"
                  name={name}
                  value={values[i]}
                  onChange={handleChange}
                />{" "}
                {option}
              </label>
            ))}
          </div>
        ))}

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Илгээх
        </button>
      </form>

      {/* Илгээсний дараа үр дүнг харуулах */}
      {showResult && result && (
        <div className="mt-6 p-4 border-l-4 border-blue-500 bg-blue-50 text-blue-800 rounded shadow">
          {result}
        </div>
      )}
    </div>
  );
};

export default DiabetesQuiz;
