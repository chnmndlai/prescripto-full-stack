// src/pages/QuizList.jsx
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import InfiniteScroll from 'react-infinite-scroll-component';
import Skeleton from 'react-loading-skeleton';
import {
  FiX,
  FiChevronDown,
  FiZap,
  FiStar,
  FiClock,
  FiChevronRight,
  FiChevronLeft
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const PAGE_SIZE = 6;
const difficultyColors = {
  Easy: 'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Hard: 'bg-red-100 text-red-700',
};

export default function QuizList() {
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState('All');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const [recIndex, setRecIndex] = useState(0);
  const recRef = useRef();

  const navigate = useNavigate();

  // 1. Сорилуудыг татах
  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/quiz/all`);
        if (res.data.success) {
          const quizzes = res.data.quizzes;
          setAllQuizzes(quizzes);

          // ангиллыг цуглуулж, "Other"-г хасна
          const cats = Array.from(
            new Set(quizzes.map(q => q.category || 'Other'))
          ).filter(c => c !== 'Other');
          setCategories(['All', ...cats]);
        }
      } catch {
        toast.error('Сорилуудыг ачааллаж чадсангүй');
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  // 2. Фильтр, хайлт, эрэмбэлэлт
  const filtered = useMemo(() => {
    let list = [...allQuizzes];
    if (activeCat !== 'All') {
      list = list.filter(q => (q.category || '') === activeCat);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        qz =>
          qz.title.toLowerCase().includes(q) ||
          (qz.description || '').toLowerCase().includes(q)
      );
    }
    list.sort((a, b) =>
      sortOrder === 'newest'
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );
    return list;
  }, [allQuizzes, activeCat, search, sortOrder]);

  // 3. Хуудаслах
  useEffect(() => {
    const next = filtered.slice(0, PAGE_SIZE * page);
    setDisplayed(next);
    setHasMore(next.length < filtered.length);
  }, [filtered, page]);

  const loadMore = () => setPage(p => p + 1);

  // 4. Сорил эхлүүлэх баталгаажуулалт
  const handleCardClick = quiz => {
    setSelectedQuiz(quiz);
    setShowConfirm(true);
  };
  const handleStartQuiz = () => {
    if (selectedQuiz) {
      navigate(`/quiz/${selectedQuiz._id}`);
      setShowConfirm(false);
    }
  };

  // 5. Үнэлгээ, сурталчилгаа
  const recommendations = allQuizzes.filter(q => q.popularity > 80);
  const recPerPage = 3;
  const recPages = Math.ceil(recommendations.length / recPerPage);
  const recView = recommendations.slice(
    recIndex * recPerPage,
    (recIndex + 1) * recPerPage
  );

  // 6. Sticky tabs shadow
  useEffect(() => {
    const onScroll = () => {
      if (!recRef.current) return;
      recRef.current.classList.toggle(
        'shadow-lg bg-white z-30',
        recRef.current.getBoundingClientRect().top <= 0
      );
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Controls */}
      <div
        className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 sticky top-0 bg-white z-20 transition"
        ref={recRef}
      >
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setActiveCat(cat);
                setPage(1);
              }}
              className={`px-3 py-1 rounded-full text-sm transition focus:outline-none focus:ring-2 focus:ring-primary ${
                activeCat === cat
                  ? 'bg-primary text-white font-semibold shadow'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {/* Search & Sort */}
        <div className="flex gap-3 items-center w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Сорил хайх..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-8 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            {!!search && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
                onClick={() => setSearch('')}
              >
                <FiX size={18} />
              </button>
            )}
          </div>
          <div className="relative">
            <select
              value={sortOrder}
              onChange={e => {
                setSortOrder(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-sm appearance-none pr-8"
            >
              <option value="newest">🆕 Шинэ</option>
              <option value="oldest">⏳ Хуучин</option>
            </select>
            <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Quiz Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Skeletons */}
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white shadow-md space-y-2">
              <Skeleton height={160} borderRadius="1rem" />
              <div className="flex gap-2 mt-2">
                <Skeleton width={60} height={22} borderRadius={8} />
                <Skeleton width={50} height={22} borderRadius={8} />
              </div>
              <Skeleton height={22} width="75%" />
              <Skeleton height={14} width="60%" />
              <div className="flex items-center justify-between mt-2">
                <Skeleton width={70} height={32} borderRadius={16} />
                <Skeleton width={45} height={16} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <InfiniteScroll
          dataLength={displayed.length}
          next={loadMore}
          hasMore={hasMore}
          loader={
            <div className="flex justify-center py-8">
              <span className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
          }
          endMessage={
            <div className="text-center py-4 text-primary text-lg font-semibold flex items-center gap-2 justify-center">
              <FiStar className="text-yellow-400" /> Бүх сорилыг үзлээ!
            </div>
          }
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {displayed.map(quiz => (
            <motion.div
              key={quiz._id}
              whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(80,132,255,0.15)' }}
              className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer transition-all group border"
              onClick={() => handleCardClick(quiz)}
            >
              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2 z-10">
                {quiz.isNew && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full animate-bounce flex items-center gap-1">
                    <FiZap /> Шинэ
                  </span>
                )}
                {quiz.isQuick && (
                  <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse flex items-center gap-1">
                    <FiClock /> Шуурхай
                  </span>
                )}
                {quiz.difficulty && (
                  <span
                    className={`${difficultyColors[quiz.difficulty] || 'bg-gray-100 text-gray-700'} text-xs px-2 py-0.5 rounded-full flex items-center gap-1`}
                  >
                    <FiStar /> {quiz.difficulty}
                  </span>
                )}
              </div>

              {/* Image + Title */}
              <div className="relative">
                <img
                  src={quiz.image}
                  alt={quiz.title}
                  loading="lazy"
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white text-lg font-semibold drop-shadow">
                  {quiz.title}
                </div>
              </div>

              {/* Content with Doctor */}
              <div className="p-4 space-y-1">
                {/* Эмчийн нэр */}
                <p className="text-xs text-gray-500">Эмч: {quiz.doctor?.name || 'Unknown'}</p>
                <p className="text-sm text-gray-600 line-clamp-2">{quiz.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <Link
                    to="#"
                    onClick={e => {
                      e.stopPropagation();
                      handleCardClick(quiz);
                    }}
                    className="px-4 py-1 bg-primary text-white rounded-full text-sm hover:bg-primary-dark shadow transition flex items-center gap-1"
                  >
                    <FiChevronRight /> Бөглөх
                  </Link>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    {new Date(quiz.createdAt).toLocaleDateString('mn-MN')}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </InfiniteScroll>
      )}

      {/* Confirm Dialog */}
      {showConfirm && selectedQuiz && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-xs mx-auto text-center"
          >
            <h3 className="text-xl font-bold mb-4">
              “{selectedQuiz.title}” сорилыг эхлүүлэх үү?
            </h3>
            <div className="flex justify-center gap-4 mt-4">
              <button className="btn btn-primary px-6" onClick={handleStartQuiz}>
                Тийм
              </button>
              <button className="btn btn-outline px-6" onClick={() => setShowConfirm(false)}>
                Үгүй
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
            ✨ Танд тохиромжтой сорилууд
          </h2>
          <div className="relative">
            <button
              disabled={recIndex === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2 z-10 disabled:opacity-30"
              onClick={() => setRecIndex(idx => Math.max(0, idx - 1))}
            >
              <FiChevronLeft size={24} />
            </button>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto snap-x">
              {recView.map(q => (
                <Link
                  key={q._id}
                  to={`/quiz/${q._id}`}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transform hover:scale-[1.02] transition-all min-w-[250px] snap-center"
                >
                  <img src={q.image} alt={q.title} loading="lazy" className="w-full h-32 object-cover" />
                  <div className="p-3">
                    <h4 className="text-md font-semibold text-gray-800 line-clamp-1">
                      {q.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
            <button
              disabled={recIndex === recPages - 1}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2 z-10 disabled:opacity-30"
              onClick={() => setRecIndex(idx => Math.min(recPages - 1, idx + 1))}
            >
              <FiChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
);
}
