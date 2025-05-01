import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const DoctorQuiz = () => {
  const { backendUrl, token } = useContext(AppContext); // backendUrl ба token

  const [quizName, setQuizName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quizName || !description || !file) {
      toast.error('Бүх талбарыг бөглөнө үү!');
      return;
    }

    const formData = new FormData();
    formData.append('name', quizName);
    formData.append('description', description);
    formData.append('image', file); // 'file' → 'image'

    try {
      setIsSubmitting(true);
      const response = await axios.post(`${backendUrl}/api/quiz/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Тест амжилттай нэмэгдлээ!');
        setQuizName('');
        setDescription('');
        setFile(null);
      } else {
        toast.error('Алдаа гарлаа: ' + response.data.message);
      }
    } catch (err) {
      toast.error('Сервертэй холбогдож чадсангүй!');
      console.log(err); // Тайлбар нэмэх
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">🧠 Шинэ сэтгэлзүйн тест нэмэх</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md space-y-4 w-full max-w-xl"
      >
        <input
          type="text"
          placeholder="Тестийн нэр"
          value={quizName}
          onChange={(e) => setQuizName(e.target.value)}
          className="w-full p-3 border rounded"
        />

        <textarea
          placeholder="Тайлбар"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full p-3 border rounded resize-none"
        ></textarea>

        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSubmitting ? 'Хадгалж байна...' : 'Нэмэх'}
        </button>
      </form>
    </div>
  );
};

export default DoctorQuiz;
