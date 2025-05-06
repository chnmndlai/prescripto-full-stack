// frontend/src/pages/MyAppointments.jsx
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CancelModal from '../components/CancelModal'; // 🌟 нэмэгдсэн

const MyAppointments = () => {
  const { backendUrl, token } = useContext(AppContext);
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [cancelModalOpen, setCancelModalOpen] = useState(false); // 🌟 нэмэгдсэн
  const [appointmentToCancel, setAppointmentToCancel] = useState(null); // 🌟 нэмэгдсэн

  const months = ["1-р сар", "2-р сар", "3-р сар", "4-р сар", "5-р сар", "6-р сар", "7-р сар", "8-р сар", "9-р сар", "10-р сар", "11-р сар", "12-р сар"];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_');
    return `${dateArray[0]} ${months[Number(dateArray[1]) - 1]} ${dateArray[2]}`;
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } });
      setAppointments(data.appointments.reverse());
    } catch (error) {
      toast.error(error.message);
    }
  };

  const cancelAppointmentWithReason = async (appointmentId, reason) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/cancel-appointment',
        { appointmentId, reason },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCancelClick = (id) => {
    setAppointmentToCancel(id);
    setCancelModalOpen(true);
  };

  const isPastAppointment = (slotDate, slotTime) => {
    const [day, month, year] = slotDate.split('_');
    const fullDate = new Date(`${year}-${month}-${day} ${slotTime}`);
    return new Date() > fullDate;
  };

  const tileContent = ({ date }) => {
    const matching = appointments.find(a => {
      const [d, m, y] = a.slotDate.split('_');
      const check = new Date(`${y}-${m}-${d}`);
      return check.toDateString() === date.toDateString();
    });
    return matching ? <div className='w-2 h-2 mt-1 bg-primary rounded-full mx-auto'></div> : null;
  };

  useEffect(() => {
    if (token) getUserAppointments();
  }, [token]);

  return (
    <div className='grid md:grid-cols-2 gap-8 py-10 px-4'>
      <div className='border rounded-2xl shadow p-6 bg-white'>
        <h2 className='text-2xl font-bold text-gray-700 mb-4'>🗓 Миний цагийн хуваарь</h2>
        <Calendar
          onChange={setCalendarDate}
          value={calendarDate}
          tileContent={tileContent}
          className='rounded-xl border shadow'
        />
      </div>

      <div>
        <h2 className='text-2xl font-bold text-gray-700 mb-4'>📋 Захиалгын жагсаалт</h2>
        <div className='space-y-6'>
          {appointments.length === 0 && (
            <p className='text-gray-500'>Одоогоор захиалга байхгүй байна.</p>
          )}

          {appointments.map((item, index) => {
            const isPast = isPastAppointment(item.slotDate, item.slotTime);
            return (
              <div key={index} className='flex gap-4 border rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition'>
                <img
                  className='w-24 h-24 object-cover rounded-lg cursor-pointer border'
                  src={item.docData.image}
                  alt={item.docData.name}
                  onClick={() => setSelectedAppointment(item)}
                />
                <div className='flex-1 text-sm'>
                  <p className='font-semibold text-base text-gray-800'>{item.docData.name}</p>
                  <p className='text-gray-500'>{item.docData.speciality}</p>
                  <p className='mt-1'><strong>Хаяг:</strong> {item.docData.address.line1}, {item.docData.address.line2}</p>
                  <p><strong>Цаг:</strong> {slotDateFormat(item.slotDate)} - {item.slotTime}</p>
                  <div className='mt-2 flex flex-wrap gap-2'>
                    {!item.cancelled && !item.payment && !item.isCompleted && !isPast && (
                      <button
                        onClick={() => handleCancelClick(item._id)} // 🌟 шинэ function
                        className='text-xs px-4 py-1 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition'
                      >Цуцлах</button>
                    )}
                    {item.cancelled && <span className='text-red-600 text-xs'>Цуцлагдсан</span>}
                    {item.isCompleted && <span className='text-green-600 text-xs'>Хийгдсэн</span>}
                    {item.payment && !item.isCompleted && <span className='text-blue-600 text-xs'>Төлбөр хийгдсэн</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedAppointment && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-2xl max-w-md w-full text-sm shadow-xl relative'>
            <button
              className='absolute top-2 right-3 text-gray-500 text-xl hover:text-black'
              onClick={() => setSelectedAppointment(null)}
            >×</button>
            <h3 className='text-xl font-bold mb-4'>🧾 Цагийн дэлгэрэнгүй</h3>
            <p><strong>Эмч:</strong> {selectedAppointment.docData.name}</p>
            <p><strong>Мэргэжил:</strong> {selectedAppointment.docData.speciality}</p>
            <p><strong>Огноо:</strong> {slotDateFormat(selectedAppointment.slotDate)}</p>
            <p><strong>Цаг:</strong> {selectedAppointment.slotTime}</p>
            <p><strong>Хаяг:</strong> {selectedAppointment.docData.address.line1}, {selectedAppointment.docData.address.line2}</p>
            <p><strong>Төлөв:</strong> {
              selectedAppointment.cancelled ? 'Цуцлагдсан' :
              selectedAppointment.isCompleted ? 'Хийгдсэн' :
              selectedAppointment.payment ? 'Төлбөр хийгдсэн' : 'Хүлээгдэж байна'
            }</p>
          </div>
        </div>
      )}

      {cancelModalOpen && (
        <CancelModal
          onClose={() => setCancelModalOpen(false)}
          onSubmit={(reason) => {
            cancelAppointmentWithReason(appointmentToCancel, reason);
            setCancelModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default MyAppointments;
