import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaCheckCircle } from 'react-icons/fa';
import { AppContext } from '../context/AppContext';

const AdviceCard = ({ _id, title, summary, image, doctor, createdAt }) => {
  const { token, savedAdvice = [], toggleSaveAdvice } = useContext(AppContext);
  const [isSaving, setIsSaving] = useState(false);

  const formattedDate = new Date(createdAt).toLocaleDateString('mn-MN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isSaved = savedAdvice?.includes(_id);

  const toggleSave = async () => {
    if (!token) return alert('Нэвтрэх шаардлагатай');
    setIsSaving(true);
    try {
      await toggleSaveAdvice(_id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden max-w-sm flex flex-col justify-between h-full hover:shadow-xl hover:-translate-y-1 transition-transform duration-300">
      
      {/* 🖼 Зургаа бүтэн харуулах */}
      <div className="w-full h-48 bg-white flex items-center justify-center overflow-hidden">
        <img
          src={image}
          alt={title}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-bold text-lg mb-1 truncate">{title}</h3>
          <p className="text-sm text-gray-600 line-clamp-3">
            {summary?.length > 100 ? summary.slice(0, 100) + '...' : summary}
          </p>

          {doctor && (
            <div className="mt-4 text-xs text-gray-600 flex flex-col gap-0.5">
              <p className="font-semibold flex items-center gap-1">
                👨‍⚕️ {doctor.name}
                {doctor.verified && (
                  <FaCheckCircle
                    className="text-blue-500 ml-1"
                    size={12}
                    title="Баталгаажсан эмч"
                  />
                )}
              </p>
              {doctor.speciality && (
                <p className="text-[11px] text-gray-400">{doctor.speciality}</p>
              )}
            </div>
          )}

          <p className="text-[11px] text-gray-400 mt-2">🗓️ {formattedDate}</p>
        </div>

        <div className="mt-auto pt-4 flex justify-between items-center">
          <button
            onClick={toggleSave}
            className={`transition ${isSaved ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
            disabled={isSaving}
          >
            <FaHeart />
          </button>

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
