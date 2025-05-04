import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useNavigate } from 'react-router-dom'

const DoctorsList = () => {
  const { doctors, changeAvailability, aToken, getAllDoctors } = useContext(AdminContext)
  const navigate = useNavigate();

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken])

  return (
    <div className="m-5 max-h-[90vh] overflow-y-auto">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Бүх эмч нар</h1>

      <div className="flex flex-wrap gap-6">
        {doctors.map((item, index) => (
          <div
            key={index}
            className="group border border-[#C9D8FF] rounded-xl w-64 overflow-hidden bg-white shadow-sm hover:shadow-lg transition-transform transform hover:-translate-y-1"
          >
            <img
              src={item.image}
              alt={`${item.name} зураг`}
              className="w-full h-60 object-contain bg-white p-2"
            />

            <div className="p-4 flex flex-col h-full">
              <p className="text-lg font-semibold text-gray-800">{item.name}</p>
              <p className="text-sm text-gray-600">{item.speciality}</p>
              <p className="text-sm text-gray-500">Туршлага: {item.experience}</p>
              <p className="text-sm text-gray-500">Боловсрол: {item.degree}</p>

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

              <button
                onClick={() => navigate(`/admin/doctor/${item._id}`)}
                className="mt-3 text-primary text-sm font-medium hover:underline text-left"
              >
                Дэлгэрэнгүй үзэх →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorsList
