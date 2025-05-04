import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdviceDetail = () => {
  const { id } = useParams();
  const [advice, setAdvice] = useState(null);

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/advice/${id}`);
        if (res.data.success) {
          setAdvice(res.data.advice);
        } else {
          toast.error('Зөвлөгөө ачааллаж чадсангүй');
        }
      } catch (err) {
        toast.error('Сервертэй холбогдож чадсангүй');
      }
    };
    fetchAdvice();
  }, [id]);

  if (!advice) return <p className="text-center mt-10">Уншиж байна...</p>;

  return (
    <div className="w-full px-2 sm:px-4 md:px-8 py-6">
      <div className="max-w-2xl mx-auto">
        <img
          src={advice.image}
          alt={advice.title}
          className="w-full sm:w-[350px] max-h-[300px] object-contain rounded-xl mb-6 mx-auto shadow"
        />

        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">{advice.title}</h1>
        <p className="text-gray-700 text-base mb-4 text-justify">{advice.summary}</p>

        {advice.doctor && (
          <div className="text-sm text-gray-500 mb-2 text-center">
            👨‍⚕️ <span className="font-medium">{advice.doctor.name}</span>
            {advice.doctor.speciality && (
              <span className="ml-2 text-gray-400">| {advice.doctor.speciality}</span>
            )}
          </div>
        )}

        {/* ✨ Үнэлгээ, сэтгэгдэл хэсэг */}
        <div className="mt-6 border-t pt-4">
          <h2 className="font-semibold mb-2">Таны үнэлгээ</h2>
          <div className="flex items-center space-x-1 text-yellow-500 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s}>★</span>
            ))}
          </div>
          <textarea
            rows={4}
            placeholder="Сэтгэгдэл бичих..."
            className="w-full p-2 border rounded resize-none"
          />
          <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Илгээх
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdviceDetail;
