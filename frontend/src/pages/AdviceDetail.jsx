// src/pages/AdviceDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';

const AdviceDetail = () => {
  const { id } = useParams();
  const [advice, setAdvice] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    axios.get(`/api/advice/${id}`).then(res => {
      if (res.data.success) setAdvice(res.data.advice);
    });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Үнэлгээ илгээгдлээ', { adviceId: id, rating, comment });
    setSubmitted(true);
    setRating(0);
    setComment('');
  };

  if (!advice) return <p className="text-center py-20">Уншиж байна...</p>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <img src={advice.image} alt={advice.title} className="w-full h-64 object-cover rounded-xl mb-6" />
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{advice.title}</h1>
      <p className="text-gray-700 mb-6">{advice.summary}</p>

      <hr className="my-6" />
      <h2 className="text-xl font-semibold mb-2">Таны үнэлгээ</h2>

      {submitted ? (
        <p className="text-green-500">Таны үнэлгээг хүлээн авлаа. Баярлалаа!</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(num => (
              <FaStar
                key={num}
                onClick={() => setRating(num)}
                className={`cursor-pointer ${rating >= num ? 'text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <textarea
            rows={4}
            className="w-full border p-2 rounded"
            placeholder="Сэтгэгдэл бичих..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            type="submit"
            className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition"
          >
            Илгээх
          </button>
        </form>
      )}
    </div>
  );
};

export default AdviceDetail;
