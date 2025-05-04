// frontend/pages/Doctor/EditAdvice.jsx

import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { DoctorContext } from '../../context/DoctorContext';
import { toast } from 'react-toastify';

const EditAdvice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dToken } = useContext(DoctorContext);

  const [advice, setAdvice] = useState(null);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
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
      }
    };

    if (dToken) fetchAdvice();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        navigate('/doctor-advice'); // буцах хуудас
      } else {
        toast.error('Засвар амжилтгүй');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Серверийн алдаа');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">✏️ Зөвлөгөө засах</h2>
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
          onChange={(e) => setNewImage(e.target.files[0])}
          className="w-full"
        />
        {previewImage && !newImage && (
          <img src={previewImage} alt="preview" className="w-48 mt-2 rounded shadow" />
        )}
        {newImage && (
          <img src={URL.createObjectURL(newImage)} alt="new" className="w-48 mt-2 rounded shadow" />
        )}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Хадгалах
        </button>
      </form>
    </div>
  );
};

export default EditAdvice;
