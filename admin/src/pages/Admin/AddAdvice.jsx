import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddAdvice = () => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error('Зураг оруулна уу');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('summary', summary);
    formData.append('image', image);

    try {
      setLoading(true);
      const res = await axios.post('/api/admin/add-advice', formData);
      if (res.data.success) {
        toast.success('Зөвлөгөө амжилттай нэмэгдлээ!');
        setTitle('');
        setSummary('');
        setImage(null);
      } else {
        toast.error(res.data.message || 'Амжилтгүй боллоо');
      }
    } catch (err) {
      toast.error('Серверийн алдаа');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">📝 Зөвлөгөө нэмэх</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium">Гарчиг</label>
          <input
            type="text"
            placeholder="Жишээ: Нойргүйдлийн тухай..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-primary"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Тайлбар</label>
          <textarea
            placeholder="Энд дэлгэрэнгүй тайлбарыг бичнэ үү..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
            rows={5}
            className="w-full px-4 py-2 border rounded-md focus:outline-primary"
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 font-medium">Зөвлөгөөний зураг</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="block"
            required
          />
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
          {loading ? 'Хадгалж байна...' : 'Зөвлөгөө нэмэх'}
        </button>
      </form>
    </div>
  );
};

export default AddAdvice;
