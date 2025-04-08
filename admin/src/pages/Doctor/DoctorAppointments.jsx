import React from 'react'
import { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-4 text-xl font-semibold text-gray-800">Миний бүх цаг захиалгууд</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b bg-gray-50 font-medium text-gray-700">
          <p>#</p>
          <p>Өвчтөн</p>
          <p>Төлбөр</p>
          <p>Нас</p>
          <p>Огноо / Цаг</p>
          <p>Төлбөр (₮)</p>
          <p>Төлөв</p>
        </div>

        {appointments.map((item, index) => (
          <div
            key={index}
            className="flex flex-wrap justify-between max-sm:gap-4 max-sm:text-sm sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-600 py-3 px-6 border-b hover:bg-gray-50 transition"
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img src={item.userData.image} className="w-8 h-8 rounded-full object-cover" alt="Өвчтөн" />
              <p>{item.userData.name}</p>
            </div>

            <div>
              <p className={`text-xs inline px-2 py-0.5 rounded-full border ${item.payment ? 'border-green-500 text-green-600' : 'border-yellow-500 text-yellow-600'}`}>
                {item.payment ? 'Онлайн' : 'Бэлнээр'}
              </p>
            </div>

            <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
            <p>{currency}{item.amount}</p>

            {/* Төлөв */}
            {item.cancelled ? (
              <p className="text-red-500 text-xs font-medium">Цуцлагдсан</p>
            ) : item.isCompleted ? (
              <p className="text-green-500 text-xs font-medium">Дууссан</p>
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