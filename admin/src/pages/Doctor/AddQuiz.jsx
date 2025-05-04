import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const DoctorQuiz = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [quizName, setQuizName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [questions, setQuestions] = useState([
    {
      question: '',
      type: 'radio',
      options: [
        { label: 'Тийм', value: 1 },
        { label: 'Үгүй', value: 0 },
      ],
    }
  ]);

  const handleAddQuestion = () => {
    setQuestions([...questions, {
      question: '',
      type: 'radio',
      options: [
        { label: 'Тийм', value: 1 },
        { label: 'Үгүй', value: 0 },
      ],
    }]);
  };

  const handleRemoveQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

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

  const handleOptionChange = (qIndex, oIndex, key, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex][key] = key === 'value' ? parseFloat(value) : value;
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quizName || !description || !file || questions.some(q => !q.question)) {
      toast.error('Бүх талбарыг бөглөнө үү!');
      return;
    }

    const formData = new FormData();
    formData.append('title', quizName);
    formData.append('summary', description);
    formData.append('image', file);
    formData.append('questions', JSON.stringify(questions));

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
        setQuestions([
          {
            question: '',
            type: 'radio',
            options: [
              { label: 'Тийм', value: 1 },
              { label: 'Үгүй', value: 0 },
            ],
          }
        ]);
      } else {
        toast.error(response.data.message || 'Алдаа гарлаа.');
      }
    } catch (err) {
      toast.error('Сервертэй холбогдож чадсангүй!');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">🧠 Шинэ сэтгэлзүйн тест нэмэх</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 w-full max-w-3xl mx-auto">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Тестийн нэр</label>
          <input
            type="text"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            className="w-full p-3 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Тайлбар</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full p-3 border rounded resize-none"
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Зураг</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full"
          />
        </div>

        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="w-full max-h-64 object-contain rounded border mb-4"
          />
        )}

        <div className="space-y-6">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="bg-gray-100 p-4 rounded shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <label className="font-medium text-gray-700">Асуулт {qIndex + 1}</label>
                {questions.length > 1 && (
                  <button type="button" onClick={() => handleRemoveQuestion(qIndex)} className="text-red-500 hover:underline">Устгах</button>
                )}
              </div>
              <input
                type="text"
                value={q.question}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                className="w-full p-2 border rounded mb-3"
              />

              <select
                value={q.type}
                onChange={(e) => handleQuestionTypeChange(qIndex, e.target.value)}
                className="mb-3 p-2 border rounded"
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

          <button type="button" onClick={handleAddQuestion} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            ➕ Асуулт нэмэх
          </button>
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50">
          {isSubmitting ? 'Хадгалж байна...' : 'Нэмэх'}
        </button>
      </form>
    </div>
  );
};

export default DoctorQuiz;