import React from 'react';
import { specialityData } from '../assets/assets';
import { Link } from 'react-router-dom';

const SpecialityMenu = () => {
  return (
    <div
      id='speciality'
      className='flex flex-col items-center gap-4 py-16 text-[#262626] px-4'
    >
      <h1 className='text-3xl font-semibold'>Мэргэжлээр хайх</h1>
      <p className='sm:w-1/2 text-center text-sm text-gray-600'>
        Найдвартай, туршлагатай эмч нараас мэргэжлээр нь шүүж, цаг захиалаарай.
      </p>

      {/* ✅ Хоорондын зайг ижил болгосон хэсэг */}
      <div className='flex flex-wrap justify-center gap-8 pt-8 w-full'>
        {specialityData.map((item, index) => (
          <Link
            key={index}
            to={`/doctors/${item.speciality}`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className='flex flex-col items-center text-sm w-32 hover:-translate-y-2 transition-transform duration-300 cursor-pointer'
          >
            <div className='w-24 h-24 bg-[#f3f4f6] rounded-full flex items-center justify-center shadow hover:shadow-md transition'>
              <img className='w-12 h-12 object-contain' src={item.image} alt={item.speciality} />
            </div>
            <p className='mt-2 text-center font-medium'>{item.speciality}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;
