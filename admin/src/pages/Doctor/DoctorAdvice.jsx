import React, { useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { DoctorContext } from '../../context/DoctorContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { MdDelete, MdEdit, MdOpenInNew, MdImage, MdClose, MdCheckCircle, MdErrorOutline } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

const AddAdvice = () => {
  const { dToken } = useContext(DoctorContext);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [image, setImage] = useState(null);
  const [adviceList, setAdviceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(null);
  const [error, setError] = useState({});
  const [addSuccess, setAddSuccess] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Autofocus
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  // Advice fetch
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
  useEffect(() => { fetchAdvice(); }, []);

  // Drag&Drop
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) setImage(file);
      else toast.error('Зөвхөн зураг файл сонгоно уу');
    }
  };
  const handleDragOver = (e) => e.preventDefault();

  // Validation
  const validate = () => {
    let e = {};
    if (!title.trim()) e.title = 'Гарчиг шаардлагатай';
    if (!summary.trim()) e.summary = 'Тайлбар шаардлагатай';
    if (!image) e.image = 'Зураг шаардлагатай';
    setError(e);
    return Object.keys(e).length === 0;
  };

  // Advice нэмэх
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
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
        toast.success('Зөвлөгөө амжилттай нэмэгдлээ! 🎉');
        setAddSuccess(true);
        setTimeout(() => setAddSuccess(false), 1400);
        setTitle('');
        setSummary('');
        setImage(null);
        setError({});
        fetchAdvice();
      } else {
        toast.error(res.data.message || 'Алдаа гарлаа');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Серверийн алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  // Advice устгах
  const handleDelete = async (id) => {
    if (!confirm('Та энэ зөвлөгөөг устгахдаа итгэлтэй байна уу?')) return;
    try {
      setLoadingDelete(id);
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/advice/${id}`, {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      toast.success('Зөвлөгөө амжилттай устгагдлаа');
      fetchAdvice();
    } catch (err) {
      toast.error('Устгах үед алдаа гарлаа');
    } finally {
      setLoadingDelete(null);
    }
  };

  // Image remove
  const handleImageRemove = () => setImage(null);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* ✅ Зөвлөгөө нэмэх */}
      <motion.div
        initial={{ y: 25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`bg-white rounded-2xl shadow-xl p-6 mb-10 relative border 
          ${addSuccess ? 'border-green-400 animate-pulse' : 'border-transparent'} transition`}
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
          <MdImage className="text-blue-500" /> Шинэ зөвлөгөө нэмэх
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              ref={inputRef}
              type="text"
              placeholder="Гарчиг"
              className={`w-full border rounded-xl px-4 py-3 text-base transition 
                ${error.title ? 'border-red-400' : 'border-gray-200'}
                focus:outline-none focus:ring-2 focus:ring-blue-100`}
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={100}
            />
            {error.title && (
              <div className="text-red-500 text-xs flex items-center gap-1 mt-1"><MdErrorOutline /> {error.title}</div>
            )}
          </div>
          <div>
            <textarea
              placeholder="Товч тайлбар"
              className={`w-full border rounded-xl px-4 py-3 h-24 resize-none transition 
                ${error.summary ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-100`}
              value={summary}
              onChange={e => setSummary(e.target.value)}
              maxLength={350}
            />
            {error.summary && (
              <div className="text-red-500 text-xs flex items-center gap-1 mt-1"><MdErrorOutline /> {error.summary}</div>
            )}
          </div>
          {/* Image Upload - Card style */}
          <div
            className={`w-full bg-blue-50 border-dashed border-2 rounded-xl flex flex-col items-center justify-center py-6 cursor-pointer transition 
              ${error.image ? 'border-red-400' : 'border-blue-100'}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById('advice-image').click()}
          >
            {!image ? (
              <>
                <MdImage className="text-4xl text-blue-400 mb-2" />
                <span className="text-blue-600 font-semibold">Зураг сонгох эсвэл чирж оруулна уу</span>
                <input
                  id="advice-image"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={e => {
                    const f = e.target.files[0];
                    if (f && f.type.startsWith('image/')) setImage(f);
                    else toast.error('Зөвхөн зураг файл сонгоно уу');
                  }}
                />
                {error.image && (
                  <div className="text-red-500 text-xs flex items-center gap-1 mt-2"><MdErrorOutline /> {error.image}</div>
                )}
              </>
            ) : (
              <div className="relative group w-full max-w-xs mx-auto">
                <img
                  src={URL.createObjectURL(image)}
                  alt="preview"
                  className="w-full max-h-56 object-cover rounded-xl shadow border border-blue-200"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow hover:bg-red-100 transition"
                  onClick={e => { e.stopPropagation(); handleImageRemove(); }}
                  title="Зураг устгах"
                >
                  <MdClose className="text-red-600 text-lg" />
                </button>
              </div>
            )}
          </div>
          {/* Submit button */}
          <button
            type="submit"
            className={`w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-semibold py-3 rounded-full shadow hover:bg-blue-700 transition active:scale-95
              ${loading ? 'opacity-60 pointer-events-none' : ''}`}
            disabled={loading}
          >
            {loading && (
              <span className="animate-spin">
                <svg width="22" height="22" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="20" stroke="white" strokeWidth="4" strokeLinecap="round" strokeDasharray="90 90" strokeDashoffset="0" /></svg>
              </span>
            )}
            {loading ? 'Нэмэгдэж байна...' : 'Нэмэх'}
          </button>
        </form>
        {/* Success effect */}
        <AnimatePresence>
          {addSuccess && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="absolute top-5 right-8 flex items-center gap-1 text-green-600 text-lg font-bold bg-green-50 px-3 py-1 rounded-full shadow"
            >
              <MdCheckCircle /> Амжилттай!
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ✅ Advice Card List - DOCTOR CARD STYLE */}
      <div>
        <h3 className="text-xl font-semibold mb-5 text-gray-700 flex items-center gap-2">
          <span className="inline-block bg-blue-100 text-blue-600 rounded-full px-2 py-1 text-xs font-bold">ЗӨВЛӨГӨӨ</span>
          Миний зөвлөгөөнүүд
          <span className="ml-2 bg-gray-100 text-gray-500 rounded-full px-3 py-0.5 text-xs">{adviceList.length} нийт</span>
        </h3>
        {adviceList.length === 0 ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-500">
            Одоогоор зөвлөгөө байхгүй байна.
          </motion.p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {adviceList.map((a) => (
                <motion.div
                  key={a._id}
                  layout
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-blue-100 transition group flex flex-col relative"
                  whileHover={{ y: -4, scale: 1.03, borderColor: '#6366f1' }}
                >
                  <div className="flex flex-col items-center px-4 pt-8">
                    <div className="relative w-24 h-24 -mt-12 mb-2 z-10">
                      <img
                        src={a.image}
                        alt={a.title}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        style={{ background: '#f3f4f6' }}
                      />
                      <span className="absolute top-1 right-1 bg-white/90 rounded-full p-1">
                        <MdImage className="text-blue-400 text-lg" />
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-800 text-center mb-1">{a.title}</h4>
                    <div className="text-blue-700 text-sm font-medium text-center mb-1">{a.createdAt?.slice(0, 10) || ''}</div>
                    <p className="text-gray-600 text-sm text-center line-clamp-3 mb-3">{a.summary}</p>
                  </div>
                  <div className="flex justify-center gap-2 mb-3 mt-auto">
                    <button
                      onClick={() => navigate(`/advice/${a._id}`)}
                      className="flex items-center gap-1 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full px-4 py-2 transition text-xs font-semibold shadow-sm"
                    >
                      <MdOpenInNew /> Дэлгэрэнгүй
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-2 pb-3">
                    <button
                      onClick={() => navigate(`/doctor/edit-advice/${a._id}`)}
                      className="flex items-center gap-1 text-green-600 hover:bg-green-50 rounded-full px-2 py-1 transition text-xs font-bold"
                      title="Засах"
                    >
                      <MdEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(a._id)}
                      className={`flex items-center gap-1 text-red-500 hover:bg-red-50 rounded-full px-2 py-1 transition text-xs font-bold
                        ${loadingDelete === a._id ? 'opacity-50 pointer-events-none' : ''}`}
                      disabled={loadingDelete === a._id}
                      title="Устгах"
                    >
                      {loadingDelete === a._id ? (
                        <span className="animate-spin"><MdDelete /></span>
                      ) : (
                        <MdDelete />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddAdvice;
