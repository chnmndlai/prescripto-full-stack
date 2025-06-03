import React, { useState, useContext, useRef } from 'react';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { MdClose, MdCloudUpload, MdError, MdQuiz } from 'react-icons/md';
import clsx from 'clsx';

const initialQuestion = () => ({
  question: '',
  type: 'radio',
  options: [
    { label: 'Тийм', value: 1 },
    { label: 'Үгүй', value: 0 },
  ],
});

const DoctorQuiz = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [quizName, setQuizName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [questions, setQuestions] = useState([initialQuestion()]);
  const [errors, setErrors] = useState({});
  const fileInput = useRef();

  // Validation
  const validate = () => {
    let err = {};
    if (!quizName.trim()) err.quizName = true;
    if (!description.trim()) err.description = true;
    if (!file) err.file = true;
    questions.forEach((q, qi) => {
      if (!q.question.trim()) err[`q${qi}`] = 'Асуултыг бөглөнө үү';
      if (
        (q.type === 'checkbox' && q.options.length < 2) ||
        q.options.some((o) => !o.label.trim())
      ) {
        err[`opt${qi}`] = '2+ сонголт, хоосонгүй бөглөх';
      }
    });
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // Image drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    const img = e.dataTransfer.files[0];
    if (img && img.type.startsWith('image/')) setFile(img);
    else toast.error('Зураг файл сонгоно уу');
  };

  // Question change (энэ function байхгүйгээс алдаа өгч байгаа!)
  const handleQuestionChange = (qIndex, value) => {
    setQuestions(qs => {
      const arr = [...qs];
      arr[qIndex].question = value;
      return arr;
    });
  };

  // Question type change (radio/checkbox)
  const handleQuestionTypeChange = (qIndex, type) => {
    setQuestions(qs => {
      const arr = [...qs];
      arr[qIndex].type = type;
      arr[qIndex].options = type === 'radio'
        ? [
            { label: 'Тийм', value: 1 },
            { label: 'Үгүй', value: 0 }
          ]
        : [
            { label: '', value: 0 },
            { label: '', value: 0 }
          ];
      return arr;
    });
  };

  // Option add/delete
  const handleAddOption = (qi) => {
    setQuestions(qs => {
      const arr = [...qs];
      arr[qi].options.push({ label: '', value: 0 });
      return arr;
    });
  };
  const handleRemoveOption = (qi, oi) => {
    setQuestions(qs => {
      const arr = [...qs];
      arr[qi].options.splice(oi, 1);
      return arr;
    });
  };

  // Option field change
  const handleOptionChange = (qIndex, oIndex, key, value) => {
    setQuestions(qs => {
      const arr = [...qs];
      arr[qIndex].options[oIndex][key] = key === 'value' ? parseFloat(value) : value;
      return arr;
    });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Бүх шаардлагатай талбарыг бүрэн бөглөнө үү!');
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
        setQuestions([initialQuestion()]);
        setErrors({});
      } else {
        toast.error(response.data.message || 'Алдаа гарлаа.');
      }
    } catch (err) {
      toast.error('Сервертэй холбогдож чадсангүй!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Badge
  const badge = (txt) => (
    <span className="bg-blue-100 text-blue-700 rounded-full px-3 py-0.5 text-xs font-bold tracking-wide mr-2">{txt}</span>
  );

  return (
    <div className="p-4 sm:p-8 w-full min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-3xl mx-auto rounded-2xl shadow-xl border border-blue-100 p-6 md:p-8 space-y-6 transition"
      >
        <h2 className="text-2xl md:text-3xl font-extrabold text-blue-700 flex items-center gap-2 mb-2">
          <MdQuiz className="text-3xl" /> Шинэ сэтгэлзүйн тест нэмэх
        </h2>

        {/* Тестийн нэр */}
        <div>
          <label className="block mb-1 font-semibold flex items-center gap-2">
            {badge('1-р алхам')} Тестийн нэр
            {errors.quizName && <MdError className="text-red-400" />}
          </label>
          <input
            type="text"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            className={clsx(
              'w-full p-3 border rounded-xl transition focus:ring-2 focus:ring-blue-200',
              errors.quizName ? 'border-red-300' : 'border-blue-100'
            )}
            autoFocus
            placeholder="Жишээ: Анхны түгшүүрийн үнэлгээ"
          />
          {errors.quizName && (
            <span className="text-xs text-red-500">Тестийн нэр шаардлагатай</span>
          )}
        </div>

        {/* Тайлбар */}
        <div>
          <label className="block mb-1 font-semibold flex items-center gap-2">
            {badge('2-р алхам')} Тайлбар
            {errors.description && <MdError className="text-red-400" />}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className={clsx(
              'w-full p-3 border rounded-xl resize-none focus:ring-2 focus:ring-blue-200',
              errors.description ? 'border-red-300' : 'border-blue-100'
            )}
            placeholder="Энэхүү тест ямар зорилготой вэ?"
          ></textarea>
          {errors.description && (
            <span className="text-xs text-red-500">Тайлбар шаардлагатай</span>
          )}
        </div>

        {/* Зураг сонгох */}
        <div>
          <label className="block mb-1 font-semibold flex items-center gap-2">
            {badge('3-р алхам')} Тестийн зураг
            {errors.file && <MdError className="text-red-400" />}
          </label>
          <div
            className={clsx(
              'relative flex items-center justify-center bg-blue-50 border-2 border-dashed rounded-xl p-5 cursor-pointer transition hover:bg-blue-100 group',
              errors.file ? 'border-red-400' : 'border-blue-200'
            )}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileInput.current.click()}
            title="Зураг оруулах (дарж сонгох эсвэл чирж тавих)"
          >
            {!file ? (
              <div className="flex flex-col items-center gap-2 text-blue-400">
                <MdCloudUpload className="text-3xl" />
                <span className="font-medium text-blue-600 text-sm">
                  Зураг оруулах эсвэл чирж тавина уу
                </span>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-44 h-28 object-contain rounded border shadow mb-2"
                />
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); setFile(null); }}
                  className="absolute top-0 right-0 p-1 rounded-full bg-white border shadow hover:bg-red-50"
                  title="Устгах"
                >
                  <MdClose className="text-red-500 text-xl" />
                </button>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInput}
              onChange={e => setFile(e.target.files[0])}
              className="hidden"
            />
          </div>
          {errors.file && (
            <span className="text-xs text-red-500">Зураг шаардлагатай</span>
          )}
        </div>

        {/* Асуултууд */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            {badge('4-р алхам')}
            <span className="font-bold">Асуултууд</span>
          </div>
          <div className="flex flex-col gap-6">
            {questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className={clsx(
                  "bg-gray-50 border rounded-2xl shadow-sm p-5 relative transition group",
                  errors[`q${qIndex}`] || errors[`opt${qIndex}`]
                    ? 'border-red-300'
                    : 'border-blue-100'
                )}
              >
                {/* Step badge */}
                <span className="absolute -top-3 left-5 bg-blue-600 text-white rounded-full px-3 py-1 text-xs shadow-lg">{`Q${qIndex + 1}`}</span>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-semibold text-gray-700">
                    Асуулт {qIndex + 1}
                  </label>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuestions(qs => qs.filter((_, i) => i !== qIndex));
                        setErrors(err => {
                          const e2 = { ...err };
                          delete e2[`q${qIndex}`];
                          delete e2[`opt${qIndex}`];
                          return e2;
                        });
                      }}
                      className="text-red-400 font-bold rounded px-2 py-1 hover:bg-red-50 text-xs"
                    >
                      Устгах
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={q.question}
                  onChange={e => {
                    handleQuestionChange(qIndex, e.target.value);
                    setErrors(err => ({ ...err, [`q${qIndex}`]: '' }));
                  }}
                  className={clsx(
                    "w-full p-2 border rounded-xl mb-3 transition focus:ring-2 focus:ring-blue-100",
                    errors[`q${qIndex}`] ? "border-red-300" : "border-blue-100"
                  )}
                  placeholder="Асуултын текст"
                  required
                />
                {errors[`q${qIndex}`] && (
                  <span className="text-xs text-red-500">{errors[`q${qIndex}`]}</span>
                )}

                {/* Question type */}
                <select
                  value={q.type}
                  onChange={e => handleQuestionTypeChange(qIndex, e.target.value)}
                  className="mb-3 p-2 border rounded-xl"
                >
                  <option value="radio">Нэг сонголт (radio)</option>
                  <option value="checkbox">Олон сонголт (checkbox)</option>
                </select>

                {/* Сонголтууд */}
                {q.options.map((opt, oIndex) => (
                  <div
                    key={oIndex}
                    className="flex gap-2 items-center mb-2 transition"
                  >
                    <span>{oIndex + 1}.</span>
                    <input
                      type="text"
                      placeholder="Сонголт"
                      value={opt.label}
                      onChange={e => {
                        handleOptionChange(qIndex, oIndex, 'label', e.target.value);
                        setErrors(err => ({ ...err, [`opt${qIndex}`]: '' }));
                      }}
                      className={clsx(
                        "flex-1 p-2 border rounded-xl focus:ring-2 focus:ring-blue-100",
                        errors[`opt${qIndex}`] && !opt.label.trim()
                          ? "border-red-300"
                          : "border-blue-100"
                      )}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Оноо"
                      value={opt.value}
                      onChange={e =>
                        handleOptionChange(qIndex, oIndex, 'value', e.target.value)
                      }
                      className="w-24 p-2 border rounded-xl border-blue-100 focus:ring-2 focus:ring-blue-100"
                      required
                    />
                    {q.options.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(qIndex, oIndex)}
                        className="text-red-400 hover:text-red-600 font-bold"
                        title="Сонголт устгах"
                      >
                        <MdClose />
                      </button>
                    )}
                  </div>
                ))}
                {errors[`opt${qIndex}`] && (
                  <span className="text-xs text-red-500">{errors[`opt${qIndex}`]}</span>
                )}
                {/* Option нэмэх */}
                {q.type === 'checkbox' && (
                  <button
                    type="button"
                    onClick={() => handleAddOption(qIndex)}
                    className="mt-1 text-sm text-blue-600 hover:underline hover:text-blue-700"
                  >
                    ➕ Сонголт нэмэх
                  </button>
                )}
              </div>
            ))}
            {/* Асуулт нэмэх */}
            <button
              type="button"
              onClick={() => setQuestions(qs => [...qs, initialQuestion()])}
              className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 shadow transition"
            >
              ➕ Асуулт нэмэх
            </button>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={clsx(
            "w-full flex items-center justify-center gap-2 text-lg bg-blue-600 py-3 rounded-full shadow-md hover:bg-blue-700 transition disabled:opacity-50",
            isSubmitting && "cursor-not-allowed"
          )}
        >
          {isSubmitting && (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"></circle>
              <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          )}
          {isSubmitting ? 'Хадгалж байна...' : 'Нэмэх'}
        </button>
      </form>
    </div>
  );
};

export default DoctorQuiz;
