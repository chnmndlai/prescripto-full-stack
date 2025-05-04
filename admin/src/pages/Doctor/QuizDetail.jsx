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
      {/* 🖼 Зураг бүтэн харагдах */}
      <img
        src={quiz.image}
        alt={quiz.title}
        className="w-full h-60 object-contain rounded-lg bg-white border shadow mb-4"
      />

      {/* 🧠 Тестийн үндсэн мэдээлэл */}
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

      {/* ✅ Асуултууд харагдах хэсэг */}
      {quiz.questions && quiz.questions.length > 0 && (
        <div className="mt-8 space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">Тестийн асуултууд:</h3>
          {quiz.questions.map((q, index) => (
            <div key={index} className="border p-4 rounded-lg bg-gray-50">
              <p className="font-medium">{index + 1}. {q.question}</p>
              <div className="flex gap-4 mt-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="radio" name={`q-${index}`} value="yes" disabled />
                  Тийм
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name={`q-${index}`} value="no" disabled />
                  Үгүй
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizDetail;
