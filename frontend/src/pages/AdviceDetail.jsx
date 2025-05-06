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
    <div className="w-full px-1 py-6">
      <div className="max-w-screen-sm mx-auto bg-white p-4 rounded-lg shadow">

        {/* 🖼 Зураг */}
        <img
          src={advice.image}
          alt={advice.title}
          className="w-full max-w-[320px] max-h-[250px] mx-auto object-contain rounded mb-4"
        />

        {/* 📝 Гарчиг */}
        <h1 className="text-xl font-bold text-center text-gray-800 mb-3">
          {advice.title}
        </h1>

        {/* 👨‍⚕️ Эмч */}
        {advice.doctor && (
          <div className="text-sm text-center text-gray-600 mb-4">
            👨‍⚕️ <span className="font-medium">{advice.doctor.name}</span>
            {advice.doctor.speciality && (
              <span className="ml-2 text-gray-400">| {advice.doctor.speciality}</span>
            )}
          </div>
        )}

        {/* 📖 Зөвлөгөө paragraph-уудаар */}
        <div className="text-gray-800 text-[15px] leading-7 text-justify whitespace-pre-line space-y-4">
          {advice.summary.split('\n\n').map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {/* 🌟 Үнэлгээ, сэтгэгдэл */}
        <div className="mt-8 border-t pt-5">
          <h2 className="font-semibold text-base mb-2">Таны үнэлгээ</h2>
          <div className="flex items-center space-x-1 text-yellow-500 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s}>★</span>
            ))}
          </div>
          <textarea
            rows={3}
            placeholder="Сэтгэгдэл бичих..."
            className="w-full p-2 border rounded resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="mt-3 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Илгээх
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdviceDetail;
