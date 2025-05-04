import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdviceCard from '../components/AdviceCard';

const Advice = () => {
  const [adviceList, setAdviceList] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/advice`)
      .then((res) => {
        if (res.data.success) setAdviceList(res.data.advice);
      })
      .catch((err) => {
        console.error('Зөвлөгөө татахад алдаа:', err);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">Сэтгэлзүйн зөвлөгөө</h2>
      <p className="text-center text-gray-500 text-sm mb-10">
        Танд хэрэгтэй мэдлэг, сэтгэлзүйн тусламжийг эндээс аваарай.
      </p>

      {adviceList.length === 0 ? (
        <p className="text-center text-gray-600">Одоогоор зөвлөгөө бүртгэгдээгүй байна.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {adviceList.map((advice) => (
            <AdviceCard key={advice._id} {...advice} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Advice;
