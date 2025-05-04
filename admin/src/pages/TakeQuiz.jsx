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

  const handleChange = (qIndex, option, isCheckbox) => {
    setAnswers((prev) => {
      const prevAnswer = prev[qIndex] || (isCheckbox ? [] : null);
      if (isCheckbox) {
        const already = prevAnswer.find((opt) => opt.label === option.label);
        return {
          ...prev,
          [qIndex]: already
            ? prevAnswer.filter((opt) => opt.label !== option.label)
            : [...prevAnswer, option],
        };
      } else {
        return { ...prev, [qIndex]: option };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(answers).length !== quiz.questions.length) {
      toast.warning('Бүх асуултад хариулна уу!');
      return;
    }

    setIsSubmitting(true);

    try {
      const totalScore = Object.values(answers).reduce((acc, answer) => {
        if (Array.isArray(answer)) {
          return acc + answer.reduce((a, b) => a + (b?.value || 0), 0);
        }
        return acc + (answer?.value || 0);
      }, 0);

      let level = '';
      if (totalScore <= 5) level = 'Эрсдэл бага';
      else if (totalScore <= 10) level = 'Дунд эрсдэл';
      else level = 'Өндөр эрсдэл';

      toast.success(`Та нийт ${totalScore} оноо авч, "${level}" түвшинд байна.`);

    } catch {
      toast.error('Үнэлгээ тооцоолоход алдаа гарлаа');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!quiz) return <p className="p-6">Тест ачаалж байна...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-2 text-blue-700">{quiz.title}</h2>

      {/* Зураг бүтнээрээ */}
      <img 
        src={quiz.image} 
        alt="quiz" 
        className="w-full max-h-96 object-contain rounded-xl border bg-white shadow mb-4"
      />

      <p className="text-gray-600 mb-4">{quiz.summary}</p>

      {/* 🩺 Эмчийн нэр, мэргэжил */}
      {quiz.doctor && (
        <div className="text-sm text-gray-500 mb-6">
          👨‍⚕️ <span className="font-semibold">{quiz.doctor.name}</span>
          {quiz.doctor.speciality && (
            <span className="ml-2 text-gray-400">| {quiz.doctor.speciality}</span>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {quiz.questions.map((q, index) => {
          const isCheckbox = q.type === 'checkbox';
          return (
            <div key={index} className="border p-4 rounded shadow-sm">
              <p className="font-semibold mb-2">
                {index + 1}. {q.question}
              </p>
              <div className="flex flex-col gap-2">
                {q.options.map((option, optIdx) => (
                  <label key={optIdx} className="flex items-center gap-2">
                    <input
                      type={isCheckbox ? 'checkbox' : 'radio'}
                      name={`question-${index}`}
                      checked={
                        isCheckbox
                          ? (answers[index] || []).some((a) => a.label === option.label)
                          : answers[index]?.label === option.label
                      }
                      onChange={() => handleChange(index, option, isCheckbox)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          );
        })}

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
