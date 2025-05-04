import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { FaStar } from 'react-icons/fa';

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const topDoctors = doctors.slice(0, 8); // Top 8 doctors

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 px-4 md:px-10">
      <h1 className="text-3xl font-bold text-center">Онцлох эмч нар</h1>
      <p className="sm:w-1/2 text-center text-sm text-gray-600">
        Манай системд хамгийн их захиалга авсан, итгэлтэй эмч нар.
      </p>

      {/* 💠 Картуудын хэсэг */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pt-10">
        {topDoctors.map((item) => (
          <div
            key={item._id}
            onClick={() => navigate(`/appointment/${item._id}`)}
            className="bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer p-6 flex flex-col items-center text-center h-full"
          >
            {/* 🟢 Зураг */}
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 rounded-full border-4 border-white shadow object-cover"
            />

            {/* 👤 Нэр */}
            <h3 className="text-lg font-semibold mt-4">{item.name}</h3>

            {/* 🩺 Туршлага */}
            <p className="text-sm text-blue-600 mt-1">
              {item.experience || 5} жил ажилласан
            </p>

            {/* 🧠 Мэргэжил */}
            <p className="text-sm text-gray-500">{item.speciality}</p>

            {/* ⭐ Үнэлгээ + зөвлөгөө */}
            <div className="flex items-center justify-center gap-1 mt-3 text-sm text-gray-700">
              <FaStar className="text-blue-500" />
              <span className="font-medium text-blue-600">{item.rating || '4.5'}</span>
              <span className="text-xs text-gray-500">• {item.totalAdvice || 150} зөвлөгөө өгсөн</span>
            </div>
          </div>
        ))}
      </div>

      {/* 🔘 Бусад эмч нар харах товч */}
      <button
        onClick={() => navigate('/doctors')}
        className="bg-blue-100 text-gray-700 px-10 py-2 rounded-full mt-10 hover:bg-blue-200 transition font-medium"
      >
        Бусад эмч нар харах
      </button>
    </div>
  );
};

export default TopDoctors;
