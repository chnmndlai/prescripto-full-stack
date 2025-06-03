import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  FaTrash, FaShareAlt, FaArrowRight, FaThLarge, FaListUl, FaTimes, FaUndo, FaUserMd,
} from 'react-icons/fa';
import { MdCheckCircle, MdMarkEmailUnread, MdMarkEmailRead } from "react-icons/md";
import { motion, AnimatePresence } from 'framer-motion';

// Dummy illustration svg for empty state
const EmptySVG = () => (
  <svg width="100" height="100" className="mx-auto mb-4" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="48" fill="#e0e7ff" />
    <rect x="28" y="40" width="44" height="28" rx="6" fill="#6366f1" />
    <rect x="38" y="52" width="24" height="6" rx="2" fill="#fff" />
    <circle cx="50" cy="36" r="8" fill="#fff" stroke="#6366f1" strokeWidth="3"/>
  </svg>
);

const tagColors = [
  "bg-pink-100 text-pink-700",
  "bg-green-100 text-green-700",
  "bg-yellow-100 text-yellow-700",
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-red-100 text-red-700",
];

// Helper for tag chip color
const tagClass = (i) => tagColors[i % tagColors.length];

const SavedAdvice = () => {
  const { savedAdvice, backendUrl, token, removeFromSaved } = useContext(AppContext);
  const navigate = useNavigate();

  const [adviceList, setAdviceList] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [viewMode, setViewMode] = useState('grid');
  const [filterTab, setFilterTab] = useState('all');
  const [sortKey, setSortKey] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [selected, setSelected] = useState([]);
  const [undoInfo, setUndoInfo] = useState(null); // {id, data, timeout}
  const [previewAdvice, setPreviewAdvice] = useState(null); // quick preview

  // fetch saved advice
  useEffect(() => {
    const fetchSaved = async () => {
      setLoading(true);
      try {
        const res = await axios.post(
          `${backendUrl}/api/advice/list-many`,
          { adviceIds: savedAdvice },
          { headers: { token } }
        );
        if (res.data.success) setAdviceList(res.data.advice || []);
      } catch (err) {
        toast.error('Хадгалсан зөвлөгөө ачааллахад алдаа гарлаа');
      } finally {
        setLoading(false);
      }
    };
    if (savedAdvice.length) fetchSaved();
    else { setAdviceList([]); setLoading(false); }
  }, [savedAdvice, backendUrl, token]);

  // Doctor & tag list
  const doctors = useMemo(() =>
    Array.from(new Set(adviceList.map(a => a.doctor?.name).filter(Boolean))), [adviceList]);
  const tags = useMemo(() =>
    Array.from(new Set(adviceList.flatMap(a => a.tags || []))), [adviceList]);

  // Filtering
  const filtered = useMemo(() => {
    let list = [...adviceList];
    if (filterTab === 'new') list = list.filter(a => a.isNew);
    if (filterTab === 'read') list = list.filter(a => a.read);
    if (filterTab === 'unread') list = list.filter(a => !a.read);
    if (doctorFilter) list = list.filter(a => a.doctor?.name === doctorFilter);
    if (tagFilter) list = list.filter(a => (a.tags || []).includes(tagFilter));
    if (searchTerm) list = list.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));
    // Sort
    list.sort((a, b) => {
      if (sortKey === 'length') return a.summary.length - b.summary.length;
      if (sortKey === 'doctor') return (a.doctor?.name || '').localeCompare(b.doctor?.name || '');
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    return list;
  }, [adviceList, filterTab, searchTerm, sortKey, doctorFilter, tagFilter]);

  // Multi-select
  const isSelected = (id) => selected.includes(id);
  const toggleSelect = (id) => setSelected(sel =>
    sel.includes(id) ? sel.filter(x => x !== id) : [...sel, id]);
  const selectAll = () => setSelected(filtered.map(a => a._id));
  const clearSelection = () => setSelected([]);

  // Remove single/multiple
  const handleRemove = (id) => {
    const removed = adviceList.find(a => a._id === id);
    removeFromSaved(id);
    setUndoInfo({ id, data: removed, timeout: setTimeout(() => setUndoInfo(null), 5000) });
    toast.info(
      <span>
        Устгагдлаа <button onClick={undoRemove} className="underline ml-2">Undo</button>
      </span>
    );
  };
  const handleBatchRemove = () => {
    selected.forEach(id => removeFromSaved(id));
    setSelected([]);
    toast.success('Олон зөвлөгөө устгагдлаа');
  };
  const undoRemove = () => {
    if (undoInfo) {
      clearTimeout(undoInfo.timeout);
      setAdviceList(a => [undoInfo.data, ...a]);
      setUndoInfo(null);
      toast.success('Сэргээсэн!');
    }
  };

  // Share
  const handleShare = (id) => {
    const url = `${window.location.origin}/advice/${id}`;
    navigator.clipboard.writeText(url);
    toast.success('Линк хууллаа! ✨');
    // Social share placeholder (can add Twitter/Facebook)
  };

  // Quick Preview
  const openPreview = (advice) => setPreviewAdvice(advice);
  const closePreview = () => setPreviewAdvice(null);

  // Search clear
  const clearSearch = () => setSearchTerm('');

  // Tag click
  const handleTagClick = (tag) => setTagFilter(tagFilter === tag ? '' : tag);

  // Doctor chip click
  const handleDoctorClick = (doctor) => setDoctorFilter(doctorFilter === doctor ? '' : doctor);

  // Card status badge
  const statusBadge = (a) => (
    <span
      className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
        a.isNew ? 'bg-blue-100 text-blue-600 animate-pulse' :
        a.justSaved ? 'bg-green-100 text-green-600 animate-bounce' :
        !a.read ? 'bg-yellow-100 text-yellow-700' :
        'bg-gray-200 text-gray-400'
      }`}
    >
      {!a.read
        ? <MdMarkEmailUnread className="text-base" />
        : <MdMarkEmailRead className="text-base" />
      }
      {a.isNew && 'Шинэ'}
      {a.justSaved && 'Just Saved'}
      {!a.read && !a.isNew && 'Уншаагүй'}
      {a.read && !a.isNew && 'Уншсан'}
    </span>
  );

  // Empty state
  const emptyState = (
    <div className="flex flex-col items-center py-20 text-gray-400 dark:text-gray-500">
      <EmptySVG />
      <div className="font-bold text-lg mb-2">Хадгалсан зөвлөгөөгүй байна</div>
      <div>Та зөвлөгөөг хадгалах үед энд гарч ирнэ.</div>
    </div>
  );

  // Skeletons
  const skeletons = Array.from({ length: 6 }).map((_, i) => (
    <div
      key={i}
      className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-2xl shadow h-64 w-full flex flex-col gap-3 p-4"
    >
      <div className="bg-gray-300 dark:bg-gray-700 h-32 rounded-xl w-full" />
      <div className="bg-gray-200 dark:bg-gray-600 h-6 w-2/3 rounded" />
      <div className="bg-gray-200 dark:bg-gray-600 h-3 w-1/2 rounded" />
      <div className="bg-gray-200 dark:bg-gray-700 h-4 w-20 rounded" />
    </div>
  ));

  // Grid/List view: Card layout
  const AdviceCard = ({ advice, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className={`
        relative group bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden
        transition-all duration-200 ${viewMode === 'grid'
        ? "flex flex-col h-full"
        : "flex flex-row items-stretch"}
        hover:ring-2 hover:ring-primary hover:shadow-2xl
        ${isSelected(advice._id) ? "ring-2 ring-green-400 scale-105" : ""}
      `}
      tabIndex={0}
      aria-label={advice.title}
      onClick={e => e.metaKey || e.ctrlKey ? toggleSelect(advice._id) : undefined}
      onDoubleClick={() => openPreview(advice)}
      onKeyDown={e => {
        if (e.key === " ") toggleSelect(advice._id);
        if (e.key === "Enter") openPreview(advice);
      }}
    >
      {/* Multi-select checkbox */}
      <input
        type="checkbox"
        checked={isSelected(advice._id)}
        onChange={() => toggleSelect(advice._id)}
        className="absolute top-3 right-3 w-5 h-5 accent-primary z-20 cursor-pointer"
        tabIndex={0}
        aria-label="Сонгох"
        onClick={e => e.stopPropagation()}
      />
      {/* Status badge */}
      <div className="absolute left-3 top-3 z-10">
        {statusBadge(advice)}
      </div>
      {/* Doctor chip */}
      {advice.doctor && (
        <button
          className="absolute bottom-3 left-3 flex items-center gap-1 bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full shadow hover:bg-indigo-200 transition"
          onClick={e => { e.stopPropagation(); handleDoctorClick(advice.doctor.name); }}
          tabIndex={0}
          aria-label={advice.doctor.name}
        >
          <FaUserMd className="text-base" />
          {advice.doctor.name}
        </button>
      )}
      {/* Main image (list/grid) */}
      <div className={viewMode === 'grid' ? "w-full h-40" : "w-32 h-32 flex-shrink-0"}>
        <div className="relative h-full w-full group-hover:blur-[2px] transition-all">
          <img
            src={advice.image}
            alt={advice.title}
            className={`object-cover rounded-xl w-full h-full`}
          />
          {/* Tag chip overlay */}
          <div className="absolute left-2 bottom-2 flex gap-1">
            {(advice.tags || []).slice(0, 3).map((tag, i) => (
              <button
                key={tag}
                className={`px-2 py-0.5 text-xs font-semibold rounded-full shadow ${tagClass(i)} hover:scale-110 transition`}
                onClick={e => { e.stopPropagation(); handleTagClick(tag); }}
                tabIndex={0}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Card content */}
      <div className={viewMode === 'grid' ? "flex-1 flex flex-col px-2 pt-2" : "flex-1 flex flex-col pl-4 py-2"}>
        <div className="flex items-center gap-1">
          <h3 className="font-bold text-lg truncate" title={advice.title}>{advice.title}</h3>
          {advice.justSaved && <MdCheckCircle className="text-green-500 animate-bounce" />}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-2 mt-0.5">
          {advice.summary}
        </p>
        <div className="flex items-center gap-2 mt-auto text-xs text-gray-400 dark:text-gray-500">
          <span>
            {new Date(advice.createdAt).toLocaleDateString('mn-MN')}
          </span>
          <span>· 📖 {Math.ceil(advice.summary.split(' ').length / 200)} мин</span>
        </div>
        {/* Action buttons */}
        <div className="flex gap-2 mt-3">
          <motion.button
            whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.12 }}
            onClick={e => { e.stopPropagation(); handleRemove(advice._id); }}
            className="p-2 bg-red-100 text-red-500 rounded-full shadow hover:bg-red-200 transition"
            aria-label="Устгах"
          ><FaTrash /></motion.button>
          <motion.button
            whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.12 }}
            onClick={e => { e.stopPropagation(); handleShare(advice._id); }}
            className="p-2 bg-blue-100 text-blue-500 rounded-full shadow hover:bg-blue-200 transition"
            aria-label="Share"
          ><FaShareAlt /></motion.button>
          <motion.button
            whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.12 }}
            onClick={e => { e.stopPropagation(); openPreview(advice); }}
            className="p-2 bg-green-100 text-green-500 rounded-full shadow hover:bg-green-200 transition"
            aria-label="Quick preview"
          ><FaArrowRight /></motion.button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-4 py-10 transition-colors">
      <h1 className="text-2xl font-semibold mb-6 text-gray-700 dark:text-white">📌 Хадгалсан зөвлөгөөнүүд</h1>
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center mb-6">
        {[
          ['all', 'Бүгд'],
          ['new', 'Шинэхэн'],
          ['read', 'Уншсан'],
          ['unread', 'Уншаагүй'],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilterTab(key)}
            className={`px-3 py-1 rounded-full text-sm font-semibold border transition ${
              filterTab === key
                ? 'bg-primary text-white border-primary'
                : 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-200'
            }`}
            tabIndex={0}
          >{label}</button>
        ))}
        {/* Doctor filter */}
        {doctors.length > 1 && (
          <select
            className="border rounded px-2 py-1 text-sm font-semibold"
            value={doctorFilter}
            onChange={e => setDoctorFilter(e.target.value)}
            aria-label="Эмчээр шүүх"
          >
            <option value="">Бүх эмч</option>
            {doctors.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        )}
        {/* Tag filter */}
        {tags.length > 0 && (
          <select
            className="border rounded px-2 py-1 text-sm font-semibold"
            value={tagFilter}
            onChange={e => setTagFilter(e.target.value)}
            aria-label="Tag filter"
          >
            <option value="">Таг шүүх</option>
            {tags.map((t, i) => <option key={t} value={t}>{'#'+t}</option>)}
          </select>
        )}
        {/* Search input + clear */}
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Зөвлөгөө хайх..."
            aria-label="Search"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-8 py-2 rounded-full border bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300">🔍</span>
          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-100"
              onClick={clearSearch}
              tabIndex={0}
              aria-label="Search clear"
            ><FaTimes /></button>
          )}
        </div>
        {/* Sort */}
        <select
          value={sortKey}
          onChange={e => setSortKey(e.target.value)}
          aria-label="Sort saved advice"
          className="px-3 py-2 border rounded text-sm font-semibold"
        >
          <option value="date">🕒 Шинэ→Хуучин</option>
          <option value="length">⏳ Унших хугацаа</option>
          <option value="doctor">👩‍⚕️ Эмч</option>
        </select>
        {/* View toggle */}
        <button
          onClick={() => setViewMode('grid')}
          aria-label="Grid view"
          className={`p-2 rounded-full ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-800'}`}
        ><FaThLarge /></button>
        <button
          onClick={() => setViewMode('list')}
          aria-label="List view"
          className={`p-2 rounded-full ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-800'}`}
        ><FaListUl /></button>
        {/* Batch remove */}
        {selected.length > 0 && (
          <button
            className="ml-3 px-4 py-2 bg-red-600 text-white rounded-full shadow hover:bg-red-700"
            onClick={handleBatchRemove}
            aria-label="Олон устгах"
          >{selected.length} устгах</button>
        )}
        {selected.length > 0 && (
          <button
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full"
            onClick={clearSelection}
            aria-label="Сонголтыг цэвэрлэх"
          >Цэвэрлэх</button>
        )}
        {filtered.length > 0 && (
          <button
            className="px-3 py-1 bg-green-100 text-green-600 rounded-full"
            onClick={selectAll}
            aria-label="Бүгдийг сонгох"
          >Бүгдийг сонгох</button>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className={`grid ${viewMode === 'grid' ? 'sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-1'} gap-6`}>
          {skeletons}
        </div>
      ) : filtered.length === 0 ? (
        emptyState
      ) : (
        <div className={viewMode === 'grid'
          ? "grid sm:grid-cols-2 md:grid-cols-3 gap-6"
          : "flex flex-col gap-6"}>
          {filtered.map((advice, i) => (
            <AdviceCard advice={advice} index={i} key={advice._id} />
          ))}
        </div>
      )}

      {/* Quick Preview modal */}
      <AnimatePresence>
        {previewAdvice && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center"
            onClick={closePreview}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl max-w-md w-full relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute right-5 top-5 text-gray-500 hover:text-primary"
                onClick={closePreview}
                aria-label="close"
              ><FaTimes /></button>
              <img src={previewAdvice.image} alt={previewAdvice.title} className="rounded-xl w-full h-40 object-cover mb-4" />
              <div className="flex items-center gap-2 mb-2">
                {previewAdvice.doctor && (
                  <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">
                    <FaUserMd className="inline mr-1" />
                    {previewAdvice.doctor.name}
                  </span>
                )}
                {(previewAdvice.tags || []).map((tag, i) =>
                  <span key={tag} className={`${tagClass(i)} px-2 py-0.5 rounded-full text-xs`}>#{tag}</span>
                )}
              </div>
              <h2 className="text-xl font-bold">{previewAdvice.title}</h2>
              <div className="text-gray-600 dark:text-gray-300 mt-2">
                {previewAdvice.summary}
              </div>
              <button
                className="mt-6 w-full bg-primary text-white py-3 rounded-full hover:bg-primary-dark transition"
                onClick={() => { navigate(`/advice/${previewAdvice._id}`); }}
                aria-label="Дэлгэрэнгүй"
              >Дэлгэрэнгүй унших</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SavedAdvice;
