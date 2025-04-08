import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { FaStar } from 'react-icons/fa';

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const topDoctors = doctors.slice(0, 8); // Top 8 doctors

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 px-4 md:mx-10">
      <h1 className="text-3xl font-semibold">Топ эмч нар</h1>
      <p className="sm:w-1/2 text-center text-sm text-gray-600">
        Манай системд хамгийн их захиалга авсан, итгэлтэй эмч нар.
      </p>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-5">
        {topDoctors.map((item) => (
          <div
            key={item._id}
            onClick={() => navigate(`/appointment/${item._id}`)}
            className="border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition duration-300 bg-white"
          >
            <img className="w-full h-56 object-cover bg-blue-50" src={item.image} alt={item.name} />

            <div className="p-4 text-center space-y-1">
              <div className={`flex justify-center items-center gap-2 text-sm ${item.available ? 'text-green-500' : 'text-gray-500'}`}>
                <span className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                <p>{item.available ? 'Ажиллаж байна' : 'Завгүй'}</p>
              </div>

              <p className="text-lg font-semibold">{item.name}</p>
              <p className="text-sm text-gray-600">{item.speciality}</p>

              {/* Rating */}
              <div className="flex justify-center gap-1 text-yellow-500 text-sm">
                {Array(Math.round(item.rating || 4)).fill().map((_, i) => <FaStar key={i} />)}
                <span className="text-gray-600 text-xs ml-1">({item.rating || '4.5'})</span>
              </div>

              {/* Experience & Education */}
              <p className="text-xs text-gray-500">Туршлага: {item.experience || 5} жил</p>
              <p className="text-xs text-gray-500">Боловсрол: {item.education || 'ЭМШУИС'}</p>
            </div>
          </div>
        ))}
      </div>

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
