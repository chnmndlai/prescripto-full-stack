import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const QuizDetail = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

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
    toast.success(`Та нийт ${yesCount} удаа "Тийм" гэж хариулсан байна.`);
    setSubmitted(true);
  };

  if (!quiz) return <div className="p-6">Тест ачаалж байна...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <img src={quiz.image} alt={quiz.title} className="w-full h-64 object-cover rounded mb-4" />
      <h2 className="text-2xl font-bold mb-2">{quiz.title}</h2>
      <p className="text-gray-700 mb-4">{quiz.description}</p>

      {!submitted && quiz.questions && quiz.questions.length > 0 && (
        <form onSubmit={handleSubmit} className="space-y-5">
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

      {/* Хэрвээ асуултууд байхгүй бол энэ текстийг харуулна */}
      {quiz.questions && quiz.questions.length === 0 && (
        <p className="text-red-500">⚠️ Асуугдах асуулт байхгүй байна.</p>
      )}
    </div>
  );
};

export default QuizDetail;
