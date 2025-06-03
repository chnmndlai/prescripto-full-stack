import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import RelatedDoctors from '../components/RelatedDoctors';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  FaCalendarAlt,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaLock,
  FaTimesCircle,
  FaCheckCircle,
  FaUserMd,
  FaMoneyBillWave,
  FaUserEdit,
  FaStickyNote
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const DAY_PARTS = [
  { key: 'morning',  label: 'Өглөө', icon: <FaClock className="inline mb-1 mr-1" />, range: [10, 13], emoji: '☀️' },
  { key: 'day',      label: 'Өдөр',  icon: <FaClock className="inline mb-1 mr-1" />, range: [13, 17], emoji: '🌤️' },
  { key: 'evening',  label: 'Орой',  icon: <FaClock className="inline mb-1 mr-1" />, range: [17, 20], emoji: '🌙' },
];

export default function Appointment() {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { doctors, currencySymbol, backendUrl, token, getDoctosData } = useContext(AppContext);

  const [docInfo, setDocInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedDayOffset, setSelectedDayOffset] = useState(0);
  const [dayPart, setDayPart] = useState('morning');
  const [selectedTime, setSelectedTime] = useState('');
  const [note, setNote] = useState('');
  const [slotsByPart, setSlotsByPart] = useState({ morning: [], day: [], evening: [] });
  const [noteCount, setNoteCount] = useState(0);

  const stickyRef = useRef(null);

  // Doc info fetch
  useEffect(() => {
    if (!doctors.length) return;
    const doc = doctors.find(d => d._id === docId);
    setDocInfo(doc);
    setLoading(false);
  }, [doctors, docId]);

  // Slots calc
  useEffect(() => {
    if (!docInfo) return;
    const now = new Date();
    const day = new Date(now);
    day.setDate(now.getDate() + selectedDayOffset);

    const key = `${day.getDate()}_${day.getMonth() + 1}_${day.getFullYear()}`;
    const booked = docInfo.slots_booked?.[key] || [];

    // Slot gen
    const all = [];
    let cur = new Date(day.setHours(10, 0, 0, 0));
    const end = new Date(day.setHours(20, 0, 0, 0));
    while (cur <= end) {
      const t = cur.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      all.push({
        time: t,
        past: cur < new Date(),
        booked: booked.includes(t),
        date: new Date(cur)
      });
      cur = new Date(cur.getTime() + 30 * 60000);
    }

    // Group by range
    const grouped = {};
    DAY_PARTS.forEach(p => {
      grouped[p.key] = all.filter(s => {
        const h = s.date.getHours();
        return h >= p.range[0] && h < p.range[1];
      });
    });

    setSlotsByPart(grouped);
    setSelectedTime('');
  }, [docInfo, selectedDayOffset]);

  // Book
  const handleBook = async () => {
    if (!token) { toast.info('Нэвтрэх шаардлагатай'); return navigate('/login'); }
    if (!selectedTime) { toast.error('Цаг сонгоно уу'); return; }

    const day = new Date(); day.setDate(day.getDate() + selectedDayOffset);
    const key = `${day.getDate()}_${day.getMonth() + 1}_${day.getFullYear()}`;

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate: key, slotTime: selectedTime, note },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getDoctosData();
        navigate('/my-appointments');
      } else toast.error(data.message);
    } catch {
      toast.error('Алдаа гарлаа');
    }
  };

  if (loading) return <div className="py-20 text-center text-gray-500 animate-pulse">Loading…</div>;
  if (!docInfo) return <div className="py-20 text-center text-red-500">Эмч олдсонгүй</div>;

  // Date stuff
  const today = new Date();
  const chosenDate = new Date(today.setDate(today.getDate() + selectedDayOffset));
  const weekday = chosenDate.toLocaleDateString('mn-MN', { weekday: 'short' });
  const daynum = chosenDate.getDate();

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* Doctor Info */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 gap-8 items-center"
      >
        <motion.div
          className="relative flex-shrink-0 group"
          whileHover={{ scale: 1.04 }}
        >
          <img
            src={docInfo.image}
            alt={docInfo.name}
            className="w-28 h-28 object-cover rounded-full border-4 border-primary shadow-lg"
          />
          {/* Animated glow ring */}
          <span className="absolute inset-0 rounded-full pointer-events-none group-hover:animate-pulse-glow border-2 border-primary/40" />
        </motion.div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full font-bold text-lg">
              <FaUserMd className="mr-2" /> {docInfo.name}
            </span>
            <span className="ml-2 bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full">
              <FaUserEdit className="mr-1 inline" /> {docInfo.speciality}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className="inline-flex items-center text-xs px-2 py-1 bg-gray-100 rounded-full">
              <FaClock className="mr-1" /> {docInfo.experience} жил
            </span>
            <span className="inline-flex items-center text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
              <FaMoneyBillWave className="mr-1" /> {currencySymbol}{docInfo.fees}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{docInfo.about || 'Тайлбар олдсонгүй'}</p>
        </div>
      </motion.div>

      {/* Day Selector */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.07, duration: 0.35 }}
        className="flex items-center justify-between sticky top-2 z-30 bg-white/90 dark:bg-gray-900/90 rounded-2xl px-2 py-2 shadow"
      >
        <FaCalendarAlt className="text-xl text-primary" />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedDayOffset(d => Math.max(d - 1, 0))}
            disabled={selectedDayOffset === 0}
            className="p-2 hover:bg-primary/10 rounded-full disabled:opacity-30 transition"
            aria-label="Өмнөх өдөр"
          >
            <FaChevronLeft />
          </button>

          <select
            value={selectedDayOffset}
            onChange={e => setSelectedDayOffset(+e.target.value)}
            className="px-4 py-2 rounded-full border border-gray-200 focus:ring-2 focus:ring-primary"
            aria-label="Өдөр сонгох"
          >
            {Array.from({ length: 7 }).map((_, i) => {
              const d = new Date(); d.setDate(d.getDate() + i);
              const wd = d.toLocaleDateString('mn-MN', { weekday: 'short' });
              const dn = d.getDate();
              return (
                <option key={i} value={i} className={i === 0 ? "font-bold bg-primary/20" : ""}>
                  {i === 0 ? "Өнөөдөр" : `${wd} ${dn}`}
                </option>
              );
            })}
          </select>

          <button
            onClick={() => setSelectedDayOffset(d => Math.min(d + 1, 6))}
            disabled={selectedDayOffset === 6}
            className="p-2 hover:bg-primary/10 rounded-full disabled:opacity-30 transition"
            aria-label="Дараагийн өдөр"
          >
            <FaChevronRight />
          </button>
        </div>
      </motion.div>

      {/* Day Parts Tabs */}
      <div className="flex flex-wrap justify-center gap-4 my-2">
        {DAY_PARTS.map((p, i) => (
          <motion.button
            key={p.key}
            onClick={() => setDayPart(p.key)}
            whileHover={{ scale: 1.05, boxShadow: '0 2px 10px #8a63d233' }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className={`
              flex items-center gap-2 px-5 py-2 rounded-full font-semibold transition
              ${dayPart === p.key
                ? 'bg-gradient-to-r from-primary to-indigo-500 text-white shadow-lg'
                : 'bg-gray-50 hover:bg-primary/10 text-gray-700'}
            `}
            aria-label={p.label}
          >
            <span>{p.icon}</span>
            {p.label} <span>{p.emoji}</span>
          </motion.button>
        ))}
      </div>

      {/* Slots Grid */}
      <motion.div
        className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.06 } },
          hidden: {},
        }}
      >
        <AnimatePresence>
          {slotsByPart[dayPart]?.length
            ? slotsByPart[dayPart].map((slot, idx) => (
              <motion.button
                key={slot.time}
                whileHover={!slot.past && !slot.booked ? { scale: 1.06 } : {}}
                whileTap={!slot.past && !slot.booked ? { scale: 0.96 } : {}}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 18 }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => !slot.past && !slot.booked && setSelectedTime(slot.time)}
                tabIndex={slot.past || slot.booked ? -1 : 0}
                aria-label={`Цаг ${slot.time}`}
                className={`
                  flex flex-col items-center py-3 rounded-xl border transition relative focus:ring-2 focus:ring-primary
                  ${
                    slot.past
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : slot.booked
                        ? 'bg-red-100 text-red-400 cursor-not-allowed'
                        : slot.time === selectedTime
                          ? 'border-2 border-primary bg-gradient-to-tr from-primary/10 to-indigo-100 shadow-lg scale-105'
                          : 'bg-white hover:bg-primary/10 text-gray-800'
                  }
                `}
              >
                <span className="font-bold text-lg">{slot.time}</span>
                {slot.past && <FaLock className="text-xl absolute right-3 top-3 text-gray-300" aria-hidden />}
                {slot.booked && <FaTimesCircle className="text-xl absolute right-3 top-3 text-red-300" aria-hidden />}
                {slot.time === selectedTime && (
                  <FaCheckCircle className="text-xl absolute right-3 top-3 text-primary animate-bounce" aria-label="Сонгогдсон" />
                )}
              </motion.button>
            ))
            : (
              <motion.div
                className="col-span-full flex flex-col items-center justify-center text-gray-400 py-8"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <FaClock size={48} />
                <div className="mt-2">Чөлөөтэй цаг байхгүй байна</div>
              </motion.div>
            )
          }
        </AnimatePresence>
      </motion.div>

      {/* Sticky Summary */}
      <AnimatePresence>
        {selectedTime && (
          <motion.div
            ref={stickyRef}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 shadow-2xl rounded-2xl px-8 py-4 flex flex-col sm:flex-row items-center gap-4 z-50 border border-primary/30"
            style={{ boxShadow: "0 8px 36px 8px #867ae31a" }}
          >
            <div className="flex-1 flex flex-col items-center sm:items-start">
              <p className="text-xs text-gray-500">Сонгосон:</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="inline-flex items-center bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-sm">
                  <FaCalendarAlt className="mr-1" />
                  {weekday} {daynum}
                </span>
                <span className="inline-flex items-center bg-indigo-100 text-indigo-700 font-semibold px-3 py-1 rounded-full text-sm">
                  <FaClock className="mr-1" />
                  {selectedTime}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedTime('')}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-semibold"
              >Болих</button>
              <button
                onClick={handleBook}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-full font-bold shadow"
              >Цаг захиалах</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Note */}
      <div className="mt-6 relative">
        <label className="block mb-2 font-semibold text-gray-700 flex items-center gap-2">
          <FaStickyNote className="text-primary" /> Нэмэлт мэдээлэл <span className="text-xs ml-1 text-gray-400">({note.length}/240)</span>
        </label>
        <textarea
          value={note}
          onChange={e => {
            setNote(e.target.value.slice(0, 240));
            setNoteCount(e.target.value.length);
          }}
          rows={3}
          placeholder="📝 Таны асуулт, эмчид хэлэх зүйл, бусад..."
          className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-primary bg-gray-50 dark:bg-gray-800 resize-none"
          maxLength={240}
        />
      </div>

      {/* Related Doctors */}
      <RelatedDoctors speciality={docInfo.speciality} docId={docId} />

      {/* Pulse/Glow Animation for doctor */}
      <style>{`
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 0 0 #8a63d24c;}
          70% { box-shadow: 0 0 0 16px #8a63d206;}
          100% { box-shadow: 0 0 0 0 #8a63d24c;}
        }
        .group-hover\\:animate-pulse-glow:hover {
          animation: pulse-glow 1.3s infinite;
        }
      `}</style>
    </div>
  );
}
