import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { FaStar, FaArrowRight, FaRegCommentDots, FaCalendarAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// ——— DoctorCard ———
const DoctorCard = ({ doctor, onDetail }) => {
  return (
    <motion.div
      tabIndex={0}
      whileHover={{
        scale: 1.04,
        boxShadow: "0 8px 32px #8a63d228",
        borderColor: "#8a63d2"
      }}
      whileFocus={{
        scale: 1.04,
        boxShadow: "0 8px 32px #8a63d240",
        borderColor: "#8a63d2"
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`
        group relative bg-white rounded-2xl border-2 border-white shadow-xl
        transition-all duration-300
        flex flex-col items-center px-6 pt-7 pb-4 min-w-[265px] max-w-xs mx-auto
      `}
    >
      {/* Favorite */}
      <button
        className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-pink-100 rounded-full text-gray-400 hover:text-pink-500 shadow transition"
        tabIndex={-1}
        aria-label="Дуртайд нэмэх"
        onClick={e => e.stopPropagation()}
      >
        <svg fill="none" viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M11.998 21c-5.33-4.02-8.003-6.417-8.003-10.016C3.995 7.169 6.17 5 8.992 5c1.489 0 2.985.668 4.008 1.735C14.02 5.668 15.517 5 17.006 5c2.822 0 4.997 2.169 4.997 5.984 0 3.599-2.672 5.996-8.003 10.016z" />
        </svg>
      </button>
      {/* Profile image */}
      <img
        src={doctor.image}
        alt={doctor.name}
        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mb-2"
        style={{ marginTop: "-3rem" }}
      />
      {/* Name */}
      <div className="text-2xl font-extrabold text-center mb-1" style={{ color: "#8a63d2" }}>
        {doctor.name}
      </div>
      {/* Experience */}
      <div className="text-base font-bold text-blue-600 mb-1 text-center leading-5">
        {doctor.experience} жил жил ажилласан
      </div>
      {/* Specialty */}
      <div className="text-gray-500 text-sm mb-1 text-center">{doctor.speciality}</div>
      {/* Description/Position */}
      <div className="text-gray-400 text-xs mb-1 text-center">{doctor.position || doctor.desc}</div>
      {/* Rating */}
      <div className="flex justify-center items-center gap-1 mb-1">
        <FaStar className="text-yellow-400" />
        <span className="font-bold text-lg">{doctor.rating || 4.5}</span>
      </div>
      {/* Action icon-ууд */}
      <div className="flex justify-center gap-6 mt-2 mb-1">
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700 transition text-white shadow focus:outline-none"
          title="Чат эхлүүлэх"
          aria-label="Чат"
          onClick={e => { e.stopPropagation(); onDetail(doctor, "chat"); }}
        >
          <FaRegCommentDots size={20} />
        </button>
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 transition text-white shadow focus:outline-none"
          title="Цаг авах"
          aria-label="Цаг авах"
          onClick={e => { e.stopPropagation(); onDetail(doctor, "appointment"); }}
        >
          <FaCalendarAlt size={20} />
        </button>
      </div>
    </motion.div>
  );
};

// ——— RelatedDoctors ———
const RelatedDoctors = ({ speciality, docId }) => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  const [relDoc, setRelDoc] = useState([]);
  const [modalDoc, setModalDoc] = useState(null);

  useEffect(() => {
    if (doctors && speciality) {
      const filtered = doctors.filter(
        doc => doc.speciality === speciality && doc._id !== docId
      );
      setRelDoc(filtered);
    }
  }, [doctors, speciality, docId]);

  const isLoading = !doctors || doctors.length === 0;
  const placeholderCount = 3;

  // doctor action handler
  const handleDetail = (doc, action) => {
    if (action === "chat") {
      // chat modal эсвэл chat page-руу navigate хийж болно
      return;
    }
    if (action === "appointment") {
      navigate(`/appointment/${doc._id}`);
      return;
    }
    setModalDoc(doc);
  };

  return (
    <section aria-labelledby="related-doctors-heading" className="my-16 px-4">
      <div className="flex items-center justify-between mb-4">
        <h2 id="related-doctors-heading" className="text-3xl font-semibold text-gray-900">
          Холбоотой эмч нар
        </h2>
        {!isLoading && relDoc.length > 0 && (
          <button
            onClick={() => navigate(`/doctors?speciality=${encodeURIComponent(speciality)}`)}
            className="text-sm text-primary flex items-center gap-1 hover:underline"
          >
            Бүгд харах <FaArrowRight size={12} />
          </button>
        )}
      </div>
      <p className="text-center text-sm text-gray-600 sm:w-1/2 mx-auto">
        Таны сонгосон чиглэлээр мэргэшсэн бусад эмч нар.
      </p>

      <div className="mt-6">
        {isLoading ? (
          <div className="flex flex-wrap gap-6 justify-center">
            {Array.from({ length: placeholderCount }).map((_, idx) => (
              <div key={idx} className="animate-pulse w-72 h-80 bg-white rounded-2xl" />
            ))}
          </div>
        ) : relDoc.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center">
            {relDoc.map((doc, idx) => (
              <DoctorCard key={doc._id || idx} doctor={doc} onDetail={handleDetail} />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-center text-gray-500">
            Тухайн чиглэлээр бусад эмч бүртгэгдээгүй байна.
          </p>
        )}
      </div>
      {/* Modal — дэлгэрэнгүй info хийх бол энд нэмээрэй */}
      {/* {modalDoc && <DoctorModal doctor={modalDoc} onClose={() => setModalDoc(null)} />} */}
    </section>
  );
};

export default RelatedDoctors;
