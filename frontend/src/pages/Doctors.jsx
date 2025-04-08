import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';

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
        doc.name.toLowerCase().includes(searchText.trim().toLowerCase())
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
    "Гэр бүл, хосын сэтгэл зүйч "
  ];

  return (
    <div className="mx-4 sm:mx-10">
      <p className="text-gray-600 text-center">Эмчийн мэргэжлээр шүүн үзэх</p>

      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        {/* Mobile Filter Button */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? 'bg-primary text-white' : ''
          }`}
        >
          Шүүлтүүр
        </button>

        {/* Filters */}
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <p
            onClick={() => navigate('/doctors/all doctors')}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              !speciality || decodeURIComponent(speciality).toLowerCase() === 'all doctors'
                ? 'bg-[#E2E5FF] text-black'
                : ''
            }`}
          >
            Бүх эмч нар
          </p>
          {specialties.map((spec, index) => (
            <p
              key={index}
              onClick={() => navigate(`/doctors/${encodeURIComponent(spec)}`)}
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
                decodeURIComponent(speciality).toLowerCase() === spec.toLowerCase() ? 'bg-[#E2E5FF] text-black' : ''
              }`}
            >
              {spec}
            </p>
          ))}
        </div>

        {/* Search Input */}
        <div className='w-full sm:hidden mt-4'>
          <input
            type='text'
            placeholder='Эмчийн нэрээр хайх'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary'
          />
        </div>

        {/* Doctors List */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-5">
          {filterDoc.length > 0 ? (
            filterDoc.map((item, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition cursor-pointer"
              >
                <img
                  className="w-full h-56 object-cover bg-blue-50"
                  src={item.image}
                  alt={item.name}
                />
                <div className="p-4 text-center">
                  <div
                    className={`flex items-center justify-center gap-2 text-sm ${
                      item.available ? 'text-green-500' : 'text-gray-500'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.available ? 'bg-green-500' : 'bg-gray-500'
                      }`}
                    ></span>
                    <p>{item.available ? 'Чөлөөтэй' : 'Захиалгатай'}</p>
                  </div>
                  <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                  <p className="text-gray-600 text-sm">{item.speciality}</p>
                  <button
                    onClick={() => navigate(`/appointment/${item._id}`)}
                    className="mt-3 bg-primary text-white px-5 py-2 rounded-full text-sm hover:bg-blue-600 transition"
                  >
                    Цаг авах
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              Уучлаарай, тохирох эмч олдсонгүй.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;