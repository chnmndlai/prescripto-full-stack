import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdviceCard from '../components/AdviceCard';

const Advice = () => {
  const [advice, setAdvice] = useState([]);

  useEffect(() => {
    axios.get('/api/admin/advice-list').then(res => {
      if (res.data.success) setAdvice(res.data.advice);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">Сэтгэлзүйн зөвлөгөө</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {advice.map((item) => (
          <AdviceCard key={item._id} {...item} />
        ))}
      </div>
    </div>
  );
};

export default Advice;