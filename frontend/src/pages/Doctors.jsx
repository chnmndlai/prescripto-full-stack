import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const Doctors = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (!doctors || doctors.length === 0) return;

    const decodedSpeciality = decodeURIComponent(speciality || '').toLowerCase().trim();
    let filtered = doctors;

    if (speciality && decodedSpeciality !== 'all doctors') {
      filtered = filtered.filter(
        (doc) => doc.speciality.toLowerCase().trim() === decodedSpeciality
      );
    }

    if (searchText.trim()) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(searchText.trim().toLowerCase()) ||
        doc.speciality.toLowerCase().includes(searchText.trim().toLowerCase())
      );
    }

    setFilterDoc(filtered);
  }, [doctors, speciality, searchText]);

  const specialties = [
    "Клиник сэтгэл зүйч",
    "Сэтгэцийн эмч",
    "Хүүхдийн сэтгэл зүйч",
    "Зан үйл судлаач",
    "Сэтгэл засалч / зөвлөх",
    "Гэр бүл, хосын сэтгэл зүйч"
  ];

  return (
    <div className="mx-4 sm:mx-10">
      <p className="text-gray-600 text-center">Эмчийн мэргэжлээр шүүн үзэх</p>

      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`}
        >
          Шүүлтүүр
        </button>

        <div className={`sticky top-24 flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <button
            onClick={() => navigate('/doctors/all doctors')}
            className={`border px-4 py-2 rounded hover:bg-blue-50 active:bg-blue-100 transition ${!speciality || decodeURIComponent(speciality).toLowerCase() === 'all doctors' ? 'bg-blue-100 text-blue-600 font-medium' : ''}`}
          >
            Бүх эмч нар
          </button>
          {specialties.map((spec, index) => (
            <button
              key={index}
              onClick={() => navigate(`/doctors/${encodeURIComponent(spec)}`)}
              className={`border px-4 py-2 rounded hover:bg-blue-50 active:bg-blue-100 transition ${decodeURIComponent(speciality).toLowerCase() === spec.toLowerCase() ? 'bg-blue-100 text-blue-600 font-medium' : ''}`}
            >
              {spec}
            </button>
          ))}
        </div>

        <div className='w-full sm:hidden mt-4'>
          <input
            type='text'
            placeholder='Эмчийн нэр эсвэл мэргэжлээр хайх'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary'
          />
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-5">
          {filterDoc.length > 0 ? (
            filterDoc.map((item, index) => (
              <div
                key={index}
                className="flex flex-col justify-between border border-gray-300 rounded-xl bg-white shadow hover:shadow-xl hover:scale-[1.02] transition-transform duration-300 cursor-pointer h-full"
              >
                <img className="w-full h-56 object-cover bg-blue-50 rounded-t-xl" src={item.image} alt={item.name} />
                <div className="flex flex-col justify-between p-4 text-center h-full">
                  <div className="flex justify-center items-center gap-2 text-sm mb-1">
                    <span className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    <span className={`${item.available ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                      {item.available ? 'Чөлөөтэй' : 'Захиалгатай'}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.speciality}</p>
                  <p className="text-xs text-gray-400">{item.experience} туршлагатай</p>

                  <div className="flex justify-center mt-1 text-yellow-500 text-sm">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < Math.round(item.rating || 4.5) ? 'text-yellow-400' : 'text-gray-300'} />
                    ))}
                    <span className="ml-2 text-xs text-gray-600">{item.rating?.toFixed(1) || '4.5'}</span>
                  </div>

                  <button
                    onClick={() => navigate(`/appointment/${item._id}`)}
                    className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm hover:bg-blue-700 transition mt-4"
                  >
                    Цаг авах
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">Уучлаарай, тохирох эмч олдсонгүй.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
