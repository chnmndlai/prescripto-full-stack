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

      <div className="w-full flex flex-wrap justify-center gap-6 pt-10">
        {topDoctors.map((item) => (
          <div
            key={item._id}
            onClick={() => navigate(`/appointment/${item._id}`)}
            className="bg-white border rounded-2xl p-5 w-full max-w-[240px] text-center shadow hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            {/* 🟢 Зураг */}
            <img
              src={item.image}
              alt={item.name}
              className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-white shadow"
            />

            {/* 👤 Нэр */}
            <h3 className="text-lg font-semibold mt-4">{item.name}</h3>

            {/* 🩺 Туршлага */}
            <p className="text-sm text-blue-600">{item.experience || 5} жил ажилласан</p>

            {/* 🧠 Мэргэжил */}
            <p className="text-sm text-gray-500 mt-1">{item.speciality}</p>

            {/* ⭐ Үнэлгээ + Зөвлөгөө */}
            <div className="flex justify-center items-center gap-2 mt-3 text-blue-600 font-medium text-sm">
              <FaStar className="text-blue-500" />
              <span>{item.rating || '4.5'}</span>
              <span className="text-xs text-gray-500">• {item.totalAdvice || 150} зөвлөгөө өгсөн</span>
            </div>
          </div>
        ))}
      </div>

      {/* 🔘 Бусад эмч нар харах */}
      <button
        onClick={() => navigate('/doctors')}
        className="bg-blue-100 text-gray-700 px-10 py-2 rounded-full mt-10 hover:bg-blue-200 transition"
      >
        Бусад эмч нар харах
      </button>
    </div>
  );
};

export default TopDoctors;
