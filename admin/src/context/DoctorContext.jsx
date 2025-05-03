import { createContext, useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [dToken, setDToken] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);

  // ⛳️ 1. LocalStorage-оос TOKEN сэргээх
  useEffect(() => {
    const token = localStorage.getItem("dToken");
    if (token) {
      setDToken(token);
    }
  }, []);

  // ⛳️ 2. Захиалгууд авах
  const getAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
        headers: { Authorization: `Bearer ${dToken}` },
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message || 'Захиалга авахад алдаа гарлаа');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Сервертэй холбогдох үед алдаа гарлаа');
    }
  };

  // ⛳️ 3. Профайл мэдээлэл авах
  const getProfileData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, {
        headers: { Authorization: `Bearer ${dToken}` },
      });

      if (data.success) {
        setProfileData(data.doctor);
      } else {
        toast.error(data.message || 'Профайл мэдээлэл авахад алдаа гарлаа');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Профайл мэдээлэл авах үед алдаа гарлаа');
    }
  };

  // ⛳️ 4. Захиалга цуцлах
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/doctor/cancel-appointment`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${dToken}` } }
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
        getDashData();
      } else {
        toast.error(data.message || 'Захиалга цуцлахад алдаа гарлаа');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Сервертэй холбогдох үед алдаа гарлаа');
    }
  };

  // ⛳️ 5. Захиалгыг дуусгавар болгох
  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/doctor/complete-appointment`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${dToken}` } }
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
        getDashData();
      } else {
        toast.error(data.message || 'Захиалга дуусгах үед алдаа гарлаа');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Сервертэй холбогдох үед алдаа гарлаа');
    }
  };

  // ⛳️ 6. Хяналтын самбарын дата авах
  const getDashData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`, {
        headers: { Authorization: `Bearer ${dToken}` },
      });

      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message || 'Хяналтын самбарын мэдээлэл авахад алдаа гарлаа');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Сервертэй холбогдох үед алдаа гарлаа');
    }
  };

  const value = {
    dToken, setDToken,
    backendUrl,
    appointments, getAppointments,
    cancelAppointment,
    completeAppointment,
    dashData, getDashData,
    profileData, setProfileData, getProfileData,
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
