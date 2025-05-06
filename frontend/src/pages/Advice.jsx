import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdviceCard from '../components/AdviceCard';
import { toast } from 'react-toastify';

const Advice = () => {
  const [adviceList, setAdviceList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdvice = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/advice`);
      if (res.data.success) {
        setAdviceList(res.data.advice);
      } else {
        toast.error('Зөвлөгөө татаж чадсангүй');
      }
    } catch (err) {
      console.error('❌ Зөвлөгөө татахад алдаа:', err);
      toast.error('Серверээс өгөгдөл татаж чадсангүй');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvice();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">
        Сэтгэлзүйн зөвлөгөө
      </h2>
      <p className="text-center text-gray-500 text-sm mb-10">
        Танд хэрэгтэй мэдлэг, сэтгэлзүйн тусламжийг эндээс аваарай.
      </p>

      {loading ? (
        <p className="text-center text-gray-400">Уншиж байна...</p>
      ) : adviceList.length === 0 ? (
        <p className="text-center text-gray-600">Одоогоор зөвлөгөө бүртгэгдээгүй байна.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {adviceList.map((advice) => (
            <AdviceCard
              key={advice._id}
              _id={advice._id}
              title={advice.title}
              summary={advice.summary}
              image={advice.image}
              doctor={advice.doctor || null}
              createdAt={advice.createdAt || advice.date || new Date()}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Advice;
