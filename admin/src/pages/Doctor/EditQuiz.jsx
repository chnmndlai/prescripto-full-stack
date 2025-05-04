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
  const [questions, setQuestions] = useState([]);

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
          setQuestions(q.questions || []);
        }
      } catch (err) {
        toast.error('Тест ачааллаж чадсангүй');
      }
    };
    fetchQuiz();
  }, [id]);

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  const handleQuestionTypeChange = (index, type) => {
    const updated = [...questions];
    updated[index].type = type;
    if (type === 'radio') {
      updated[index].options = [
        { label: 'Тийм', value: 1 },
        { label: 'Үгүй', value: 0 },
      ];
    } else if (type === 'checkbox') {
      updated[index].options = [
        { label: '', value: 0 },
        { label: '', value: 0 },
      ];
    }
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, key, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex][key] = key === 'value' ? parseFloat(value) : value;
    setQuestions(updated);
  };

  const handleAddOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push({ label: '', value: 0 });
    setQuestions(updated);
  };

  const handleRemoveOption = (qIndex, oIndex) => {
    const updated = [...questions];
    updated[qIndex].options.splice(oIndex, 1);
    setQuestions(updated);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('summary', summary);
    if (image) formData.append('image', image);
    formData.append('questions', JSON.stringify(questions));

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
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">🛠 Сэтгэлзүйн тест засах</h2>
      <form onSubmit={handleUpdate} className="bg-white p-6 rounded-lg shadow-md space-y-4 w-full max-w-2xl">
        <input
          type="text"
          placeholder="Тестийн гарчиг"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border rounded"
        />
        <textarea
          placeholder="Товч тайлбар"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={4}
          className="w-full p-3 border rounded resize-none"
        ></textarea>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full"
        />
        {existingImage && !image && (
          <img src={existingImage} alt="quiz" className="w-full max-h-64 object-contain rounded border" />
        )}
        {image && (
          <img src={URL.createObjectURL(image)} alt="preview" className="w-full max-h-64 object-contain rounded border" />
        )}

        <div className="space-y-6">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="bg-gray-100 p-4 rounded">
              <label className="font-semibold">Асуулт {qIndex + 1}</label>
              <input
                type="text"
                value={q.question}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                className="w-full p-2 border rounded my-2"
              />

              <select
                value={q.type}
                onChange={(e) => handleQuestionTypeChange(qIndex, e.target.value)}
                className="mb-2 p-2 border rounded"
              >
                <option value="radio">Нэг сонголт (radio)</option>
                <option value="checkbox">Олон сонголт (checkbox)</option>
              </select>

              {q.options.map((opt, oIndex) => (
                <div key={oIndex} className="flex gap-2 items-center mb-2">
                  <span>{oIndex + 1}.</span>
                  <input
                    type="text"
                    placeholder="Сонголт"
                    value={opt.label}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, 'label', e.target.value)}
                    className="flex-1 p-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Оноо"
                    value={opt.value}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, 'value', e.target.value)}
                    className="w-24 p-2 border rounded"
                  />
                  {q.options.length > 1 && (
                    <button type="button" onClick={() => handleRemoveOption(qIndex, oIndex)} className="text-red-500 hover:underline">❌</button>
                  )}
                </div>
              ))}

              {q.type === 'checkbox' && (
                <button type="button" onClick={() => handleAddOption(qIndex)} className="text-sm text-blue-600 hover:underline">
                  ➕ Сонголт нэмэх
                </button>
              )}
            </div>
          ))}
        </div>

        <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700">
          Шинэчлэх
        </button>
      </form>
    </div>
  );
};

export default EditQuiz;