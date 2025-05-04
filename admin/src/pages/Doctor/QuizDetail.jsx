import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { DoctorContext } from '../../context/DoctorContext';
import { toast } from 'react-toastify';

const QuizDetail = () => {
  const { id } = useParams();
  const { dToken } = useContext(DoctorContext);
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/quiz/${id}`, {
          headers: { Authorization: `Bearer ${dToken}` },
        });
        if (res.data.success) {
          setQuiz(res.data.quiz);
        } else {
          toast.error('Тест ачааллахад алдаа гарлаа');
        }
      } catch (err) {
        toast.error('Сервертэй холбогдож чадсангүй');
      }
    };

    fetchQuiz();
  }, [id]);

  if (!quiz) return <p className="p-6 text-gray-500">Тестийн мэдээлэл ачаалж байна...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* 🖼 Зураг бүтнээрээ харагдах object-contain */}
      <img
        src={quiz.image}
        alt={quiz.title}
        className="w-full h-60 object-contain rounded-lg bg-white border shadow mb-4"
      />

      <h2 className="text-2xl font-bold text-gray-800">{quiz.title}</h2>
      <p className="text-gray-700 mt-2">{quiz.summary}</p>

      {/* 🩺 Эмчийн мэдээлэл */}
      {quiz.doctor && (
        <div className="mt-4 text-sm text-gray-600 border-t pt-3">
          👨‍⚕️ <span className="font-semibold">{quiz.doctor.name}</span>
          {quiz.doctor.speciality && (
            <span className="ml-2 text-gray-400">| {quiz.doctor.speciality}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizDetail;
