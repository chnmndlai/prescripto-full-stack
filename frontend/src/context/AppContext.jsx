import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios';

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = '';
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [dToken, setDToken] = useState(localStorage.getItem('dToken') || '');
  const [userData, setUserData] = useState(false);

  const [savedAdvice, setSavedAdvice] = useState([]); // ✅ хадгалсан зөвлөгөө

  // ✅ Зөвлөгөө ачаалах
  const fetchSavedAdvice = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: { token },
      });
      if (res.data.success) {
        setSavedAdvice(res.data.userData.savedAdvice || []);
      }
    } catch (err) {
      console.error("Хадгалсан зөвлөгөө ачаалахад алдаа гарлаа", err);
    }
  };

  // ✅ Зөвлөгөө хадгалах / устгах
  const toggleSaveAdvice = async (adviceId) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/user/toggle-save-advice`,
        { adviceId },
        { headers: { token } }
      );

      if (res.data.success) {
        setSavedAdvice((prev) =>
          res.data.saved
            ? [...prev, adviceId]
            : prev.filter((id) => id !== adviceId)
        );
      }
    } catch (err) {
      console.error("Зөвлөгөө хадгалах үед алдаа гарлаа", err);
    }
  };

  // ✅ Эмчийн жагсаалт татах
  const getDoctosData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/list');
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // ✅ Хэрэглэгчийн мэдээлэл ачаалах
  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/get-profile', {
        headers: { token },
      });

      if (data.success) {
        setUserData(data.userData);
        setSavedAdvice(data.userData.savedAdvice || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getDoctosData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    }
  }, [token]);

  const value = {
    doctors,
    getDoctosData,
    currencySymbol,
    backendUrl,
    token,
    setToken,
    dToken,
    setDToken,
    userData,
    setUserData,
    loadUserProfileData,
    savedAdvice,
    setSavedAdvice,
    toggleSaveAdvice,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
