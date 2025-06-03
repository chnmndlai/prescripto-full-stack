import React, { useContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { DoctorContext } from '../../context/DoctorContext';
import { toast } from 'react-toastify';
import { MdError, MdClose, MdEdit, MdCheckCircle, MdArrowBack } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

const EditAdvice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dToken } = useContext(DoctorContext);

  const [advice, setAdvice] = useState(null);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [newImage, setNewImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState({});
  const [success, setSuccess] = useState(false);

  const titleRef = useRef(null);

  useEffect(() => {
    if (!loading && titleRef.current) titleRef.current.focus();
  }, [loading]);

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/advice/${id}`, {
          headers: { Authorization: `Bearer ${dToken}` }
        });
        if (res.data.success) {
          setAdvice(res.data.advice);
          setTitle(res.data.advice.title);
          setSummary(res.data.advice.summary);
          setPreviewImage(res.data.advice.image);
        } else {
          toast.error('Зөвлөгөө ачааллаж чадсангүй');
        }
      } catch {
        toast.error('Серверийн алдаа');
      } finally {
        setLoading(false);
      }
    };
    if (dToken) fetchAdvice();
  }, [id, dToken]);

  const validate = () => {
    let e = {};
    if (!title.trim()) e.title = "Гарчиг шаардлагатай";
    if (!summary.trim()) e.summary = "Тайлбар шаардлагатай";
    setError(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('summary', summary);
    if (newImage) formData.append('image', newImage);

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/advice/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${dToken}`,
          },
        }
      );
      if (res.data.success) {
        toast.success('Амжилттай заслаа!');
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          navigate('/doctor-advice');
        }, 1100);
      } else {
        toast.error('Засвар амжилтгүй');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Серверийн алдаа');
    } finally {
      setSaving(false);
    }
  };

  // Image remove
  const removeImage = () => setNewImage(null);

  // Drag&Drop image upload
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) setNewImage(file);
      else toast.error('Зөвхөн зураг файл сонгоно уу');
    }
  };

  // Loading Skeleton
  if (loading) {
    return (
      <div className="w-full max-w-4xl min-w-[370px] mx-auto mt-12 p-8">
        <div className="animate-pulse bg-gray-100 rounded-2xl h-16 w-3/5 mb-8" />
        <div className="animate-pulse bg-gray-100 rounded-xl h-10 w-full mb-4" />
        <div className="animate-pulse bg-gray-100 rounded-xl h-32 w-full mb-7" />
        <div className="animate-pulse bg-gray-100 rounded-xl h-14 w-60 mb-4" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full max-w-4xl min-w-[370px] mx-auto p-10 sm:p-12 bg-white rounded-[32px] shadow-2xl border border-blue-100 relative"
    >
      <div className="flex items-center mb-8 gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-blue-500 hover:bg-blue-50 p-3 rounded-full"
        >
          <MdArrowBack className="text-3xl" />
        </button>
        <h2 className="text-3xl font-extrabold text-blue-700 flex items-center gap-2">
          <MdEdit /> Зөвлөгөө засах
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-7">
        {/* Title */}
        <div>
          <input
            ref={titleRef}
            type="text"
            placeholder="Гарчиг"
            className={`w-full border rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition ${error.title ? 'border-red-400' : 'border-gray-200'}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            autoFocus
          />
          {error.title && (
            <div className="text-red-500 text-sm flex items-center gap-1 mt-1"><MdError /> {error.title}</div>
          )}
        </div>
        {/* Summary */}
        <div>
          <textarea
            placeholder="Товч тайлбар"
            className={`w-full border rounded-2xl px-6 py-4 text-base h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 transition ${error.summary ? 'border-red-400' : 'border-gray-200'}`}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            maxLength={350}
          />
          {error.summary && (
            <div className="text-red-500 text-sm flex items-center gap-1 mt-1"><MdError /> {error.summary}</div>
          )}
        </div>
        {/* Image Upload + Drag&Drop */}
        <div
          className="w-full bg-blue-50 border-dashed border-2 rounded-2xl flex flex-col items-center justify-center py-10 cursor-pointer transition"
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => document.getElementById('advice-image-edit').click()}
        >
          {!newImage && !previewImage && (
            <>
              <span className="text-blue-500 font-semibold text-base">Зураг сонгох эсвэл чирж оруулна уу</span>
              <input
                id="advice-image-edit"
                type="file"
                accept="image/*"
                hidden
                onChange={e => {
                  const f = e.target.files[0];
                  if (f && f.type.startsWith('image/')) setNewImage(f);
                  else toast.error('Зөвхөн зураг файл сонгоно уу');
                }}
              />
            </>
          )}
          {(previewImage || newImage) && (
            <div className="relative group">
              <img
                src={newImage ? URL.createObjectURL(newImage) : previewImage}
                alt="preview"
                className="w-[410px] max-w-[98vw] aspect-[4/3] object-cover rounded-2xl shadow border border-blue-200 mt-1"
              />
              <button
                type="button"
                className="absolute top-2 right-2 bg-white/90 p-3 rounded-full shadow hover:bg-red-100 transition opacity-95"
                onClick={e => { e.stopPropagation(); newImage ? setNewImage(null) : setPreviewImage(''); }}
                title="Зураг устгах"
              >
                <MdClose className="text-red-600 text-2xl" />
              </button>
            </div>
          )}
        </div>
        {/* Buttons */}
        <div className="flex gap-3 mt-2">
          <button
            type="submit"
            className={`w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-semibold text-lg py-4 rounded-full shadow transition hover:bg-blue-700 active:scale-95 ${saving ? 'opacity-60 pointer-events-none' : ''}`}
            disabled={saving}
          >
            {saving ? (
              <span className="animate-spin">
                <svg width="26" height="26" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="20" stroke="white" strokeWidth="4" strokeLinecap="round" strokeDasharray="90 90" strokeDashoffset="0" /></svg>
              </span>
            ) : 'Хадгалах'}
          </button>
          <button
            type="button"
            className="w-40 py-4 rounded-full border border-gray-300 hover:bg-gray-100 transition text-lg text-gray-700 font-semibold"
            onClick={() => navigate('/doctor-advice')}
            disabled={saving}
          >
            Цуцлах
          </button>
        </div>
      </form>
      {/* Success анимэйшн */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="absolute top-8 right-12 flex items-center gap-2 text-green-600 text-xl font-bold bg-green-50 px-4 py-2 rounded-full shadow"
          >
            <MdCheckCircle /> Амжилттай!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EditAdvice;
