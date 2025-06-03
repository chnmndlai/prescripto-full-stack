import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdExpandMore, MdExpandLess, MdPerson, MdSentimentDissatisfied } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

const riskColors = {
  'Өндөр': 'bg-red-100 text-red-600 border-red-300',
  'Дунд': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  'Бага': 'bg-green-100 text-green-700 border-green-300',
};

const DoctorQuizResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('doctorToken');
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/quiz-results`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) setResults(res.data.results);
      } catch (error) {
        console.error('Тестийн үр дүн татахад алдаа:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtered results
  const filtered = results.filter(r =>
    (r.userId?.name?.toLowerCase().includes(search.toLowerCase())) &&
    (filterRisk ? r.level === filterRisk : true)
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2">
        🧾 Ирсэн сэтгэлзүйн тестүүд
      </h2>

      {/* Filter/Search */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          className="border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200"
          placeholder="Хэрэглэгчээр хайх..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200"
          value={filterRisk}
          onChange={e => setFilterRisk(e.target.value)}
        >
          <option value="">Эрсдэлээр шүүх</option>
          <option value="Өндөр">Өндөр</option>
          <option value="Дунд">Дунд</option>
          <option value="Бага">Бага</option>
        </select>
      </div>

      {/* Loading skeleton */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-16" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center text-gray-400 py-16">
          <MdSentimentDissatisfied className="text-5xl mb-3" />
          <span>Тохирох тестийн үр дүн олдсонгүй.</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-3 min-w-[700px]">
            <thead className="sticky top-0 z-10">
              <tr className="text-gray-500 text-xs uppercase bg-blue-50">
                <th className="text-left px-3 py-2 rounded-tl-2xl">№</th>
                <th className="text-left px-3 py-2">Хэрэглэгч</th>
                <th className="text-left px-3 py-2">Оноо</th>
                <th className="text-left px-3 py-2">Эрсдэл</th>
                <th className="text-left px-3 py-2">Огноо</th>
                <th className="text-left px-3 py-2 rounded-tr-2xl"></th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((res, i) => (
                  <React.Fragment key={res._id}>
                    <motion.tr
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white rounded-2xl shadow group hover:shadow-xl hover:scale-[1.015] transition cursor-pointer"
                      style={{ boxShadow: "0 3px 12px 0 rgb(60 100 220 / 0.05)" }}
                    >
                      <td className="px-3 py-4 font-semibold text-blue-700 text-center">{i + 1}</td>
                      <td className="px-3 py-4 flex items-center gap-2">
                        <span className="w-9 h-9 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center text-xl">
                          <MdPerson />
                        </span>
                        <span className="font-medium">{res.userId?.name || 'Тодорхойгүй'}</span>
                      </td>
                      <td className="px-3 py-4">{res.score}</td>
                      <td className="px-3 py-4">
                        <span className={`inline-block px-2 py-1 border rounded-full font-bold text-xs ${riskColors[res.level] || 'bg-gray-100 border-gray-200 text-gray-500'}`}>
                          {res.level}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-gray-600">
                        {new Date(res.createdAt).toLocaleString('mn-MN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-3 py-4">
                        <button
                          className="flex items-center gap-1 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full px-3 py-1 text-xs font-bold transition"
                          onClick={() => setExpanded(expanded === res._id ? null : res._id)}
                        >
                          {expanded === res._id ? <MdExpandLess /> : <MdExpandMore />}
                          {expanded === res._id ? 'Хураах' : 'Дэлгэрэнгүй'}
                        </button>
                      </td>
                    </motion.tr>
                    <AnimatePresence>
                      {expanded === res._id && res.answers && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-blue-50"
                        >
                          <td colSpan={6} className="px-6 py-4 rounded-b-2xl">
                            <h4 className='font-semibold mb-2 text-blue-600'>📝 Хариултууд:</h4>
                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                              {Object.entries(res.answers).map(([key, val], idx) => (
                                <li key={idx}><strong>Асуулт {key}:</strong> {val}</li>
                              ))}
                            </ul>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DoctorQuizResults;
