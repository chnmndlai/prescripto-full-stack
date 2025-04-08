import React, { useContext, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  return dashData && (
    <div className="m-5">

      {/* Хураангуй хэсэг */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-3 bg-white p-4 min-w-52 rounded border hover:shadow transition">
          <img className="w-14" src={assets.doctor_icon} alt="Эмч" />
          <div>
            <p className="text-xl font-semibold text-gray-700">{dashData.doctors}</p>
            <p className="text-gray-500">Нийт эмч</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white p-4 min-w-52 rounded border hover:shadow transition">
          <img className="w-14" src={assets.appointments_icon} alt="Захиалга" />
          <div>
            <p className="text-xl font-semibold text-gray-700">{dashData.appointments}</p>
            <p className="text-gray-500">Нийт захиалга</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white p-4 min-w-52 rounded border hover:shadow transition">
          <img className="w-14" src={assets.patients_icon} alt="Өвчтөн" />
          <div>
            <p className="text-xl font-semibold text-gray-700">{dashData.patients}</p>
            <p className="text-gray-500">Нийт өвчтөн</p>
          </div>
        </div>
      </div>

      {/* Захиалгын жагсаалт */}
      <div className="bg-white mt-10 rounded shadow border">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b">
          <img src={assets.list_icon} alt="Захиалгын жагсаалт" />
          <p className="font-semibold text-gray-700">Сүүлд хийгдсэн захиалгууд</p>
        </div>

        <div className="divide-y">
          {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <div key={index} className="flex items-center px-6 py-4 gap-4 hover:bg-gray-50 transition">
              <img className="rounded-full w-10 h-10 object-cover bg-gray-100" src={item.docData.image} alt="Эмчийн зураг" />
              <div className="flex-1 text-sm">
                <p className="text-gray-800 font-medium">{item.docData.name}</p>
                <p className="text-gray-500">Захиалсан огноо: {slotDateFormat(item.slotDate)}</p>
              </div>

              {/* Захиалгын төлөв */}
              {item.cancelled ? (
                <p className="text-red-500 text-xs font-semibold">Цуцлагдсан</p>
              ) : item.isCompleted ? (
                <p className="text-green-500 text-xs font-semibold">Дууссан</p>
              ) : (
                <img
                  onClick={() => cancelAppointment(item._id)}
                  className="w-8 cursor-pointer hover:scale-105 transition"
                  src={assets.cancel_icon}
                  alt="Цуцлах"
                  title="Захиалга цуцлах"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
