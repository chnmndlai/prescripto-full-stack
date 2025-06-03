import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaFilter, FaSortAmountDown, FaTimes } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import RelatedDoctors from '../components/RelatedDoctors';

const SPECIALITIES = [
  'Клиник сэтгэл зүйч',
  'Сэтгэцийн эмч',
  'Хүүхдийн сэтгэл зүйч',
  'Зан үйл судлаач',
  'Сэтгэл засалч / зөвлөх',
  'Гэр бүл, хосын сэтгэл зүйч'
];

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParam = new URLSearchParams(location.search).get('q') || '';
  
  const [query, setQuery] = useState(queryParam);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Шүүлтүүр, эрэмбэлэх
  const [showFilters, setShowFilters] = useState(false);
  const [specFilter, setSpecFilter] = useState('All');
  const [onlyFree, setOnlyFree] = useState(false);
  const [sortOrder, setSortOrder] = useState('rating');

  // Хайлтын шинэчлэх
  const doSearch = async (q) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/doctors/search`,
        { params: { q } }
      );
      setResults(res.data.doctors || []);
    } catch (err) {
      setError('Хайлтын үр дүн ачааллаж чадсангүй.');
    } finally {
      setLoading(false);
    }
  };

  // Анх ачааллах эсвэл query өөрчлөгдөх үед
  useEffect(() => {
    if (query.trim()) {
      // URL шинэчлэх
      navigate(`/search?q=${encodeURIComponent(query)}`, { replace: true });
      doSearch(query);
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  // Фильтр + эрэмбэлэх
  const filtered = useMemo(() => {
    let list = [...results];
    if (specFilter !== 'All') {
      list = list.filter(d => d.speciality === specFilter);
    }
    if (onlyFree) {
      list = list.filter(d => d.available);
    }
    if (sortOrder === 'rating') {
      list.sort((a,b) => (b.rating||0) - (a.rating||0));
    } else {
      list.sort((a,b) => b.experience - a.experience);
    }
    return list;
  }, [results, specFilter, onlyFree, sortOrder]);

  // Үр дүн дотор хайлт дээрх үгийг тодруулах
  const highlight = (text) => {
    if (!query) return text;
    const re = new RegExp(`(${query})`, 'gi');
    return text.split(re).map((part, i) =>
      re.test(part)
        ? <mark key={i} className="bg-yellow-200">{part}</mark>
        : part
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* 1. Тайлбар & Controls */}
      <h1 className="text-2xl font-semibold">“{query}” хайлтын үр дүн</h1>
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Эмчийн нэрээр хайх…"
            className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Хайлт"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <button
          onClick={() => setShowFilters(f => !f)}
          className="px-4 py-2 border rounded-full flex items-center gap-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-expanded={showFilters}
          aria-controls="filters-panel"
        >
          <FaFilter /> Шүүлтүүр
        </button>
      </div>

      {/* 2. Шүүлтүүрийн панель */}
      {showFilters && (
        <div id="filters-panel" className="bg-white border rounded-lg p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Специализац */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Мэргэжил:</label>
            <select
              value={specFilter}
              onChange={e => setSpecFilter(e.target.value)}
              className="px-3 py-2 border rounded focus:outline-none"
            >
              <option value="All">Бүгд</option>
              {SPECIALITIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Чөлөөтэй эсэх */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="onlyFree"
              checked={onlyFree}
              onChange={e => setOnlyFree(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="onlyFree">Зөвхөн чөлөөтэй</label>
          </div>

          {/* Эрэмбэлэх */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Эрэмбэлэх:</label>
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
              className="px-3 py-2 border rounded focus:outline-none"
            >
              <option value="rating">Үнэлгээ</option>
              <option value="experience">Туршлага</option>
            </select>
          </div>
        </div>
      )}

      {/* 3. Loading, Error, No Results */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton height={180} borderRadius="1rem" />
              <Skeleton height={20} width="60%" />
              <Skeleton height={14} width="40%" />
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500 space-y-4">
          <img
            src="/no-results.svg"
            alt="Үр дүн олдсонгүй"
            className="mx-auto h-32 opacity-50"
          />
          <p>“{query}”-д тохирох эмч олдсонгүй.</p>
          <button
            onClick={() => setQuery('')}
            className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition"
          >
            Бүх эмчийг харах
          </button>
        </div>
      ) : (
        <>
          {/* 4. Үр дүнгийн тоо */}
          <p className="text-gray-600">{filtered.length} үр дүн олдлоо</p>

          {/* 5. Results Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(doc => (
              <div
                key={doc._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg overflow-hidden transition-all"
              >
                <RelatedDoctors doctor={doc} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Search;
