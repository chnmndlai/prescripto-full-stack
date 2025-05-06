import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const QuizDetail = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/quiz/${id}`);
        if (res.data.success) {
          setQuiz(res.data.quiz);
        } else {
          toast.error("Тест олдсонгүй");
        }
      } catch {
        toast.error("Тест ачаалах үед алдаа гарлаа");
      }
    };
    fetchQuiz();
  }, [id]);

  const handleChange = (qIdx, value) => {
    setAnswers({ ...answers, [qIdx]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!quiz || Object.keys(answers).length !== quiz.questions?.length) {
      return toast.error("Бүх асуултад хариулна уу!");
    }

    const yesCount = Object.values(answers).filter((ans) => ans === 'yes').length;
    let riskLevel = '';
    if (yesCount <= 2) riskLevel = '🟢 Эрсдэл бага';
    else if (yesCount <= 4) riskLevel = '🟠 Дунд эрсдэл';
    else riskLevel = '🔴 Өндөр эрсдэл';

    setResult({ yesCount, riskLevel });
    setSubmitted(true);
  };

  if (!quiz) return <div className="p-6 text-center">⏳ Тест ачаалж байна...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* 🖼 Зураг */}
      <div className="flex justify-center mb-6">
        <img
          src={quiz.image}
          alt={quiz.title}
          className="w-full max-w-md aspect-[4/3] object-cover rounded-xl shadow"
        />
      </div>

      {/* 🧠 Гарчиг, тайлбар */}
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">{quiz.title}</h2>
      <p className="text-center text-gray-600 mb-4">{quiz.summary}</p>

      {/* 👨‍⚕️ Эмчийн мэдээлэл */}
      {quiz.doctor && (
        <div className="text-sm text-center text-gray-500 mb-6">
          👨‍⚕️ <span className="font-semibold">{quiz.doctor.name}</span>
          {quiz.doctor.speciality && (
            <span className="ml-2">— {quiz.doctor.speciality}</span>
          )}
        </div>
      )}

      {/* ✅ Үр дүн */}
      {submitted && result && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-5 text-center shadow">
          <p className="text-lg font-semibold text-green-700">
            📝 Та {result.yesCount} удаа "Тийм" гэж хариулсан байна.
          </p>
          <p className="mt-1 text-base text-blue-700 font-medium">{result.riskLevel}</p>

          <div className="mt-5 bg-white border rounded-lg p-4 text-left text-sm text-gray-700 shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-2">🧘 Тайвшруулах зөвлөгөө</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Та ганцаараа биш — энэ бол нийтлэг нөхцөл.</li>
              <li>Өөрийгөө хайрлах цаг гарга.</li>
              <li>Өдөр бүр гүн амьсгал авч бясалгал хийх.</li>
              <li>Хэрэв шаардлагатай бол эмчид хандана уу.</li>
            </ul>
          </div>
        </div>
      )}

      {/* ❓ Асуултууд */}
      {!submitted && quiz.questions && quiz.questions.length > 0 && (
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {quiz.questions.map((q, idx) => (
            <div key={idx} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition">
              <p className="font-medium mb-2">{idx + 1}. {q.question || q}</p>
              <div className="flex gap-6">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name={`q${idx}`}
                    value="yes"
                    checked={answers[idx] === 'yes'}
                    onChange={() => handleChange(idx, 'yes')}
                  />
                  Тийм
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name={`q${idx}`}
                    value="no"
                    checked={answers[idx] === 'no'}
                    onChange={() => handleChange(idx, 'no')}
                  />
                  Үгүй
                </label>
              </div>
            </div>
          ))}
          <button
            type="submit"
            className="block w-full mt-4 bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700 transition"
          >
            Илгээх
          </button>
        </form>
      )}

      {/* ⚠️ Хоосон асуулт */}
      {quiz.questions && quiz.questions.length === 0 && (
        <p className="text-red-500 mt-6 text-center">⚠️ Энэ тест асуултгүй байна.</p>
      )}
    </div>
  );
};

export default QuizDetail;
