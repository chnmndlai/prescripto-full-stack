import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditAdvice = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAdvice = async () => {
    try {
      const res = await axios.get(`/api/admin/advice/${id}`);
      if (res.data.success) {
        const { title, summary, image } = res.data.advice;
        setTitle(title);
        setSummary(summary);
        setPreviewImage(image);
      } else {
        toast.error('Зөвлөгөө ачааллаж чадсангүй');
      }
    } catch (err) {
      toast.error('Серверийн алдаа');
    }
  };

  useEffect(() => {
    fetchAdvice();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('summary', summary);
    if (image) formData.append('image', image);

    try {
      setLoading(true);
      const res = await axios.put(`/api/admin/update-advice/${id}`, formData);
      if (res.data.success) {
        toast.success('Амжилттай шинэчлэгдлээ');
        navigate('/admin/advice-list');
      } else {
        toast.error('Шинэчлэхэд алдаа гарлаа');
      }
    } catch (err) {
      toast.error('Серверийн алдаа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">✏️ Зөвлөгөө засварлах</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium">Гарчиг</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-primary"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Тайлбар</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
            rows={5}
            className="w-full px-4 py-2 border rounded-md focus:outline-primary"
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 font-medium">Шинэ зураг (хүсвэл)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          {previewImage && !image && (
            <img
              src={previewImage}
              alt="preview"
              className="mt-3 w-64 rounded-lg shadow"
            />
          )}
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              className="mt-3 w-64 rounded-lg shadow"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full transition"
        >
          {loading ? 'Шинэчилж байна...' : 'Шинэчлэх'}
        </button>
      </form>
    </div>
  );
};

export default EditAdvice;
