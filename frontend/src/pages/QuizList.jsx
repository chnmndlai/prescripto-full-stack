import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/quiz/all`);
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
          <div key={quiz._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all">
            <img
              src={quiz.image}
              alt={quiz.title}
              className="w-full h-60 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold mb-1 text-gray-800">{quiz.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">{quiz.description}</p>

              {/* 👨‍⚕️ Эмчийн нэр */}
              {quiz.doctor && (
                <div className="text-xs text-gray-500 mb-3">
                  👨‍⚕️ <span className="font-medium">{quiz.doctor.name}</span>
                  {quiz.doctor.speciality && (
                    <span className="ml-1 text-gray-400">| {quiz.doctor.speciality}</span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between">
                <Link
                  to={`/quiz/${quiz._id}`}
                  className="bg-primary text-white px-4 py-1 rounded-full text-sm hover:bg-indigo-700 transition"
                >
                  Бөглөх
                </Link>
                <span className="text-xs text-gray-400">
                  {new Date(quiz.createdAt).toLocaleDateString('mn-MN')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizList;
