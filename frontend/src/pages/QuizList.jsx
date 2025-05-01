import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/quiz/all`); // 🎯 серверээс бүх тестүүдийг авна
      if (res.data.success) {
        setQuizzes(res.data.quizzes);
      }
    } catch (err) {
      toast.error('Сорилуудыг ачааллаж чадсангүй');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6">🧠 Сэтгэлзүйн сорилууд</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div key={quiz._id} className="bg-white rounded-lg shadow-md p-4">
            <img
              src={quiz.image}
              alt={quiz.title}
              className="w-full h-40 object-cover rounded"
            />
            <h3 className="text-lg font-bold mt-3">{quiz.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{quiz.description}</p>
            <div className="flex items-center justify-between mt-4">
              <Link
                to={`/quiz/${quiz._id}`}
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
              >
                Бөглөх
              </Link>
              <span className="text-xs text-gray-400">
                {new Date(quiz.createdAt).toISOString().split('T')[0]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizList;
