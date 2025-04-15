import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DoctorQuizResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null); // дэлгэрэнгүй toggle

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('doctorToken');
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/quiz-results`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.data.success) {
          setResults(res.data.results);
        }
      } catch (error) {
        console.error('Тестийн үр дүн татахад алдаа:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-6">Уншиж байна...</div>;

  return (
    <div className='p-6'>
      <h2 className='text-2xl font-semibold mb-4'>🧾 Ирсэн сэтгэлзүйн тестүүд</h2>

      {results.length === 0 ? (
        <p>Одоогоор тестийн үр дүн байхгүй байна.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className='w-full border text-sm'>
            <thead>
              <tr className="bg-gray-100">
                <th className='border p-2'>№</th>
                <th className='border p-2'>Хэрэглэгч</th>
                <th className='border p-2'>Оноо</th>
                <th className='border p-2'>Эрсдэл</th>
                <th className='border p-2'>Огноо</th>
                <th className='border p-2'>Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res, i) => (
                <React.Fragment key={res._id}>
                  <tr className="hover:bg-gray-50">
                    <td className='border p-2'>{i + 1}</td>
                    <td className='border p-2'>{res.userId?.name || 'Тодорхойгүй'}</td>
                    <td className='border p-2'>{res.score}</td>
                    <td className='border p-2'>{res.level}</td>
                    <td className='border p-2'>{new Date(res.createdAt).toLocaleString()}</td>
                    <td className='border p-2'>
                      <button
                        className="text-blue-600 underline"
                        onClick={() => setExpanded(expanded === res._id ? null : res._id)}
                      >
                        {expanded === res._id ? 'Хураах' : 'Дэлгэрэнгүй'}
                      </button>
                    </td>
                  </tr>

                  {expanded === res._id && res.answers && (
                    <tr>
                      <td colSpan="6" className="border p-4 bg-gray-50">
                        <h4 className='font-semibold mb-2'>📝 Хариултууд:</h4>
                        <ul className='list-disc list-inside space-y-1'>
                          {Object.entries(res.answers).map(([key, val], idx) => (
                            <li key={idx}><strong>Асуулт {key}:</strong> {val}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DoctorQuizResults;
