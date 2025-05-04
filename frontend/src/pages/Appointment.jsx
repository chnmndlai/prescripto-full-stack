import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import axios from 'axios';
import { toast } from 'react-toastify';

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctosData } = useContext(AppContext);
  const daysOfWeek = ['Ням', 'Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба'];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  const navigate = useNavigate();

  const fetchDocInfo = () => {
    const doctor = doctors.find((doc) => doc._id === docId);
    setDocInfo(doctor);
  };

  const getAvailableSolts = () => {
    setDocSlots([]);
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      const timeSlots = [];

      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const slotDate = `${currentDate.getDate()}_${currentDate.getMonth() + 1}_${currentDate.getFullYear()}`;
        const isSlotAvailable = !docInfo.slots_booked[slotDate]?.includes(formattedTime);

        if (isSlotAvailable) {
          timeSlots.push({ datetime: new Date(currentDate), time: formattedTime });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlots(prev => [...prev, timeSlots]);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warning('Нэвтрэх шаардлагатай');
      return navigate('/login');
    }

    if (!slotTime) {
      toast.error('Та цаг сонгоно уу.');
      return;
    }

    const date = docSlots[slotIndex][0].datetime;
    const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctosData();
        navigate('/my-appointments');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (doctors.length > 0) fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) getAvailableSolts();
  }, [docInfo]);

  return docInfo ? (
    <div className="px-4">
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg shadow-md' src={docInfo.image} alt={docInfo.name} />
        </div>

        <div className='flex-1 border border-gray-300 rounded-xl p-8 bg-white shadow-md'>
          <p className='flex items-center gap-2 text-3xl font-semibold text-gray-800'>
            {docInfo.name} <img className='w-5' src={assets.verified_icon} alt="Баталгаажсан" />
          </p>
          <div className='flex items-center gap-2 mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full bg-gray-100'>{docInfo.experience}</button>
          </div>

          <div className='mt-3'>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-700'>Тухай <img className='w-3' src={assets.info_icon} alt="Мэдээлэл" /></p>
            <p className='text-sm text-gray-600 mt-1'>{docInfo.about || 'Тайлбар оруулаагүй байна.'}</p>
          </div>

          <p className='text-gray-600 font-medium mt-4'>Зөвлөгөөний үнэ: <span className='text-gray-900 font-bold'>{currencySymbol}{docInfo.fees}</span></p>
        </div>
      </div>

      <div className='sm:ml-72 sm:pl-4 mt-8 font-medium text-gray-700'>
        <p className='text-lg mb-3'>🕒 Захиалгын боломжит цагууд</p>
        <div className='flex gap-3 overflow-x-auto'>
          {docSlots.map((item, index) => (
            <div
              onClick={() => setSlotIndex(index)}
              key={index}
              className={`text-center py-4 px-3 rounded-xl min-w-16 cursor-pointer transition ${slotIndex === index ? 'bg-primary text-white shadow' : 'bg-white border'}`}
            >
              <p className='text-sm'>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
              <p className='text-xl font-semibold'>{item[0] && item[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>

        <div className='flex gap-3 flex-wrap mt-5'>
          {docSlots[slotIndex]?.map((item, index) => (
            <button
              onClick={() => setSlotTime(item.time)}
              key={index}
              className={`px-5 py-2 rounded-full text-sm transition ${item.time === slotTime ? 'bg-primary text-white shadow' : 'border text-gray-600 hover:bg-gray-100'}`}
            >
              {item.time}
            </button>
          ))}
        </div>

        <button
          onClick={bookAppointment}
          className='bg-primary text-white px-10 py-3 mt-6 rounded-full hover:bg-blue-700 transition shadow'
        >
          Цаг захиалах
        </button>
      </div>

      <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
    </div>
  ) : null;
};

export default Appointment;
