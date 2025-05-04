import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

const DoctorDashboard = () => {
  const { dToken, dashData, getDashData, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, currency, backendUrl } = useContext(AppContext);
  const [stats, setStats] = useState(null);
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    if (dToken) {
      getDashData();
      fetchStats();
      fetchOverview();
    }
  }, [dToken]);

  const fetchStats = async () => {
    const res = await axios.get(`${backendUrl}/api/quiz-result/stats`);
    if (res.data.success) setStats(res.data);
  };

  const fetchOverview = async () => {
    const res = await axios.get(`${backendUrl}/api/quiz-result/overview`);
    if (res.data.success) setOverview(res.data.overview);
  };

  return dashData && (
    <div className='m-5'>

      {/* 📊 ТОЙМ КАРТУУД */}
      <div className='flex flex-wrap gap-4'>
        <div className='flex items-center gap-4 bg-white p-5 min-w-56 rounded-xl border border-gray-200 shadow hover:shadow-md hover:scale-[1.03] transition'>
          <img className='w-12' src={assets.earning_icon} alt="Орлого" />
          <div>
            <p className='text-2xl font-semibold text-gray-700'>₮ {dashData.earnings}</p>
            <p className='text-gray-500'>Орлого</p>
          </div>
        </div>
        <div className='flex items-center gap-4 bg-white p-5 min-w-56 rounded-xl border border-gray-200 shadow hover:shadow-md hover:scale-[1.03] transition'>
          <img className='w-12' src={assets.appointments_icon} alt="Захиалгууд" />
          <div>
            <p className='text-2xl font-semibold text-gray-700'>{dashData.appointments}</p>
            <p className='text-gray-500'>Захиалгууд</p>
          </div>
        </div>
        <div className='flex items-center gap-4 bg-white p-5 min-w-56 rounded-xl border border-gray-200 shadow hover:shadow-md hover:scale-[1.03] transition'>
          <img className='w-12' src={assets.patients_icon} alt="Өвчтөнүүд" />
          <div>
            <p className='text-2xl font-semibold text-gray-700'>{dashData.patients}</p>
            <p className='text-gray-500'>Өвчтөнүүд</p>
          </div>
        </div>
      </div>

      {/* 📈 Сүүлийн 7 хоногийн тест бөглөсөн хэрэглэгчдийн статистик */}
      {stats && (
        <div className='mt-10 bg-white p-5 rounded-lg shadow'>
          <p className='text-lg font-semibold text-gray-800 mb-3'>📅 7 хоногийн тест бөглөлтийн статистик</p>
          <ResponsiveContainer width='100%' height={300}>
            <LineChart data={stats.weekly}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8884d8" name='Бөглөсөн хүн' />
              <Line type="monotone" dataKey="avgScore" stroke="#82ca9d" name='Дундаж оноо' />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 🧠 Тестийн үр дүнгийн тойм */}
      {overview && (
        <div className='mt-10 bg-white p-5 rounded-lg shadow'>
          <p className='text-lg font-semibold text-gray-800 mb-3'>🧾 Тестийн үр дүнгийн тойм</p>
          <ul className='space-y-2'>
            {overview.map((q, index) => (
              <li key={index} className='text-gray-700'>
                📌 <strong>{q._id.title}</strong> — {q.count} удаа бөглөгдсөн, дундаж оноо: {q.avgScore.toFixed(1)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 🕓 СҮҮЛД ХИЙСЭН ЗАХИАЛГУУД */}
      <div className='bg-white mt-10 rounded-lg border shadow-sm'>
        <div className='flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-t-lg border-b'>
          <img src={assets.list_icon} alt="Жагсаалт" className="w-5 h-5" />
          <p className='font-semibold text-gray-700'>Сүүлд хийсэн захиалгууд</p>
        </div>

        <div className='p-4 space-y-2'>
          {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <div key={index} className='flex items-center justify-between gap-4 px-4 py-3 rounded-md bg-gray-50 hover:bg-gray-100 transition'>
              <div className='flex items-center gap-3'>
                <img className='rounded-full w-10 h-10 object-cover border border-gray-300' src={item.userData.image} alt="Өвчтөн" />
                <div>
                  <p className='font-medium text-gray-800'>{item.userData.name}</p>
                  <p className='text-sm text-gray-500'>Захиалга хийх өдөр: {slotDateFormat(item.slotDate)}</p>
                </div>
              </div>
              <div>
                {item.cancelled ? (
                  <p className='text-red-500 text-sm font-medium'>❌ Цуцлагдсан</p>
                ) : item.isCompleted ? (
                  <p className='text-green-500 text-sm font-medium'>✔ Дууссан</p>
                ) : (
                  <div className='flex items-center gap-2'>
                    <img
                      onClick={() => cancelAppointment(item._id)}
                      className='w-8 h-8 cursor-pointer hover:scale-105 transition'
                      src={assets.cancel_icon}
                      alt="Цуцлах"
                      title="Захиалгыг цуцлах"
                    />
                    <img
                      onClick={() => completeAppointment(item._id)}
                      className='w-8 h-8 cursor-pointer hover:scale-105 transition'
                      src={assets.tick_icon}
                      alt="Дуусгах"
                      title="Захиалгыг дуусгах"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default DoctorDashboard