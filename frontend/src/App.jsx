import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

// Pages
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import Appointment from './pages/Appointment';
import MyAppointments from './pages/MyAppointments';
import MyProfile from './pages/MyProfile';
import Verify from './pages/Verify';
import Advice from './pages/Advice';
import AdviceDetail from './pages/AdviceDetail';
import QuizList from './pages/QuizList';
import QuizDetail from './pages/QuizDetail';
import DiabetesQuiz from './pages/DiabetesQuiz';

const Home = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-center mt-10">Prescripto Chatbot</h1>
      <Chatbot />
    </div>
  );
};

const App = () => {
  const [showChat, setShowChat] = useState(false); // Popup chatbot toggle

  return (
    <div className='relative mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Navbar setShowChat={setShowChat} />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/verify' element={<Verify />} />
        <Route path='/advice' element={<Advice />} />
        <Route path='/advice/:id' element={<AdviceDetail />} />
        <Route path='/quiz' element={<QuizList />} />
        <Route path='/quiz/:id' element={<QuizDetail />} />
        <Route path='/quiz/diabetes' element={<DiabetesQuiz />} />
        <Route path='/chatbot' element={<Chatbot />} /> {/* Standalone chatbot page */}
      </Routes>

      {/* Popup chatbot floating */}
      {showChat && (
        <div className="fixed bottom-20 right-6 z-50 shadow-lg">
          <Chatbot onClose={() => setShowChat(false)} />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default App;
