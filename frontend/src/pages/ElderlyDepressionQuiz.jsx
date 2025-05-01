import React, { useState } from 'react';
import axios from 'axios';

const ElderlyDepressionQuiz = () => {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleChange = (e) => {
    setAnswers({
      ...answers,
      [e.target.name]: parseInt(e.target.value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(answers).length < 10) {
      alert("Бүх асуултад хариулна уу!");
      return;
    }

    const totalScore = Object.values(answers).reduce((acc, val) => acc + val, 0);

    let evaluation = '';
    if (totalScore <= 3) evaluation = 'Эрүүл төлөв байна.';
    else if (totalScore <= 6) evaluation = 'Бага зэргийн сэтгэл гутрал илэрч байна.';
    else evaluation = 'Илэрхий сэтгэл гутрал илэрч байна. Мэргэжлийн тусламж авахыг зөвлөж байна.';

    const displayResult = `🧠 Таны нийт оноо: ${totalScore}. Үнэлгээ: ${evaluation}`;

    setResult(displayResult);
    setShowResult(true);

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/quiz-results`, {
        score: totalScore,
        level: evaluation,
        createdAt: new Date(),
        userId: localStorage.getItem('userId') || null
      });
    } catch (error) {
      console.error('Сорил хадгалах үед алдаа:', error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">👵 Настны сэтгэл гутрал илрүүлэх сорил</h2>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg space-y-8">
        {[
          "Та ихэвчлэн гунигтай, гансарсан мэдрэмжтэй байнга байна уу?",
          "Өдөр тутмын зүйлсээс баяр баясгалан авах мэдрэмж тань буурсан уу?",
          "Та амьдралын утга учиргүй мэт санагдах үе олон гардаг уу?",
          "Таны амтлах, үнэрлэх мэдрэмж сулрах, хоолны дуршил буурах шинж илэрч байна уу?",
          "Та орой унтаж чадахгүй эсвэл шөнө сэрээд дахин унтаж чадахгүй байна уу?",
          "Өөрийгөө бусдад хэрэггүй, тус нэмэргүй мэтээр мэдэрч байна уу?",
          "Та сүүлийн үед их ядарч сульдах, амархан цуцдаг болсон уу?",
          "Хийж байсан дуртай үйл ажиллагаандаа сонирхол буурсан уу?",
          "Та ирээдүйгээс айх, ирээдүйд найдваргүй санагдах мэдрэмж мэдэрч байна уу?",
          "Та өөрийгөө бусдад төвөг удсан гэж мэдэрдэг үү?"
        ].map((question, index) => (
          <div key={index} className="border-b pb-5">
            <p className="text-lg font-semibold mb-4">{index + 1}. {question}</p>
            <div className="flex items-center gap-8 text-gray-700">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`q${index + 1}`}
                  value="1"
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                Тийм
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`q${index + 1}`}
                  value="0"
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                Үгүй
              </label>
            </div>
          </div>
        ))}

        <div className="text-center">
          <button
            type="submit"
            className="bg-primary hover:bg-blue-700 text-white font-medium px-10 py-3 rounded-full transition"
          >
            Илгээх
          </button>
        </div>
      </form>

      {showResult && result && (
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg text-blue-700 text-lg font-semibold shadow">
          {result}
        </div>
      )}
    </div>
  );
};

export default ElderlyDepressionQuiz;
