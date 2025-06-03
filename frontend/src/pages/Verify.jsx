import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const successParam = searchParams.get("success");
  const appointmentId = searchParams.get("appointmentId");

  const { backendUrl, token } = useContext(AppContext);
  const navigate = useNavigate();

  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(5);

  // Stripe verify
  const verifyStripe = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/verifyStripe`,
        { success: successParam, appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        setStatus('success');
        setMessage(data.message || 'Төлбөр амжилттай баталгаажлаа.');
      } else {
        setStatus('error');
        setMessage(data.message || 'Төлбөр баталгаажаагүй. Дахин оролдоно уу.');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage('Алдаа гарлаа: ' + (error.message || 'Сервертэй холбогдож чадсангүй'));
    }
  };

  // On mount, trigger verify
  useEffect(() => {
    if (token && appointmentId != null && successParam != null) {
      verifyStripe();
    } else {
      setStatus('error');
      setMessage('Харамсалтай нь шаардлагатай мэдээлэл алдсан байна.');
    }
  }, [token, appointmentId, successParam]);

  // Auto-redirect countdown on success
  useEffect(() => {
    if (status === 'success') {
      const timer = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) {
            clearInterval(timer);
            navigate('/my-appointments');
          }
          return c - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status, navigate]);

  // Retry handler
  const handleRetry = () => {
    setStatus('loading');
    setMessage('');
    verifyStripe();
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      {status === 'loading' && (
        <>
          <div
            className="w-16 h-16 border-4 border-gray-300 border-t-primary rounded-full animate-spin"
            role="status"
            aria-label="Төлбөрийн төлөв шалгаж байна"
          />
          <p className="mt-4 text-sm text-gray-600">Таны төлбөр шалгагдаж байна... Түр хүлээнэ үү.</p>
        </>
      )}

      {status === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center shadow-md max-w-sm">
          <FaCheckCircle className="mx-auto text-green-500 text-4xl" aria-hidden />
          <h2 className="mt-4 text-xl font-semibold text-green-700">Амжилттай</h2>
          <p className="mt-2 text-green-600">{message}</p>
          <p className="mt-4 text-sm text-gray-500">📄 {countdown} секундийн дараа автоматаар шилжинэ...</p>
          <button
            onClick={() => navigate('/my-appointments')}
            className="mt-4 px-5 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition"
            aria-label="Миний цагууд руу явах"
          >
            Одоо очих
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center shadow-md max-w-sm">
          <FaTimesCircle className="mx-auto text-red-500 text-4xl" aria-hidden />
          <h2 className="mt-4 text-xl font-semibold text-red-700">Алдаа гарлаа</h2>
          <p className="mt-2 text-red-600">{message}</p>
          <div className="mt-6 flex gap-4 justify-center">
            <button
              onClick={handleRetry}
              className="px-5 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
              aria-label="Дахин шалгах"
            >
              Дахин оролдох
            </button>
            <button
              onClick={() => navigate('/my-appointments')}
              className="px-5 py-2 border border-red-500 text-red-500 rounded-full hover:bg-red-100 transition"
              aria-label="Буцах"
            >
              Буцах
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Verify;
