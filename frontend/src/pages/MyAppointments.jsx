import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const MyAppointments = () => {
  const { backendUrl, token } = useContext(AppContext);
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [payment, setPayment] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());

  const months = ["1-р сар", "2-р сар", "3-р сар", "4-р сар", "5-р сар", "6-р сар", "7-р сар", "8-р сар", "9-р сар", "10-р сар", "11-р сар", "12-р сар"];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_');
    return dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2];
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } });
      setAppointments(data.appointments.reverse());
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/cancel-appointment',
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Цаг захиалгын төлбөр',
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(backendUrl + "/api/user/verifyRazorpay", response, { headers: { token } });
          if (data.success) {
            navigate('/my-appointments');
            getUserAppointments();
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } });
      if (data.success) {
        initPay(data.order);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const appointmentStripe = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/payment-stripe', { appointmentId }, { headers: { token } });
      if (data.success) {
        const { session_url } = data;
        window.location.replace(session_url);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
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
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <div className="flex items-center justify-between mt-12 pb-3 border-b">
        <p className='text-lg font-medium text-gray-600'>Миний цаг захиалгууд</p>
      </div>

      <div className='my-8 max-w-md'>
        <Calendar
          onChange={setCalendarDate}
          value={calendarDate}
          tileContent={tileContent}
          className='rounded-xl border shadow'
        />
      </div>

      <div>
        {appointments.map((item, index) => {
          const isPast = isPastAppointment(item.slotDate, item.slotTime);
          return (
            <div key={index} className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b'>
              <div>
                <img
                  className='w-36 bg-[#EAEFFF] rounded-lg cursor-pointer'
                  src={item.docData.image}
                  alt={item.docData.name}
                  onClick={() => setSelectedAppointment(item)}
                />
              </div>
              <div className='flex-1 text-sm text-[#5E5E5E]'>
                <p className='text-[#262626] text-base font-semibold'>{item.docData.name}</p>
                <p>{item.docData.speciality}</p>
                <p className='text-[#464646] font-medium mt-1'>Хаяг:</p>
                <p>{item.docData.address.line1}</p>
                <p>{item.docData.address.line2}</p>
                <p className='mt-1'><span className='text-sm text-[#3C3C3C] font-medium'>Огноо ба цаг:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}</p>
              </div>
              <div className='flex flex-col gap-2 justify-end text-sm text-center'>
                {!item.cancelled && !item.payment && !item.isCompleted && !isPast && payment !== item._id && (
                  <button
                    onClick={() => setPayment(item._id)}
                    className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'
                  >
                    Онлайн төлбөр хийх
                  </button>
                )}
                {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && (
                  <>
                    <button
                      onClick={() => appointmentStripe(item._id)}
                      className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center'
                    >
                      <img className='max-w-20 max-h-5' src={assets.stripe_logo} alt="Stripe" />
                    </button>
                    <button
                      onClick={() => appointmentRazorpay(item._id)}
                      className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center'
                    >
                      <img className='max-w-20 max-h-5' src={assets.razorpay_logo} alt="Razorpay" />
                    </button>
                  </>
                )}
                {!item.cancelled && item.payment && !item.isCompleted && (
                  <button className='sm:min-w-48 py-2 border rounded text-[#696969] bg-[#EAEFFF]'>Төлбөр хийгдсэн</button>
                )}
                {item.isCompleted && (
                  <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Хийгдсэн</button>
                )}
                {!item.cancelled && !item.isCompleted && !isPast && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'
                  >
                    Цаг цуцлах
                  </button>
                )}
                {item.cancelled && !item.isCompleted && (
                  <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Цуцлагдсан</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedAppointment && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-xl max-w-md w-full text-sm shadow-xl relative'>
            <button
              className='absolute top-2 right-3 text-gray-500 text-xl hover:text-black'
              onClick={() => setSelectedAppointment(null)}
            >
              ×
            </button>
            <h3 className='text-xl font-bold mb-2'>Цагийн дэлгэрэнгүй</h3>
            <p><strong>Эмч:</strong> {selectedAppointment.docData.name}</p>
            <p><strong>Мэргэжил:</strong> {selectedAppointment.docData.speciality}</p>
            <p><strong>Огноо:</strong> {slotDateFormat(selectedAppointment.slotDate)}</p>
            <p><strong>Цаг:</strong> {selectedAppointment.slotTime}</p>
            <p><strong>Хаяг:</strong> {selectedAppointment.docData.address.line1}, {selectedAppointment.docData.address.line2}</p>
            <p><strong>Төлөв:</strong> {selectedAppointment.cancelled ? 'Цуцлагдсан' : selectedAppointment.isCompleted ? 'Хийгдсэн' : selectedAppointment.payment ? 'Төлбөр хийгдсэн' : 'Хүлээгдэж байна'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;