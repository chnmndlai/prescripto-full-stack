import { createContext, useState, useEffect } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'

export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const [dToken, setDToken] = useState('');
  const [appointments, setAppointments] = useState([])
  const [dashData, setDashData] = useState(false)
  const [profileData, setProfileData] = useState(false)

  // ⛳️ 1. TOKEN-ыг localStorage-оос сэргээх
  useEffect(() => {
    const token = localStorage.getItem("dToken");
    if (token) {
      setDToken(token);
    }
  }, []);

  // ⛳️ 2. APPOINTMENTS
  const getAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/appointments', {
        headers: { Authorization: `Bearer ${dToken}` }
      })

      if (data.success) {
        setAppointments(data.appointments.reverse())
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  // ⛳️ 3. PROFILE
  const getProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/profile', {
        headers: { Authorization: `Bearer ${dToken}` }
      })
      setProfileData(data.profileData)

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  // ⛳️ 4. CANCEL APPOINTMENT
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/doctor/cancel-appointment',
        { appointmentId },
        { headers: { Authorization: `Bearer ${dToken}` } })

      if (data.success) {
        toast.success(data.message)
        getAppointments()
        getDashData()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  }

  // ⛳️ 5. COMPLETE APPOINTMENT
  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/doctor/complete-appointment',
        { appointmentId },
        { headers: { Authorization: `Bearer ${dToken}` } })

      if (data.success) {
        toast.success(data.message)
        getAppointments()
        getDashData()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  }

  // ⛳️ 6. DASHBOARD
  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', {
        headers: { Authorization: `Bearer ${dToken}` }
      })

      if (data.success) {
        setDashData(data.dashData)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const value = {
    dToken, setDToken, backendUrl,
    appointments, getAppointments,
    cancelAppointment,
    completeAppointment,
    dashData, getDashData,
    profileData, setProfileData, getProfileData,
  }

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  )
}

export default DoctorContextProvider;
