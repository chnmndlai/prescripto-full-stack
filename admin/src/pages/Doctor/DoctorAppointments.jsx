import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)

  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    if (dToken) getAppointments()
  }, [dToken])

  // 🧠 Шүүлтүүр логик
  const filteredAppointments = appointments.filter((item) => {
    const slotMonth = item.slotDate.split('_')[1]; // MM
    const matchesMonth = selectedMonth ? slotMonth === selectedMonth : true;

    const status = item.cancelled ? 'cancelled' : item.isCompleted ? 'done' : 'pending';
    const matchesStatus = selectedStatus ? selectedStatus === status : true;

    return matchesMonth && matchesStatus;
  });

  // 📊 Chart data
  const chartData = [
    { name: 'Захиалга', value: filteredAppointments.length },
    { name: 'Орлого (₮)', value: filteredAppointments.reduce((sum, item) => sum + item.amount, 0) }
  ];

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-4 text-2xl font-semibold text-gray-800">Миний бүх цаг захиалгууд</p>

      {/* 🔍 Шүүлтүүрүүд */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="border px-4 py-2 rounded-md">
          <option value="">Бүх сар</option>
          <option value="01">1-р сар</option>
          <option value="02">2-р сар</option>
          <option value="03">3-р сар</option>
          <option value="04">4-р сар</option>
          <option value="05">5-р сар</option>
          <option value="06">6-р сар</option>
          <option value="07">7-р сар</option>
          <option value="08">8-р сар</option>
          <option value="09">9-р сар</option>
          <option value="10">10-р сар</option>
          <option value="11">11-р сар</option>
          <option value="12">12-р сар</option>
        </select>

        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="border px-4 py-2 rounded-md">
          <option value="">Бүх төлөв</option>
          <option value="done">Дууссан</option>
          <option value="cancelled">Цуцлагдсан</option>
          <option value="pending">Хүлээгдэж буй</option>
        </select>
      </div>

      {/* 📈 Хураангуй график */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <p className="text-lg font-semibold mb-3">Хураангуй график</p>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4F46E5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 📋 Жагсаалт хүснэгт */}
      <div className="bg-white border rounded-lg shadow-sm text-sm max-h-[60vh] overflow-y-auto">
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-2 py-3 px-6 bg-gray-100 font-semibold text-gray-700 rounded-t-lg">
          <p>#</p>
          <p>Өвчтөн</p>
          <p>Төлбөр</p>
          <p>Нас</p>
          <p>Огноо / Цаг</p>
          <p>Төлбөр (₮)</p>
          <p>Төлөв</p>
        </div>

        {filteredAppointments.map((item, index) => (
          <div
            key={index}
            className="flex flex-wrap justify-between max-sm:gap-4 max-sm:text-sm sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-2 items-center text-gray-600 py-3 px-6 border-t hover:bg-gray-50 transition"
          >
            <p className="max-sm:hidden">{index + 1}</p>

            <div className="flex items-center gap-3">
              <img src={item.userData.image} className="w-9 h-9 rounded-full object-cover border border-gray-300" alt="Өвчтөн" />
              <p className="font-medium text-gray-800">{item.userData.name}</p>
            </div>

            <div>
              <p className={`text-xs inline px-2 py-0.5 rounded-full border font-medium ${item.payment ? 'border-green-500 text-green-600' : 'border-yellow-500 text-yellow-600'}`}>
                {item.payment ? 'Онлайн' : 'Бэлнээр'}
              </p>
            </div>

            <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>

            <p>
              {slotDateFormat(item.slotDate)}, <br className="sm:hidden" />
              <span className="font-medium">{item.slotTime}</span>
            </p>

            <p className="font-semibold text-gray-700">{currency}{item.amount}</p>

            {item.cancelled ? (
              <p className="text-red-500 text-sm font-medium">❌ Цуцлагдсан</p>
            ) : item.isCompleted ? (
              <p className="text-green-500 text-sm font-medium">✔ Дууссан</p>
            ) : (
              <div className="flex items-center gap-2">
                <img
                  onClick={() => cancelAppointment(item._id)}
                  className="w-8 h-8 cursor-pointer hover:scale-105 transition"
                  src={assets.cancel_icon}
                  alt="Цуцлах"
                  title="Захиалгыг цуцлах"
                />
                <img
                  onClick={() => completeAppointment(item._id)}
                  className="w-8 h-8 cursor-pointer hover:scale-105 transition"
                  src={assets.tick_icon}
                  alt="Дуусгах"
                  title="Захиалгыг дуусгах"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorAppointments
