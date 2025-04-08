import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AdviceList = () => {
  const [adviceList, setAdviceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchAdvice = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/advice-list');
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
      const res = await axios.delete(`/api/admin/delete-advice/${id}`);
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

  const filteredAdvice = adviceList.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-5">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">🧠 Зөвлөгөөний жагсаалт</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Хайлт..."
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

      {loading ? (
        <p className="text-center text-gray-500">Ачааллаж байна...</p>
      ) : filteredAdvice.length === 0 ? (
        <p className="text-center text-gray-500">Зөвлөгөө олдсонгүй</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAdvice.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={item.image || '/default.jpg'}
                alt={item.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-3">{item.summary}</p>

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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdviceList;
