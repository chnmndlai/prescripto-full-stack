import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdviceCard from '../components/AdviceCard';

const Advice = () => {
  const [adviceList, setAdviceList] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/advice`)
      .then(res => {
        if (res.data.success) setAdviceList(res.data.advice);
      })
      .catch(err => {
        console.error('Зөвлөгөө татахад алдаа:', err);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">Сэтгэлзүйн зөвлөгөө</h2>

      {adviceList.length === 0 ? (
        <p>Одоогоор зөвлөгөө бүртгэгдээгүй байна.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {adviceList.map((advice) => (
            <AdviceCard key={advice._id} {...advice} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Advice;
