import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { DoctorContext } from '../../context/DoctorContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const QuizList = () => {
  const { dToken } = useContext(DoctorContext);
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/quiz/my-quizzes`, {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      if (res.data.success) {
        setQuizzes(res.data.quizzes);
      } else {
        toast.error('Тестүүд ачааллахад алдаа гарлаа');
      }
    } catch (err) {
      console.error(err);
      toast.error('Сервертэй холбогдож чадсангүй');
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Та энэ тестийг устгахдаа итгэлтэй байна уу?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/quiz/${id}`, {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      toast.success('Тест устгагдлаа');
      fetchQuizzes();
    } catch (err) {
      console.error(err);
      toast.error('Тест устгах үед алдаа гарлаа');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">🧠 Миний оруулсан сэтгэлзүйн тестүүд</h2>
      {quizzes.length === 0 ? (
        <p className="text-gray-500">Одоогоор тест байхгүй байна.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="bg-white rounded-xl shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden"
            >
              <img
                src={quiz.image}
                alt={quiz.title}
                className="w-full h-48 object-contain bg-gray-50 border-b"
              />
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold truncate">{quiz.title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{quiz.summary}</p>
                <div className="flex justify-center gap-4 mt-3 text-sm">
                  <button
                    onClick={() => navigate(`/doctor/quiz/${quiz._id}`)}
                    className="text-blue-600 hover:underline"
                  >
                    Дэлгэрэнгүй
                  </button>
                  <button
                    onClick={() => navigate(`/doctor/edit-quiz/${quiz._id}`)}
                    className="text-yellow-600 hover:underline"
                  >
                    Засах
                  </button>
                  <button
                    onClick={() => handleDelete(quiz._id)}
                    className="text-red-500 hover:underline"
                  >
                    Устгах
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizList;
