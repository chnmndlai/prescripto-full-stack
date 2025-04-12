import { useEffect, useState } from 'react';
import axios from 'axios';

const DoctorAdvice = () => {
  const [advices, setAdvices] = useState([]);
  const [newAdvice, setNewAdvice] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchAdvices();
  }, []);

  const fetchAdvices = async () => {
    const res = await axios.get('http://localhost:4000/api/advices');
    setAdvices(res.data);
  };

  const handleAddAdvice = async () => {
    if (!newAdvice.title || !newAdvice.content) return;

    const res = await axios.post('http://localhost:4000/api/advices', newAdvice);
    setAdvices([res.data, ...advices]);
    setNewAdvice({ title: '', content: '' });
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">🩺 Эмчийн зөвлөгөө</h2>

      <div className="mb-6 border p-4 rounded bg-blue-50">
        <h3 className="font-semibold mb-2">📤 Зөвлөгөө нэмэх</h3>
        <input
          className="w-full p-2 mb-2 border rounded"
          placeholder="Гарчиг"
          value={newAdvice.title}
          onChange={(e) => setNewAdvice({ ...newAdvice, title: e.target.value })}
        />
        <textarea
          className="w-full p-2 mb-2 border rounded"
          placeholder="Агуулга"
          rows="4"
          value={newAdvice.content}
          onChange={(e) => setNewAdvice({ ...newAdvice, content: e.target.value })}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleAddAdvice}
        >
          Нэмэх
        </button>
      </div>

      {advices.map((advice) => (
        <div key={advice._id} className="mb-4 border-b pb-2">
          <h4 className="text-lg font-semibold">{advice.title}</h4>
          <p className="text-gray-700">{advice.content}</p>
          <p className="text-sm text-gray-400">
            🕓 {new Date(advice.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DoctorAdvice;
