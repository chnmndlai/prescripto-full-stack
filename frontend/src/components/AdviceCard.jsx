import React from 'react';
import { Link } from 'react-router-dom';

const AdviceCard = ({ _id, title, summary, image, doctorId }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-sm">
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-sm text-gray-600">
          {summary.length > 60 ? summary.slice(0, 60) + '...' : summary}
        </p>

        {/* ✅ Эмчийн дэлгэрэнгүй мэдээлэл */}
        {doctorId && (
          <div className="mt-2 text-xs text-gray-500">
            👨‍⚕️ <span className="font-medium">{doctorId.name}</span><br />
            🎓 {doctorId.education}<br />
            🧠 Туршлага: {doctorId.experience} жил
          </div>
        )}

        <Link
          to={`/advice/${_id}`}
          className="inline-block mt-3 text-blue-600 text-sm hover:underline"
        >
          Дэлгэрэнгүй →
        </Link>
      </div>
    </div>
  );
};

export default AdviceCard;
