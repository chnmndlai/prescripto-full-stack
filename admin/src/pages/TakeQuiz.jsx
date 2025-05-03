import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from "../context/AppContext";

import { toast } from 'react-toastify';

const TakeQuiz = () => {
  const { backendUrl, token } = useContext(AppContext);
  const { id } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/quiz/${id}`);
        if (res.data.success) {
          setQuiz(res.data.quiz);
        } else {
          toast.error('Тест ачааллаж чадсангүй');
        }
      } catch {
        toast.error('Сервертэй холбогдож чадсангүй');
      }
    };
    fetchQuiz();
  }, [id]);

  const handleChange = (qIndex, option) => {
    setAnswers((prev) => ({
      ...prev,
      [qIndex]: option,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(answers).length !== quiz.questions.length) {
      toast.warning('Бүх асуултад хариулна уу!');
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ Оноо тооцоолох
      const totalScore = Object.values(answers).reduce((acc, option) => acc + (option?.value || 0), 0);

      // ✅ Эрсдлийн түвшин гаргах
      let level = '';
      if (totalScore <= 5) level = 'Эрсдэл бага';
      else if (totalScore <= 10) level = 'Дунд эрсдэл';
      else level = 'Өндөр эрсдэл';

      // ✅ Toast мэдэгдэл
      toast.success(`Та нийт ${totalScore} оноо авч, "${level}" түвшинд байна.`);

      // (хэрэв хадгалах бол энд POST илгээж болно)
      // await axios.post(`${backendUrl}/api/quiz-result/submit`, { quizId: id, answers, totalScore, level }, ...)

    } catch {
      toast.error('Үнэлгээ тооцоолоход алдаа гарлаа');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!quiz) return <p className="p-6">Тест ачаалж байна...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">{quiz.title}</h2>
      <img src={quiz.image} alt="quiz" className="w-full max-h-80 object-cover rounded mb-4" />
      <p className="text-gray-600 mb-6">{quiz.summary}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {quiz.questions.map((q, index) => (
          <div key={index}>
            <p className="font-semibold">{index + 1}. {q.question}</p>
            <div className="flex gap-6 mt-2">
              {q.options.map((option, optIdx) => (
                <label key={optIdx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option.label}
                    checked={answers[index]?.label === option.label}
                    onChange={() => handleChange(index, option)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {isSubmitting ? 'Илгээж байна...' : 'Илгээх'}
        </button>
      </form>
    </div>
  );
};

export default TakeQuiz;
