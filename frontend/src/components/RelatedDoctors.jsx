import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { FaStar } from 'react-icons/fa';

const RelatedDoctors = ({ speciality, docId }) => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  const [relDoc, setRelDoc] = useState([]);

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const filtered = doctors.filter(doc => doc.speciality === speciality && doc._id !== docId);
      setRelDoc(filtered);
    }
  }, [doctors, speciality, docId]);

  return (
    <div className='flex flex-col items-center gap-4 my-16 px-4 text-[#262626]'>
      <h1 className='text-3xl font-semibold'>Холбоотой эмч нар</h1>
      <p className='text-center text-sm text-gray-600 sm:w-1/2'>
        Таны сонгосон чиглэлээр мэргэшсэн бусад эмч нар.
      </p>

      <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6'>
        {relDoc.map((doc) => (
          <div
            key={doc._id}
            className='bg-white border border-[#DDE3F4] rounded-xl overflow-hidden shadow hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer'
          >
            <img className='w-full h-48 object-cover bg-[#EAEFFF]' src={doc.image} alt={doc.name} />
            <div className='p-4 space-y-1'>
              <div className={`flex items-center gap-2 text-sm ${doc.available ? 'text-green-500' : 'text-gray-400'}`}>
                <span className={`w-2 h-2 rounded-full ${doc.available ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                <span>{doc.available ? 'Ажиллаж байна' : 'Завгүй байна'}</span>
              </div>

              <p className='text-lg font-semibold'>{doc.name}</p>
              <p className='text-sm text-gray-500'>{doc.speciality}</p>

              {/* Rating */}
              <div className='flex items-center gap-1 text-yellow-500 text-sm'>
                {Array(Math.round(doc.rating || 4)).fill().map((_, i) => <FaStar key={i} />)}
                <span className='text-gray-600 text-xs'>({doc.rating || '4.5'})</span>
              </div>

              {/* Experience & Education */}
              <p className='text-sm text-gray-600'>Туршлага: {doc.experience || '5'} жил</p>
              <p className='text-sm text-gray-600'>Боловсрол: {doc.education || 'ЭМШУИС'}</p>

              {/* View More */}
              <button
                onClick={() => {
                  navigate(`/appointment/${doc._id}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className='mt-3 px-4 py-2 bg-primary text-white text-sm rounded-full hover:opacity-90 transition'
              >
                Дэлгэрэнгүй үзэх
              </button>
            </div>
          </div>
        ))}
      </div>

      {relDoc.length === 0 && (
        <p className='mt-6 text-sm text-gray-500'>Тухайн чиглэлээр бусад эмч бүртгэгдээгүй байна.</p>
      )}
    </div>
  );
};

export default RelatedDoctors;

