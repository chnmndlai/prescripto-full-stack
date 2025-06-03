import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MdCheckCircle, MdCancel, MdPending, MdClear, MdRefresh, MdSentimentDissatisfied } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

const DoctorAppointments = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    cancelAppointment,
    completeAppointment
  } = useContext(DoctorContext);
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext);

  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loadingRow, setLoadingRow] = useState(null); // for action spinner
  const [loadingList, setLoadingList] = useState(false);

  useEffect(() => {
    if (dToken) {
      setLoadingList(true);
      Promise.resolve(getAppointments()).finally(() => setLoadingList(false));
    }
  }, [dToken]);

  // Filter logic
  const filteredAppointments = appointments.filter((item) => {
    const slotMonth = item.slotDate.split('_')[1]; // MM
    const matchesMonth = selectedMonth ? slotMonth === selectedMonth : true;

    const status = item.cancelled ? 'cancelled' : item.isCompleted ? 'done' : 'pending';
    const matchesStatus = selectedStatus ? selectedStatus === status : true;

    return matchesMonth && matchesStatus;
  });

  // Chart data
  const chartData = [
    { name: 'Захиалга', value: filteredAppointments.length },
    { name: 'Орлого (₮)', value: filteredAppointments.reduce((sum, item) => sum + item.amount, 0) }
  ];

  // Status UI
  const getStatusTag = (item) => {
    if (item.cancelled)
      return (
        <span className="inline-flex items-center gap-1 bg-red-50 text-red-500 border border-red-200 rounded-full px-3 py-1 text-xs font-bold">
          <MdCancel /> Цуцлагдсан
        </span>
      );
    if (item.isCompleted)
      return (
        <span className="inline-flex items-center gap-1 bg-green-50 text-green-600 border border-green-200 rounded-full px-3 py-1 text-xs font-bold">
          <MdCheckCircle /> Дууссан
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-500 border border-yellow-200 rounded-full px-3 py-1 text-xs font-bold">
        <MdPending /> Хүлээгдэж буй
      </span>
    );
  };

  // Row action handler with spinner
  const handleCancel = async (_id) => {
    setLoadingRow(_id + '-cancel');
    await cancelAppointment(_id);
    setLoadingRow(null);
  };
  const handleComplete = async (_id) => {
    setLoadingRow(_id + '-done');
    await completeAppointment(_id);
    setLoadingRow(null);
  };

  // Empty state UI
  const emptyUi = (
    <div className="flex flex-col items-center py-16 opacity-80">
      <MdSentimentDissatisfied className="text-5xl text-blue-200 mb-3" />
      <span className="text-gray-500">Хүссэн тохиргоонд захиалга олдсонгүй.</span>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-2 sm:p-5">
      <p className="mb-6 text-2xl font-bold text-blue-700 tracking-tight">Миний бүх цаг захиалгууд</p>

      {/* Шүүлтүүрүүд */}
      <div className="flex flex-wrap gap-3 mb-7 items-center">
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="border px-4 py-2 rounded-xl bg-blue-50 focus:ring-2 ring-blue-100">
          <option value="">Бүх сар</option>
          {Array.from({length:12}).map((_,i)=>(
            <option value={String(i+1).padStart(2, '0')}>{i+1}-р сар</option>
          ))}
        </select>
        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="border px-4 py-2 rounded-xl bg-blue-50 focus:ring-2 ring-blue-100">
          <option value="">Бүх төлөв</option>
          <option value="done">Дууссан</option>
          <option value="cancelled">Цуцлагдсан</option>
          <option value="pending">Хүлээгдэж буй</option>
        </select>
        {(selectedMonth || selectedStatus) && (
          <button onClick={() => { setSelectedMonth(""); setSelectedStatus(""); }} className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-xs">
            <MdClear /> Шүүлтүүр арилгах
          </button>
        )}
        <button onClick={getAppointments} className="ml-auto flex items-center gap-1 px-3 py-2 rounded-xl bg-gray-100 hover:bg-blue-50 text-blue-600 text-xs font-medium">
          <MdRefresh /> Дахин ачаалах
        </button>
      </div>

      {/* Chart */}
      <div className="mb-7 bg-white p-6 rounded-2xl shadow flex flex-col gap-2">
        <p className="text-lg font-bold mb-2 text-blue-700">Хураангуй график</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" tick={{ fontSize: 13 }} />
            <YAxis tick={{ fontSize: 13 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#6366F1" radius={[16, 16, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table/List */}
      <div className="bg-white border border-blue-50 rounded-2xl shadow-md text-sm max-h-[60vh] overflow-y-auto transition-all">
        <div className="hidden sm:grid grid-cols-[0.5fr_2.2fr_1fr_1.1fr_2.5fr_1.2fr_1.2fr] gap-2 py-3 px-6 bg-blue-50 font-semibold text-gray-700 rounded-t-2xl sticky top-0 z-10">
          <p>#</p>
          <p>Өвчтөн</p>
          <p>Төлбөр</p>
          <p>Нас</p>
          <p>Огноо / Цаг</p>
          <p>Төлбөр (₮)</p>
          <p>Төлөв</p>
        </div>
        {loadingList ? (
          <div className="p-10 flex justify-center items-center opacity-70">
            <svg className="animate-spin" width="32" height="32" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="20" stroke="#6366F1" strokeWidth="4" strokeLinecap="round" strokeDasharray="90 90" strokeDashoffset="0" /></svg>
            <span className="ml-3 text-blue-400 font-semibold">Уншиж байна...</span>
          </div>
        ) : filteredAppointments.length === 0 ? (
          emptyUi
        ) : (
          <AnimatePresence>
            {filteredAppointments.map((item, index) => (
              <motion.div
                key={item._id || index}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-wrap sm:grid grid-cols-[0.5fr_2.2fr_1fr_1.1fr_2.5fr_1.2fr_1.2fr] gap-2 items-center text-gray-700 py-3 px-6 border-t border-blue-50 hover:bg-blue-50/60 rounded-xl transition-all"
                style={{ boxShadow: "0 3px 12px 0 rgb(60 100 220 / 0.03)" }}
              >
                <p className="max-sm:hidden text-xs">{index + 1}</p>
                {/* Өвчтөн */}
                <div className="flex items-center gap-3 min-w-[90px]">
                  <img src={item.userData.image} className="w-10 h-10 rounded-full object-cover border-2 border-blue-100 shadow" alt="Өвчтөн" />
                  <div>
                    <p className="font-semibold text-blue-700">{item.userData.name}</p>
                    {/* Example badge, customize as you wish */}
                    {item.userData.rebook && (
                      <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 mt-0.5">Дахин захиалга</span>
                    )}
                  </div>
                </div>
                {/* Төлбөр */}
                <div>
                  <p className={`text-xs inline px-2 py-0.5 rounded-full border font-bold ${item.payment ? 'border-green-400 text-green-600 bg-green-50' : 'border-yellow-400 text-yellow-600 bg-yellow-50'}`}>
                    {item.payment ? 'Онлайн' : 'Бэлнээр'}
                  </p>
                </div>
                <p className="max-sm:hidden text-xs">{calculateAge(item.userData.dob)}</p>
                <p className="whitespace-nowrap">
                  {slotDateFormat(item.slotDate)}, <span className="font-medium">{item.slotTime}</span>
                </p>
                <p className="font-semibold text-gray-800">{currency}{item.amount}</p>
                {/* Төлөв tag */}
                <div>{getStatusTag(item)}</div>
                {/* Actions */}
                <div>
                  {item.cancelled || item.isCompleted ? null : (
                    <div className="flex items-center gap-2">
                      <button
                        disabled={loadingRow === item._id + '-cancel'}
                        onClick={() => handleCancel(item._id)}
                        className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition border border-red-100 shadow text-red-500"
                        title="Захиалгыг цуцлах"
                      >
                        {loadingRow === item._id + '-cancel' ? (
                          <svg className="animate-spin" width="20" height="20" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="20" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" strokeDasharray="90 90" strokeDashoffset="0" /></svg>
                        ) : (
                          <MdCancel />
                        )}
                      </button>
                      <button
                        disabled={loadingRow === item._id + '-done'}
                        onClick={() => handleComplete(item._id)}
                        className="w-8 h-8 rounded-full bg-green-50 hover:bg-green-100 flex items-center justify-center transition border border-green-100 shadow text-green-500"
                        title="Захиалгыг дуусгах"
                      >
                        {loadingRow === item._id + '-done' ? (
                          <svg className="animate-spin" width="20" height="20" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="20" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" strokeDasharray="90 90" strokeDashoffset="0" /></svg>
                        ) : (
                          <MdCheckCircle />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;
