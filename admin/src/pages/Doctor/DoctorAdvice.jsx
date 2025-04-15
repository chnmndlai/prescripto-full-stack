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

  // 🎯 Шинээр нэмсэн зөвлөгөөнүүдийг дуудаж харуулах
  const fetchAdvice = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/advice`);
      if (res.data.success) {
        setAdviceList(res.data.advice);
      }
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
      toast.error('Бүх талбарыг бөглөнө үү.');
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
        toast.success('Зөвлөгөө нэмэгдлээ!');
        setTitle('');
        setSummary('');
        setImage(null);
        fetchAdvice(); // 🔄 Шинэ зөвлөгөө ачаална
      } else {
        toast.error(res.data.message || 'Алдаа гарлаа');
      }
    } catch (err) {
      toast.error('Сервертэй холбогдоход алдаа гарлаа');
    }
  };

  // 🗑️ Зөвлөгөө устгах
  const handleDelete = async (id) => {
    if (!confirm('Та энэ зөвлөгөөг устгахдаа итгэлтэй байна уу?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/advice/${id}`, {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      toast.success('Зөвлөгөө устгагдлаа');
      fetchAdvice();
    } catch (err) {
      toast.error('Устгах үед алдаа гарлаа');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-xl p-6 mb-10">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">🩺 Шинэ зөвлөгөө нэмэх</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Зөвлөгөөний гарчиг"
            className="w-full px-4 py-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Тайлбар бичих..."
            className="w-full px-4 py-2 border rounded h-28 resize-none"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          ></textarea>
          <input
            type="file"
            accept="image/*"
            className="w-full"
            onChange={(e) => setImage(e.target.files[0])}
          />
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              className="w-48 mt-2 rounded shadow"
            />
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700"
          >
            Зөвлөгөө нэмэх
          </button>
        </form>
      </div>

      {/* ✅ Жагсаалт хэсэг */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-700">🗂 Миний зөвлөгөөнүүд</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {adviceList.map((a) => (
            <div key={a._id} className="bg-white p-4 rounded-lg shadow-md relative">
              <img src={a.image} alt={a.title} className="w-full h-40 object-cover rounded" />
              <h4 className="text-lg font-semibold mt-2">{a.title}</h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-3">{a.summary}</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => navigate(`/admin/edit-advice/${a._id}`)}
                  className="text-blue-600 hover:underline"
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddAdvice;
