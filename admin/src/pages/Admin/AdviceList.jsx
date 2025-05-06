import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';
import { FaHeart } from 'react-icons/fa';

const AdviceList = () => {
  const [adviceList, setAdviceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const navigate = useNavigate();
  const { aToken } = useContext(AdminContext);

  const tags = ['Сэтгэл гутрал', 'Гэр бүл', 'Стресс', 'Хүүхэд', 'Ажлын стресс'];

  const fetchAdvice = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/advice-list', {
        headers: { Authorization: `Bearer ${aToken}` },
      });
      if (res.data.success) {
        setAdviceList(res.data.advice);
      }
    } catch (error) {
      toast.error('Зөвлөгөө ачааллахад алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Та энэ зөвлөгөөг устгах уу?')) return;
    try {
      const res = await axios.delete(`/api/admin/delete-advice/${id}`, {
        headers: { Authorization: `Bearer ${aToken}` },
      });
      if (res.data.success) {
        toast.success('Устгалаа');
        fetchAdvice();
      }
    } catch (error) {
      toast.error('Устгах үед алдаа гарлаа');
    }
  };

  useEffect(() => {
    fetchAdvice();
  }, []);

  const filteredAdvice = adviceList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item?.doctor?.name?.toLowerCase()?.includes(search.toLowerCase());

    const matchesTag = selectedTag
      ? item.tags?.includes(selectedTag)
      : true;

    return matchesSearch && matchesTag;
  });

  return (
    <div className="max-w-6xl mx-auto p-5">
      {/* Тэргүүн хэсэг: гарчиг + хайлт + нэмэх товч */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">🧠 Зөвлөгөөний жагсаалт</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Гарчиг эсвэл эмчээр хайх..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-1 rounded-md text-sm focus:outline-primary"
          />
          <button
            onClick={() => navigate('/admin/add-advice')}
            className="bg-primary text-white px-4 py-2 rounded-md text-sm hover:opacity-90"
          >
            + Зөвлөгөө нэмэх
          </button>
        </div>
      </div>

      {/* Таг шүүлтүүрүүд */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedTag('')}
          className={`border px-3 py-1 rounded-full text-sm ${!selectedTag ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
        >
          Бүгд
        </button>
        {tags.map((tag, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedTag(tag)}
            className={`border px-3 py-1 rounded-full text-sm ${selectedTag === tag ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Үндсэн хэсэг */}
      {loading ? (
        <p className="text-center text-gray-500">Ачааллаж байна...</p>
      ) : filteredAdvice.length === 0 ? (
        <p className="text-center text-gray-500">Зөвлөгөө олдсонгүй</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAdvice.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 overflow-hidden h-full flex flex-col justify-between"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 flex flex-col justify-between flex-1">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-3">{item.summary}</p>

                <div className="mt-2 text-[11px] text-gray-400">
                  🗓️ {new Date(item.createdAt).toLocaleDateString('mn-MN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>

                {item.doctor && (
                  <div className="mt-2 text-xs text-gray-500">
                    👨‍⚕️ {item.doctor.name}
                    {item.doctor.speciality && <span> — {item.doctor.speciality}</span>}
                  </div>
                )}

                {/* Доод хэсэг */}
                <div className="flex justify-between items-center mt-4 text-sm">
                  <button
                    onClick={() => navigate(`/admin/edit-advice/${item._id}`)}
                    className="text-blue-600 hover:underline"
                  >
                    Засах
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-500 hover:underline"
                  >
                    Устгах
                  </button>
                </div>

                {/* ❤️ Like UI */}
                <div className="mt-2 text-right text-gray-400 hover:text-red-500 transition">
                  <FaHeart className="inline-block" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdviceList;
