import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {
  const { doctors, changeAvailability, aToken, getAllDoctors } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken])

  return (
    <div className="m-5 max-h-[90vh] overflow-y-auto">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Бүх эмч нар</h1>

      <div className="flex flex-wrap gap-5">
        {doctors.map((item, index) => (
          <div
            key={index}
            className="border border-[#C9D8FF] rounded-xl w-64 overflow-hidden bg-white shadow-sm hover:shadow-md transition"
          >
            <img
              src={item.image}
              alt={`${item.name} зураг`}
              className="w-full h-44 object-cover bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500"
            />

            <div className="p-4">
              <p className="text-lg font-semibold text-gray-800">{item.name}</p>
              <p className="text-sm text-gray-600">{item.speciality}</p>
              <p className="text-sm text-gray-500">Туршлага: {item.experience}</p>
              <p className="text-sm text-gray-500">Боловсрол: {item.degree}</p>

              {/* Боломжтой эсэхийг солих checkbox */}
              <label className="flex items-center gap-2 text-sm cursor-pointer select-none mt-2">
                <input
                  type="checkbox"
                  checked={item.available}
                  onChange={() => changeAvailability(item._id)}
                  className="accent-primary"
                />
                <span className={item.available ? "text-green-600 font-medium" : "text-gray-500"}>
                  {item.available ? "Боломжтой" : "Завгүй"}
                </span>
              </label>

              {/* Дэлгэрэнгүй үзэх товч */}
              <button
                onClick={() => alert(`Эмчийн дэлгэрэнгүй хуудас: ${item.name}`)}
                className="mt-3 text-primary text-sm font-medium hover:underline"
              >
                Дэлгэрэнгүй үзэх
              </button>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorsList
