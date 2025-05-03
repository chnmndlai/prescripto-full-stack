import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { DoctorContext } from '../../context/DoctorContext';
import { toast } from 'react-toastify';

const EditQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dToken } = useContext(DoctorContext);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/quiz/${id}`, {
          headers: { Authorization: `Bearer ${dToken}` },
        });
        if (res.data.success) {
          const q = res.data.quiz;
          setTitle(q.title);
          setSummary(q.summary);
          setExistingImage(q.image);
        }
      } catch (err) {
        toast.error('Тест ачааллаж чадсангүй');
      }
    };
    fetchQuiz();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('summary', summary);
    if (image) formData.append('image', image);

    try {
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/quiz/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${dToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        toast.success('Тест амжилттай шинэчлэгдлээ');
        navigate('/doctor/quizzes');
      }
    } catch (err) {
      toast.error('Шинэчлэх үед алдаа гарлаа');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">🛠 Тест засах</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Гарчиг"
        />
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="w-full border p-2 rounded h-28"
          placeholder="Тайлбар"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full"
        />
        {existingImage && !image && (
          <img src={existingImage} alt="quiz" className="w-48 mt-2 rounded" />
        )}
        {image && (
          <img src={URL.createObjectURL(image)} alt="preview" className="w-48 mt-2 rounded" />
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Шинэчлэх
        </button>
      </form>
    </div>
  );
};

export default EditQuiz;
