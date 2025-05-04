import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { DoctorContext } from '../../context/DoctorContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddAdvice = () => {
  const { dToken } = useContext(DoctorContext);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [image, setImage] = useState(null);
  const [adviceList, setAdviceList] = useState([]);
  const navigate = useNavigate();

  const fetchAdvice = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/advice/my-advices`, {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      if (res.data.success) setAdviceList(res.data.advices);
    } catch (err) {
      toast.error('Зөвлөгөөг ачааллаж чадсангүй');
    }
  };

  useEffect(() => {
    fetchAdvice();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !summary || !image) {
      toast.error('Гарчиг, тайлбар болон зургийг бүрэн бөглөнө үү.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('summary', summary);
    formData.append('image', image);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/advice/create`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${dToken}`,
          },
        }
      );

      if (res.data.success) {
        toast.success('Зөвлөгөө амжилттай нэмэгдлээ!');
        setTitle('');
        setSummary('');
        setImage(null);
        fetchAdvice();
      } else {
        toast.error(res.data.message || 'Алдаа гарлаа');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Серверийн алдаа гарлаа');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Та энэ зөвлөгөөг устгахдаа итгэлтэй байна уу?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/advice/${id}`, {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      toast.success('Зөвлөгөө амжилттай устгагдлаа');
      fetchAdvice();
    } catch (err) {
      toast.error('Устгах үед алдаа гарлаа');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* ✅ Шинэ зөвлөгөө оруулах */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-10">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">🩺 Шинэ зөвлөгөө нэмэх</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Гарчиг"
            className="w-full border rounded p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Товч тайлбар"
            className="w-full border rounded p-2 h-28 resize-none"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full"
          />
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              className="w-full max-h-60 object-cover mt-2 rounded shadow"
            />
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Нэмэх
          </button>
        </form>
      </div>

      {/* ✅ Зөвлөгөөний жагсаалт */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-700">📂 Миний зөвлөгөөнүүд</h3>
        {adviceList.length === 0 ? (
          <p className="text-gray-500">Одоогоор зөвлөгөө байхгүй байна.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {adviceList.map((a) => (
              <div key={a._id} className="bg-white rounded-xl shadow hover:shadow-lg transition">
                <img src={a.image} alt={a.title} className="w-full h-48 object-cover rounded-t-xl" />
                <div className="p-4">
                  <h4 className="text-lg font-bold text-gray-800">{a.title}</h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-3">{a.summary}</p>
                  <div className="flex justify-between mt-3 text-sm">
                    <button
                      onClick={() => navigate(`/advice/${a._id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      Дэлгэрэнгүй
                    </button>
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/doctor/edit-advice/${a._id}`)}
                        className="text-green-600 hover:underline"
                      >
                        Засах
                      </button>
                      <button
                        onClick={() => handleDelete(a._id)}
                        className="text-red-500 hover:underline"
                      >
                        Устгах
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddAdvice;
