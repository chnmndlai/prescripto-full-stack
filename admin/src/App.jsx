import React, { useContext } from 'react';
import { DoctorContext } from './context/DoctorContext';
import { AdminContext } from './context/AdminContext';
import { Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';

import AdviceList from './pages/Admin/AdviceList';
import EditAdvice from './pages/Admin/EditAdvice';

import Login from './pages/Login';

import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import DoctorAdvice from './pages/Doctor/DoctorAdvice';
import DoctorQuizResults from './pages/Doctor/DoctorQuizResults';
import AddAdvice from './pages/Doctor/DoctorAdvice';
import AddQuiz from './pages/Doctor/AddQuiz';
import QuizList from './pages/Doctor/QuizList'; // ✅ Алдаатай байсан хэсэг — заавал нэмэх
import QuizDetail from './pages/Doctor/QuizDetail'; // 🆕
import EditQuiz from './pages/Doctor/EditQuiz'; // ✅ Шинээр нэмэх import
const App = () => {
  const { dToken } = useContext(DoctorContext);
  const { aToken } = useContext(AdminContext);

  return dToken || aToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          <Route
            path="/"
            element={
              dToken ? (
                <Navigate to="/doctor-dashboard" replace />
              ) : (
                <Navigate to="/admin-dashboard" replace />
              )
            }
          />

          {/* Admin routes */}
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/add-doctor' element={<AddDoctor />} />
          <Route path='/doctor-list' element={<DoctorsList />} />
          <Route path='/admin/advice-list' element={<AdviceList />} />
          <Route path='/admin/edit-advice/:id' element={<EditAdvice />} />

          {/* Doctor routes */}
          <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
          <Route path='/doctor-appointments' element={<DoctorAppointments />} />
          <Route path='/doctor-profile' element={<DoctorProfile />} />
          <Route path='/doctor-advice' element={<DoctorAdvice />} />
          <Route path='/doctor/add-advice' element={<AddAdvice />} />
          <Route path='/doctor/add-quiz' element={<AddQuiz />} />
          <Route path='/doctor/quizzes' element={<QuizList />} /> {/* ✅ Миний тестүүд */}
          <Route path='/doctor/quiz/:id' element={<QuizDetail />} />
          <Route path='/doctor/edit-quiz/:id' element={<EditQuiz />} /> // ✅ Route нэмэх

          <Route path='/doctor/quiz-results' element={<DoctorQuizResults />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <ToastContainer />
      <Login />
    </>
  );
};

export default App;
