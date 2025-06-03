import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import AdviceCard from '../components/AdviceCard';
import { toast } from 'react-toastify';
import { FaSearch, FaChevronDown, FaRegSadTear } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Debounce for search
function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

// Highlight search matches
function highlightText(text, query) {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <span key={i} className="bg-yellow-100 rounded px-1">{part}</span>
      : part
  );
}

// Card animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: i => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.055, type: 'spring', stiffness: 92, damping: 18 }
  })
};

const Advice = () => {
  const [adviceList, setAdviceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [visibleCount, setVisibleCount] = useState(8);

  const debouncedSearch = useDebounce(searchText);

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/advice`);
        if (res.data.success) setAdviceList(res.data.advice);
        else toast.error('Зөвлөгөө татаж чадсангүй');
      } catch {
        toast.error('Серверээс өгөгдөл татаж чадсангүй');
      } finally {
        setLoading(false);
      }
    };
    fetchAdvice();
  }, []);

  // Filter, sort, search
  const filtered = useMemo(() => {
    let list = adviceList;
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q)
      );
    }
    if (sortOrder === 'newest') {
      return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return [...list].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [adviceList, debouncedSearch, sortOrder]);

  const visibleAdvice = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  useEffect(() => {
    if (visibleCount > 8) {
      const el = document.getElementById('advice-list-bottom');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [visibleCount]);

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-10 py-12">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-2 tracking-tight">
        Сэтгэлзүйн зөвлөгөө
      </h2>
      <p className="text-center text-gray-500 text-base mb-8">
        Хамгийн шинэлэг, мэргэжлийн зөвлөгөө болон мэдлэгийг эндээс аваарай.
      </p>
      {/* Filter/Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4 bg-white/70 backdrop-blur rounded-2xl shadow px-4 py-3 sticky top-3 z-20">
        <div className="relative w-full sm:w-1/3">
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            placeholder="Зөвлөгөө хайх..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-primary focus:shadow-lg transition outline-none"
            aria-label="Зөвлөгөө хайх"
          />
        </div>
        <div className="flex items-center w-full sm:w-1/5 gap-2">
          <FaChevronDown className="text-gray-400" />
          <select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Эрэмбэлэх"
          >
            <option value="newest">Шинэ</option>
            <option value="oldest">Хуучин</option>
          </select>
        </div>
      </div>
      {/* Content grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="rounded-2xl h-64 bg-gradient-to-tr from-gray-100 to-gray-200 shimmer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16">
          <FaRegSadTear size={48} className="text-gray-300 mb-3" />
          <div className="text-xl text-gray-500 mb-2">Зөвлөгөө олдсонгүй</div>
          <button
            className="px-6 py-2 bg-primary text-white rounded-full shadow hover:bg-primary-dark transition"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Эхлэл рүү очих
          </button>
        </div>
      ) : (
        <>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7"
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {visibleAdvice.map((advice, i) => (
                <motion.div
                  key={advice._id}
                  variants={cardVariants}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  whileHover={{
                    scale: 1.04,
                    boxShadow: '0 10px 28px 0 #8a63d245'
                  }}
                  transition={{ type: "spring", stiffness: 180, damping: 22 }}
                  className="bg-white rounded-2xl p-0"
                  style={{ minHeight: 270 }}
                >
                  <AdviceCard
                    _id={advice._id}
                    title={highlightText(advice.title, debouncedSearch)}
                    summary={highlightText(advice.summary, debouncedSearch)}
                    image={advice.image}
                    doctor={advice.doctor || null}
                    createdAt={advice.createdAt}
                    readTime={Math.ceil(advice.summary.split(' ').length / 200)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          {hasMore && (
            <div className="flex justify-center mt-10" id="advice-list-bottom">
              <button
                onClick={() => setVisibleCount(c => c + 8)}
                className="px-7 py-2 bg-primary text-white rounded-full shadow hover:bg-primary-dark hover:scale-105 transition flex items-center gap-2 focus:ring-2 focus:ring-primary"
              >
                Илүүг үзэх <FaChevronDown />
              </button>
            </div>
          )}
        </>
      )}
      {/* Shimmer effect CSS */}
      <style>{`
        .shimmer {
          background: linear-gradient(90deg,#f1f1f4 25%,#f7f8fd 50%,#f1f1f4 75%);
          background-size: 200% 100%;
          animation: shimmerMove 1.25s infinite linear;
        }
        @keyframes shimmerMove {
          0% { background-position: 200% 0 }
          100% { background-position: -200% 0 }
        }
      `}</style>
    </div>
  );
};

export default Advice;
