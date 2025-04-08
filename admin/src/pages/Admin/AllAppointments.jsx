import React, { useEffect, useContext } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AllAppointments = () => {
  const { aToken, appointments, cancelAppointment, getAllAppointments } = useContext(AdminContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  return (
    <div className="w-full max-w-6xl mx-auto m-5">
      <p className="mb-3 text-lg font-semibold">Бүх захиалгууд</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll">
        {/* Header */}
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b font-medium text-gray-700 bg-gray-50">
          <p>#</p>
          <p>Өвчтөн</p>
          <p>Нас</p>
          <p>Огноо / Цаг</p>
          <p>Эмч</p>
          <p>Төлбөр</p>
          <p>Төлөв</p>
        </div>

        {/* Appointments list */}
        {appointments.map((item, index) => (
          <div
            key={item._id}
            className="flex flex-wrap justify-between sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-600 py-3 px-6 border-b hover:bg-gray-50 transition"
          >
            {/* № */}
            <p className="max-sm:hidden">{index + 1}</p>

            {/* Patient */}
            <div className="flex items-center gap-2">
              <img src={item.userData.image} className="w-8 h-8 rounded-full object-cover" alt="Өвчтөн" />
              <p>{item.userData.name}</p>
            </div>

            {/* Нас */}
            <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>

            {/* Date & Time */}
            <p>
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>

            {/* Doctor */}
            <div className="flex items-center gap-2">
              <img src={item.docData.image} className="w-8 h-8 rounded-full bg-gray-200 object-cover" alt="Эмч" />
              <p>{item.docData.name}</p>
            </div>

            {/* Төлбөр */}
            <p>{currency}{item.amount}</p>

            {/* Төлөв */}
            {item.cancelled ? (
              <p className="text-red-500 font-medium text-xs">Цуцлагдсан</p>
            ) : item.isCompleted ? (
              <p className="text-green-500 font-medium text-xs">Дууссан</p>
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
  )
}

export default AllAppointments
