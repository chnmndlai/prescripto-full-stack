import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DoctorQuizResults = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem('doctorToken'); // Та JWT-г хадгалсан нэрээ тохируулна уу
        const res = await axios.get('http://localhost:5000/api/quiz/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQuizzes(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Тестийн хариу татахад алдаа гарлаа:', error);
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) return <div>Уншиж байна...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">🧾 Ирсэн тестүүд</h2>
      {quizzes.length === 0 ? (
        <p>Одоогоор илгээгдсэн тест алга байна.</p>
      ) : (
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="border p-4 rounded shadow">
              <p className="font-bold">Хэрэглэгч: {quiz.user?.name} | {quiz.user?.email}</p>
              <p className="text-sm text-gray-500">Огноо: {new Date(quiz.submittedAt).toLocaleString()}</p>
              <ul className="mt-2 list-disc list-inside">
                {Object.entries(quiz.answers).map(([qId, ans], index) => (
                  <li key={index}>
                    <strong>Асуулт {qId}:</strong> {ans}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorQuizResults;
