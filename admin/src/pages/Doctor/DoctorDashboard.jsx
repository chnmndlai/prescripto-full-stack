import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';

// KPI өсөлтийн badge өнгөнүүд
const KPI_COLORS = ['bg-green-100 text-green-700', 'bg-blue-100 text-blue-700', 'bg-yellow-100 text-yellow-700'];
const PIE_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#f87171', '#10b981'];

const DoctorDashboard = () => {
  const { dToken, dashData, getDashData, cancelAppointment, completeAppointment } = useContext(DoctorContext);
  const { slotDateFormat, currency, backendUrl } = useContext(AppContext);

  // Charts, loading, error, toggles
  const [stats, setStats] = useState(null);
  const [overview, setOverview] = useState(null);
  const [pie, setPie] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState('');
  const [showCount, setShowCount] = useState(true);
  const [showAvg, setShowAvg] = useState(true);

  // KPI өсөлтийн хувь mock data (бодитоор API-гаас авах)
  const kpiDelta = { earnings: 12, appointments: -3, patients: 8 }; // % change
  
  // Dashboard data fetch
  useEffect(() => {
    if (dToken) {
      getDashData();
      fetchStats();
      fetchOverview();
      fetchPie();
    }
  }, [dToken]);

  // Chart/overview fetch
  const fetchStats = async () => {
    setStatsLoading(true);
    setStatsError('');
    try {
      const res = await axios.get(`${backendUrl}/api/quiz-result/stats`);
      if (res.data.success) setStats(res.data);
      else setStatsError('Статистик олдсонгүй');
    } catch {
      setStatsError('Одоогоор тест бөглөөгүй байна ');
    } finally {
      setStatsLoading(false);
    }
  };
  const fetchOverview = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/quiz-result/overview`);
      if (res.data.success) setOverview(res.data.overview);
    } catch { /* алдаа */ }
  };
  // Pie chart data (Risk breakdown жишээ)
  const fetchPie = async () => {
    // API-гүй бол mock data
    setPie([
      { name: "Бага эрсдэл", value: 38 },
      { name: "Дунд эрсдэл", value: 24 },
      { name: "Өндөр эрсдэл", value: 12 },
      { name: "Тодорхойгүй", value: 8 },
    ]);
  };

  // Loading skeleton
  if (!dashData)
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-2xl shadow" />
        ))}
        <div className="md:col-span-3 h-96 bg-gray-100 dark:bg-gray-800 rounded-2xl shadow mt-8" />
      </div>
    );

  return (
    <div className="m-0 md:m-5 min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:to-gray-800 transition">
      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-8">
        {[
          {
            icon: assets.earning_icon,
            label: 'Орлого',
            value: dashData.earnings,
            delta: kpiDelta.earnings,
            color: KPI_COLORS[0],
            prefix: '₮ ',
          },
          {
            icon: assets.appointments_icon,
            label: 'Захиалгууд',
            value: dashData.appointments,
            delta: kpiDelta.appointments,
            color: KPI_COLORS[1],
          },
          {
            icon: assets.patients_icon,
            label: 'Өвчтөнүүд',
            value: dashData.patients,
            delta: kpiDelta.patients,
            color: KPI_COLORS[2],
          },
        ].map((card, i) => (
          <motion.div
            whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(100, 116, 139, 0.10)' }}
            key={card.label}
            className={`relative flex items-center gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl border shadow group transition`}
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center shadow bg-gradient-to-br from-indigo-100 to-white dark:from-indigo-900 dark:to-gray-800">
              <img className="w-8 h-8" src={card.icon} alt={card.label} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  <CountUp end={card.value} duration={1.2} prefix={card.prefix || ''} separator=" " />
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${card.color} animate-pulse`}>
                  {card.delta > 0 && '+'}{card.delta}%
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-300">{card.label}</p>
            </div>
            {/* Details shortcut */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-primary transition"
              title="Дэлгэрэнгүй"
              tabIndex={0}
            >⋮</button>
          </motion.div>
        ))}
      </div>

      {/* CHART + PIE ROW */}
      <div className="grid md:grid-cols-3 gap-7">
        {/* Line chart */}
        <div className="md:col-span-2 bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">
              📅 7 хоногийн тест бөглөлтийн статистик
            </h2>
            {/* Toggle */}
            <div className="flex gap-2 items-center text-xs">
              <label className="flex items-center gap-1 cursor-pointer">
                <input type="checkbox" checked={showCount} onChange={() => setShowCount(v => !v)} />
                <span>Бөглөсөн хүн</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input type="checkbox" checked={showAvg} onChange={() => setShowAvg(v => !v)} />
                <span>Дундаж оноо</span>
              </label>
            </div>
          </div>
          {/* Loading/Error/Chart */}
          {statsLoading ? (
            <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
          ) : statsError ? (
            <div className="h-64 flex items-center justify-center text-red-500 font-bold">{statsError}</div>
          ) : !stats?.weekly?.length ? (
            <div className="h-64 flex items-center justify-center text-gray-400 font-medium">
              Статистик байхгүй байна
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.weekly}>
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                {showCount && <Line type="monotone" dataKey="count" stroke="#8884d8" name="Бөглөсөн хүн" strokeWidth={2} />}
                {showAvg && <Line type="monotone" dataKey="avgScore" stroke="#22c55e" name="Дундаж оноо" strokeWidth={2} />}
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* PIE CHART (Risk breakdown) */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 flex flex-col items-center justify-center">
          <h2 className="font-bold text-md mb-4 text-gray-800 dark:text-gray-100">⚡ Эрсдэлийн түвшин (жишээ)</h2>
          {pie ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  fill="#8884d8"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pie.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-32 w-full bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
          )}
        </div>
      </div>

      {/* OVERVIEW */}
      <div className="mt-10 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
        <p className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-100">🧾 Тестийн үр дүнгийн тойм</p>
        {!overview?.length ? (
          <div className="h-20 flex items-center justify-center text-gray-400">Тойм дата байхгүй байна</div>
        ) : (
          <ul className="space-y-2">
            {overview.map((q, i) => (
              <li key={i} className="text-gray-700 dark:text-gray-200">
                📌 <span className="font-bold">{q._id.title}</span> — <span className="text-blue-500">{q.count}</span> удаа бөглөгдсөн,
                дундаж оноо: <span className="font-semibold text-green-600">{q.avgScore.toFixed(1)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* LATEST APPOINTMENTS */}
      <div className="bg-white dark:bg-gray-900 mt-10 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-t-2xl border-b">
          <img src={assets.list_icon} alt="Жагсаалт" className="w-5 h-5" />
          <p className="font-semibold text-gray-700 dark:text-gray-100">Сүүлд хийсэн захиалгууд</p>
        </div>
        <div className="p-4 space-y-2">
          {!dashData.latestAppointments?.length ? (
            <div className="h-20 flex items-center justify-center text-gray-400">
              Захиалга олдсонгүй
            </div>
          ) : (
            dashData.latestAppointments.slice(0, 5).map((item, idx) => (
              <motion.div
                whileHover={{ scale: 1.02 }}
                key={idx}
                className="flex items-center justify-between gap-4 px-4 py-3 rounded-md bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-indigo-950 transition group"
              >
                <div className="flex items-center gap-3">
                  <img className="rounded-full w-12 h-12 object-cover border-2 border-white shadow" src={item.userData.image} alt="Өвчтөн" />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-100">{item.userData.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-300">Захиалга: {slotDateFormat(item.slotDate)}</p>
                  </div>
                </div>
                <div>
                  {item.cancelled ? (
                    <p className="text-red-500 text-xs font-bold">❌ Цуцлагдсан</p>
                  ) : item.isCompleted ? (
                    <p className="text-green-500 text-xs font-bold">✔ Дууссан</p>
                  ) : (
                    <div className="flex items-center gap-2">
                      <img
                        onClick={() => cancelAppointment(item._id)}
                        className="w-8 h-8 cursor-pointer hover:scale-110 active:scale-95 transition"
                        src={assets.cancel_icon}
                        alt="Цуцлах"
                        title="Захиалгыг цуцлах"
                        tabIndex={0}
                      />
                      <img
                        onClick={() => completeAppointment(item._id)}
                        className="w-8 h-8 cursor-pointer hover:scale-110 active:scale-95 transition"
                        src={assets.tick_icon}
                        alt="Дуусгах"
                        title="Захиалгыг дуусгах"
                        tabIndex={0}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* LAST UPDATED */}
      <div className="text-xs text-gray-400 text-right mt-3 mb-5">
        Өгөгдлийг сүүлд шинэчилсэн: {new Date().toLocaleString('mn-MN')}
      </div>
    </div>
  );
};

export default DoctorDashboard;
