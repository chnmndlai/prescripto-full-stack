import React from 'react';
import { motion } from 'framer-motion';
import {
  FaUserMd,
  FaClock,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaEnvelope,
} from 'react-icons/fa';

const DoctorCardModal = ({ doctor, onClose }) => {
  if (!doctor) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="bg-white rounded-2xl p-6 w-[95vw] max-w-md shadow-xl relative text-center"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-xl font-bold"
          aria-label="Close"
        >
          ×
        </button>

        <div className="flex flex-col items-center gap-3">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-24 h-24 object-cover rounded-full border-2 border-primary shadow"
          />
          <h2 className="text-xl font-bold text-gray-800">{doctor.name}</h2>
          <p className="text-sm text-gray-600">{doctor.speciality}</p>
          <p className="text-sm text-gray-500 flex items-center gap-1 justify-center">
            <FaClock className="text-gray-400" /> {doctor.experience} жил туршлагатай
          </p>

          {doctor.about ? (
            <p className="text-gray-600 text-sm">{doctor.about}</p>
          ) : (
            <p className="text-gray-400 text-sm italic">Дэлгэрэнгүй мэдээлэл удахгүй...</p>
          )}

          {doctor.address && (
            <p className="text-gray-500 text-sm flex items-center gap-1 justify-center">
              <FaMapMarkerAlt className="text-primary" /> {doctor.address.line1}, {doctor.address.line2}
            </p>
          )}

          {doctor.email && (
            <a
              href={`mailto:${doctor.email}`}
              className="text-indigo-600 text-sm font-semibold hover:underline mt-2"
            >
              <FaEnvelope className="inline mr-1" /> Имэйл илгээх
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DoctorCardModal;
