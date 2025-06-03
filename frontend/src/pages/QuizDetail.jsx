// src/pages/QuizDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { BsHandThumbsUp, BsHandThumbsDown } from 'react-icons/bs'; // thumbs icon

const calmingMessages = [
  "Чи ганцаараа биш. Хэн нэгэн үргэлж чамд санаа тавьж байгаа.",
  "Чи юу мэдэрч байгаагаа мэдрэх эрхтэй. Чи хангалттай үнэ цэнэтэй хүн.",
  "Бүх зүйл одоо хэцүү байж болох ч энэ үе өнгөрнө.",
  "Амьдралд амралт авах үе хэрэгтэй. Чи амсхийж болно.",
  "Алхам бүр чамайг урагшлуулж байгаа. Хэдий аажуу ч гэсэн.",
  "Төгс байх албагүй. Чи өөрийнхөөрөө л сайхан.",
  "Хүчтэй хүн уйлж чаддаг. Чамд сэтгэл бий гэдгийн шинж.",
  "Чи өнгөрснийг биш, ирээдүйг өөрчилж чадна.",
  "Өнөөдөр амархан биш байж болох ч чи өнгөрсөн бүхнийг давж гарсан хүн.",
  "Надад итгэ, чи чадна. Чи аль хэдийн олон давааг давсан."
];

const getProgressColor = (percent) => {
  if (percent < 40) return "bg-green-400";
  if (percent < 80) return "bg-yellow-400";
  return "bg-red-400";
};

const STORAGE_KEY = "quiz_answers";

export default function QuizDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [calmingText, setCalmingText] = useState('');

  // restore from localStorage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (data[id]) {
      setAnswers(data[id].answers || {});
      setCurrentIndex(data[id].currentIndex || 0);
      setSubmitted(data[id].submitted || false);
      setResult(data[id].result || null);
      setCalmingText(data[id].calmingText || "");
    }
  }, [id]);

  // persist to localStorage
  useEffect(() => {
    const toSave = { answers, currentIndex, submitted, result, calmingText };
    const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...prev, [id]: toSave })
    );
  }, [answers, currentIndex, submitted, result, calmingText, id]);

  // fetch quiz
  const fetchQuiz = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/quiz/${id}`);
      if (res.data.success) setQuiz(res.data.quiz);
      else setError('Тест олдсонгүй');
    } catch {
      setError('Тест ачаалах үед алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };
  useEffect(fetchQuiz, [id]);

  const total = quiz?.questions?.length || 0;
  const remaining = total - Object.keys(answers).length;
  const estimatedMin = Math.ceil((remaining * 10) / 60);
  const percent = ((currentIndex + 1) / total) * 100;

  const handleChange = (val) => {
    setAnswers(prev => ({ ...prev, [currentIndex]: val }));
    toast.info(`${currentIndex + 1}-р асуулга: ${val === 'yes' ? 'Тийм' : 'Үгүй'} сонгогдлоо`);
  };

  const handleNext = () => {
    if (!answers[currentIndex]) {
      toast.error('Энэ асуулгад хариулна уу');
      return;
    }
    if (currentIndex < total - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      // finalize
      const yesCount = Object.values(answers).filter(v => v === 'yes').length;
      let risk = '';
      if (yesCount <= 2) risk = '🟢 Эрсдэл бага';
      else if (yesCount <= 4) risk = '🟠 Дунд эрсдэл';
      else risk = '🔴 Өндөр эрсдэл';
      const msg = calmingMessages[Math.floor(Math.random() * calmingMessages.length)];
      setResult({ risk });
      setCalmingText(msg);
      setSubmitted(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(i => i - 1);
  };

  const handleSkip = () => {
    setCurrentIndex(i => Math.min(i + 1, total - 1));
  };

  const handleRetake = () => {
    // clear state & localStorage
    setAnswers({});
    setCurrentIndex(0);
    setSubmitted(false);
    setResult(null);
    setCalmingText('');
    const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    delete prev[id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prev));
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-64 bg-gray-100 animate-pulse rounded-xl"></div>
        <div className="flex justify-between space-x-4">
          <div className="h-10 flex-1 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 flex-1 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchQuiz}
          className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
        >
          Дахин ачааллах
        </button>
      </div>
    );
  }

  // result view
  if (submitted && result) {
    return (
      <div className="max-w-3xl mx-auto px-2 py-8 md:px-4 space-y-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-blue-50 to-green-100 p-8 rounded-3xl shadow-2xl flex flex-col items-center"
        >
          <div className="mb-2 text-4xl">
            {result.risk.includes("🔴") && <span className="animate-pulse text-red-500">🔴</span>}
            {result.risk.includes("🟠") && <span className="animate-pulse text-yellow-500">🟠</span>}
            {result.risk.includes("🟢") && <span className="animate-pulse text-green-500">🟢</span>}
          </div>
          <h2 className="text-2xl font-bold mb-2">Үр дүн</h2>
          <div className="text-xl font-bold">{result.risk.replace(/^\S+\s/, '')}</div>
        </motion.div>
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-green-100 p-6 rounded-2xl shadow-sm"
        >
          <p className="text-center font-semibold">{calmingText}</p>
        </motion.div>
        <div className="flex gap-4">
          <button
            className="flex-1 py-3 bg-primary text-white rounded-full hover:opacity-90 transition shadow-lg"
            onClick={() => navigate('/appointment')}
          >
            Цаг захиалах
          </button>
          <button
            className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition"
            onClick={handleRetake}
          >
            Дахин өгөх
          </button>
        </div>
      </div>
    );
  }

  // question view
  const question = quiz.questions[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 py-8">
      <div className="max-w-3xl mx-auto px-4 space-y-8">
        {/* Progress */}
        <div>
          <div className="flex justify-between mb-2 text-sm">
            <span>{currentIndex + 1}/{total} асуулга</span>
            <span>~{estimatedMin} мин үлдлээ</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <motion.div
              className={`${getProgressColor(percent)} h-2`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.35, type: "spring" }}
            className="bg-white rounded-3xl shadow-2xl p-8 text-center relative"
          >
            <p className="text-2xl font-semibold mb-6">{currentIndex + 1}. {question.question}</p>
            <div className="space-y-4">
              {['yes','no'].map(val => (
                <label
                  key={val}
                  className={`flex items-center justify-center gap-4 px-6 py-4 border rounded-2xl cursor-pointer select-none text-lg transition
                    ${answers[currentIndex] === val ? 'bg-primary text-white scale-105' : 'hover:bg-gray-50'}
                  `}
                  onClick={() => handleChange(val)}
                  tabIndex={0}
                  onKeyDown={e => (e.key==='Enter'||e.key===' ') && handleChange(val)}
                >
                  <span className="text-2xl">
                    {val === "yes" ? <BsHandThumbsUp /> : <BsHandThumbsDown />}
                  </span>
                  {val === 'yes' ? 'Тийм' : 'Үгүй'}
                  {answers[currentIndex] === val && (
                    <motion.span
                      layoutId="check"
                      className="ml-4 text-2xl"
                      initial={{ scale: 0.7 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    >✓</motion.span>
                  )}
                </label>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex-1 py-3 bg-gray-200 rounded-full disabled:opacity-50"
          >
            Өмнөх
          </button>
          <button
            onClick={handleSkip}
            disabled={currentIndex === total - 1}
            className="flex-1 py-3 bg-blue-100 text-blue-600 rounded-full"
          >
            Алгасах
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-3 bg-primary text-white rounded-full"
          >
            {currentIndex === total - 1 ? 'Илгээх' : 'Дараах'}
          </button>
        </div>
      </div>
    </div>
  );
}
