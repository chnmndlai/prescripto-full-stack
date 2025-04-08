// src/components/AdviceCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdviceCard = ({ _id, title, summary, image }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-all cursor-pointer"
      onClick={() => navigate(`/advice/${_id}`)}
    >
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-600 line-clamp-3">{summary}</p>
        <button className="mt-3 text-primary text-sm font-medium hover:underline">
          Дэлгэрэнгүй →
        </button>
      </div>
    </div>
  );
};

export default AdviceCard;
