import React from 'react';
import { Link } from 'react-router-dom';

const AdviceCard = ({ _id, title, summary, image, doctor }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-sm flex flex-col justify-between h-full">
      {/* 📷 Зураг — бүтэн харагдах */}
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-contain bg-white"
      />

      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-bold text-lg mb-1 line-clamp-2">{title}</h3>
          <p className="text-sm text-gray-600 line-clamp-3">
            {summary.length > 100 ? summary.slice(0, 100) + '...' : summary}
          </p>

          {doctor && (
            <div className="mt-4 text-xs text-gray-600">
              <p className="font-semibold">👨‍⚕️ {doctor.name}</p>
              {doctor.speciality && (
                <p className="text-[11px] text-gray-400">{doctor.speciality}</p>
              )}
            </div>
          )}
        </div>

        {/* ➡️ Дэлгэрэнгүй — доод хэсэгт нэг эгнээнд байлгана */}
        <div className="mt-auto pt-4">
          <Link
            to={`/advice/${_id}`}
            className="text-blue-600 text-sm hover:underline"
          >
            Дэлгэрэнгүй →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdviceCard;
