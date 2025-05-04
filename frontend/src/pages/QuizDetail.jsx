import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const QuizDetail = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null); // ✅ оноо, эрсдэл хадгалах

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

  if (!quiz) return <div className="p-6">Тест ачаалж байна...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* 🖼 Зураг */}
      <div className="flex justify-center mb-4">
        <img
          src={quiz.image}
          alt={quiz.title}
          className="rounded-xl shadow w-full max-w-md h-auto object-contain"
        />
      </div>

      {/* 🧠 Гарчиг */}
      <h2 className="text-2xl font-bold mb-1">{quiz.title}</h2>
      <p className="text-gray-700 mb-2">{quiz.summary}</p>

      {/* 👨‍⚕️ Эмчийн мэдээлэл */}
      {quiz.doctor && (
        <div className="text-sm text-gray-500 mb-4">
          👨‍⚕️ <span className="font-semibold">{quiz.doctor.name}</span>
          {quiz.doctor.speciality && (
            <span className="ml-1">| {quiz.doctor.speciality}</span>
          )}
        </div>
      )}

      {/* ✅ Хариулсны дараах үнэлгээ */}
      {submitted && result && (
        <div className="mt-4 p-4 bg-gray-100 rounded text-center">
          <p className="text-lg font-semibold text-green-700">
            📝 Та {result.yesCount} удаа "Тийм" гэж хариулсан байна.
          </p>
          <p className="mt-2 text-base text-blue-700">{result.riskLevel}</p>
        </div>
      )}

      {/* 📋 Асуултууд */}
      {!submitted && quiz.questions && quiz.questions.length > 0 && (
        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          {quiz.questions.map((q, idx) => (
            <div key={idx} className="border-b pb-4">
              <p className="mb-2 font-medium">{idx + 1}. {q.question || q}</p>
              <label className="mr-4">
                <input
                  type="radio"
                  name={`q${idx}`}
                  value="yes"
                  checked={answers[idx] === 'yes'}
                  onChange={() => handleChange(idx, 'yes')}
                /> Тийм
              </label>
              <label>
                <input
                  type="radio"
                  name={`q${idx}`}
                  value="no"
                  checked={answers[idx] === 'no'}
                  onChange={() => handleChange(idx, 'no')}
                /> Үгүй
              </label>
            </div>
          ))}
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Илгээх
          </button>
        </form>
      )}

      {quiz.questions && quiz.questions.length === 0 && (
        <p className="text-red-500">⚠️ Асуулт алга байна.</p>
      )}
    </div>
  );
};

export default QuizDetail;
