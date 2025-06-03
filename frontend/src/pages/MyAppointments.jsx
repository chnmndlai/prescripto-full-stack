// frontend/src/pages/MyAppointments.jsx
import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CancelModal from '../components/CancelModal';
import {
  FaClock, FaStar, FaTimesCircle, FaCalendarAlt, FaEnvelope, FaComments, FaUserMd, FaCheckCircle, FaPlusCircle, FaCloudDownloadAlt, FaChevronLeft, FaChevronRight,
} from "react-icons/fa";

const TIME_SECTIONS = [
  { label: '☀️ Өглөө', range: [10, 13] },
  { label: '🌤️ Өдөр', range: [13, 17] },
  { label: '🌙 Орой', range: [17, 21] },
];
const WEEKENDS = [0, 6]; // Sunday, Saturday

const months = [
  '1-р сар', '2-р сар', '3-р сар', '4-р сар', '5-р сар', '6-р сар',
  '7-р сар', '8-р сар', '9-р сар', '10-р сар', '11-р сар', '12-р сар'
];

const slotDateFormat = (slotDate) => {
  const [d, m, y] = slotDate.split('_');
  return `${d} ${months[+m - 1]} ${y}`;
};

const isToday = (date) => {
  const t = new Date();
  return date.toDateString() === t.toDateString();
};
const isTomorrow = (date) => {
  const t = new Date();
  const tomorrow = new Date(t.setDate(t.getDate() + 1));
  return date.toDateString() === tomorrow.toDateString();
};
const isWeekend = (date) => WEEKENDS.includes(date.getDay());

const MyAppointments = () => {
  const { backendUrl, token } = useContext(AppContext);
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  const [selectedDetail, setSelectedDetail] = useState(null);
  const [showPast, setShowPast] = useState(false);

  // Захиалгууд татаж авах
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/appointments`,
        { headers: { token } }
      );
      setAppointments(data.appointments.reverse());
    } catch {
      toast.error('Захиалга татахад алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAppointments();
  }, [token]);

  // Өмнөх эсэх шалгах
  const isPast = (slotDate, slotTime) => {
    const [d, m, y] = slotDate.split('_');
    return new Date() > new Date(`${y}-${m}-${d} ${slotTime}`);
  };

  // Calendar color
  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return '';
    if (isToday(date)) return 'bg-primary text-white font-bold rounded-full';
    if (isTomorrow(date)) return 'bg-green-200 text-green-700 rounded-full font-semibold';
    if (isWeekend(date)) return 'bg-yellow-100 text-yellow-700 font-semibold';
    if (date < new Date()) return 'text-gray-400';
    return '';
  };

  // Захиалгатай өдөр badge
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const has = appointments.some(a => {
      const [d, m, y] = a.slotDate.split('_');
      return new Date(+y, +m - 1, +d).toDateString() === date.toDateString();
    });
    return has ? <div className="w-2 h-2 bg-red-500 rounded-full mx-auto mt-1" /> : null;
  };

  // Сонгосон өдрийн appointment
  const daily = useMemo(() => {
    const sel = calendarDate.toDateString();
    return appointments.filter(a => {
      const [d, m, y] = a.slotDate.split('_');
      return new Date(+y, +m - 1, +d).toDateString() === sel;
    });
  }, [appointments, calendarDate]);

  // Цуцлах
  const openCancel = (id) => {
    setAppointmentToCancel(id);
    setCancelModalOpen(true);
  };
  const doCancel = async (reason) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId: appointmentToCancel, reason },
        { headers: { token } }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      if (data.success) fetchAppointments();
    } catch {
      toast.error('Цуцлахад алдаа гарлаа');
    } finally {
      setCancelModalOpen(false);
    }
  };

  // Past/hide show filter
  const filteredDaily = daily.filter(a => showPast || !isPast(a.slotDate, a.slotTime));

  return (
    <div className="grid md:grid-cols-2 gap-8 py-10 px-4 max-w-6xl mx-auto">
      {/* Calendar + new appointment */}
      <div className="border rounded-2xl shadow p-6 bg-white relative">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center gap-2">
          <FaCalendarAlt className="text-primary" /> Миний цагийн хуваарь
        </h2>
        <button
          className="absolute top-5 right-8 flex items-center gap-2 text-primary bg-primary/10 hover:bg-primary/20 font-semibold rounded-full px-4 py-2 transition"
          onClick={() => navigate('/doctors')}
        >
          <FaPlusCircle /> Шинэ захиалга
        </button>
        {loading
          ? <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
          : <Calendar
            onChange={setCalendarDate}
            value={calendarDate}
            tileClassName={tileClassName}
            tileContent={tileContent}
            prevLabel={<FaChevronLeft />}
            nextLabel={<FaChevronRight />}
            className="rounded-xl border shadow w-full"
          />
        }
        <div className="flex items-center gap-3 mt-4">
          <span className="inline-flex items-center text-xs bg-primary text-white px-2 rounded-full"><FaCalendarAlt className="mr-1" />Өнөөдөр</span>
          <span className="inline-flex items-center text-xs bg-green-200 text-green-700 px-2 rounded-full">Маргааш</span>
          <span className="inline-flex items-center text-xs bg-yellow-100 text-yellow-700 px-2 rounded-full">Амралтын өдөр</span>
        </div>
      </div>

      {/* List & Sections */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-700 flex items-center gap-2">
            <FaClipboardList className="text-primary" /> Захиалгын жагсаалт
          </h2>
          <button
            onClick={() => setShowPast(!showPast)}
            className="text-xs rounded-full border px-3 py-1 hover:bg-gray-100 transition"
          >
            {showPast ? "Бүх захиалга" : "Өнгөрсөн захиалга харуулах"}
          </button>
        </div>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl mb-4 animate-pulse" />
          ))
        ) : filteredDaily.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <FaCalendarAlt className="text-4xl mb-4" />
            <div className="mb-2">Тухайн өдөр захиалга байхгүй байна.</div>
            <button
              onClick={() => navigate('/doctors')}
              className="bg-primary text-white px-5 py-2 rounded-full hover:bg-primary-dark mt-4 flex items-center gap-2"
            >
              <FaPlusCircle /> Шинэ захиалга үүсгэх
            </button>
          </div>
        ) : (
          TIME_SECTIONS.map(sec => {
            const list = filteredDaily.filter(a => {
              const hour = +a.slotTime.split(':')[0];
              return hour >= sec.range[0] && hour < sec.range[1];
            });
            if (!list.length) return null;
            return (
              <div key={sec.label} className="mb-6">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">{sec.label}</h3>
                {list.map(item => {
                  const past = isPast(item.slotDate, item.slotTime);
                  return (
                    <div
                      key={item._id}
                      className={`flex gap-4 items-center border rounded-xl p-4 mb-3 shadow-sm transition
                        ${item.cancelled
                          ? "bg-red-50 opacity-70"
                          : past
                            ? "bg-gray-50 opacity-70"
                            : "bg-white hover:shadow-md"
                        }`}
                    >
                      <img
                        src={item.docData.image}
                        alt={item.docData.name}
                        className="w-16 h-16 object-cover rounded-full cursor-pointer border-2 border-primary/20 shadow-sm"
                        onClick={() => setSelectedDetail(item)}
                      />
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 items-center mb-1">
                          {/* Name chip */}
                          <span className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold text-sm">
                            <FaUserMd className="mr-1" /> {item.docData.name}
                          </span>
                          {/* Speciality chip */}
                          <span className="inline-flex items-center bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs">
                            {item.docData.speciality}
                          </span>
                          {/* Slot time chip */}
                          <span className="inline-flex items-center bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs">
                            <FaClock className="mr-1" /> {item.slotTime}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mb-1">
                          <span>{slotDateFormat(item.slotDate)}</span>
                        </div>
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {!item.cancelled && !past && (
                            <button
                              onClick={() => openCancel(item._id)}
                              className="text-xs px-4 py-1 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition"
                            >
                              <FaTimesCircle className="inline mr-1" /> Цуцлах
                            </button>
                          )}
                          {item.cancelled && <span className="text-red-600 text-xs flex items-center"><FaTimesCircle className="mr-1" />Цуцлагдсан</span>}
                          {past && !item.cancelled && <span className="text-gray-600 text-xs flex items-center"><FaClock className="mr-1" />Өнгөрсөн</span>}
                          {/* Calendar export */}
                          {!item.cancelled && (
                            <>
                              <a
                                href={`https://calendar.google.com/calendar/u/0/r/eventedit?text=Appointment+with+${encodeURIComponent(item.docData.name)}&dates=${item.slotDate.replace(/_/g, '')}T${item.slotTime.replace(':', '')}00Z/${item.slotDate.replace(/_/g, '')}T${item.slotTime.replace(':', '')}00Z`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs px-3 py-1 border rounded-full flex items-center gap-1 hover:bg-blue-50 text-blue-600 border-blue-400"
                              ><FaCloudDownloadAlt /> Google Calendar</a>
                              <a
                                href={`mailto:${item.docData.email}?subject=Appointment&body=Сайн байна уу,`}
                                className="text-xs px-3 py-1 border rounded-full flex items-center gap-1 hover:bg-green-50 text-green-600 border-green-400"
                              ><FaEnvelope /> Имэйл</a>
                              <a
                                href={`https://m.me/${item.docData.messenger || ''}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs px-3 py-1 border rounded-full flex items-center gap-1 hover:bg-purple-50 text-purple-600 border-purple-400"
                              ><FaComments /> Чат</a>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
      </div>

      {/* Дэлгэрэнгүй Modal */}
      {selectedDetail && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full text-sm shadow-xl relative sm:max-w-lg mx-2 animate-fade-in">
            <button
              className="absolute top-2 right-3 text-gray-500 text-xl hover:text-black"
              onClick={() => setSelectedDetail(null)}
              aria-label="Хаах"
            >×</button>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FaClipboardList /> Цагийн дэлгэрэнгүй</h3>
            <div className="flex items-center gap-3 mb-3">
              <img
                src={selectedDetail.docData.image}
                alt={selectedDetail.docData.name}
                className="w-14 h-14 object-cover rounded-full border-2 border-primary/30"
              />
              <div>
                <div className="font-semibold text-primary">{selectedDetail.docData.name}</div>
                <div className="text-xs text-gray-600">{selectedDetail.docData.speciality}</div>
              </div>
            </div>
            <div className="space-y-1 mb-4">
              <div><strong>Огноо:</strong> {slotDateFormat(selectedDetail.slotDate)}</div>
              <div><strong>Цаг:</strong> {selectedDetail.slotTime}</div>
              <div><strong>Хаяг:</strong> {selectedDetail.docData.address.line1}, {selectedDetail.docData.address.line2}</div>
              <div><strong>Төлөв:</strong> {selectedDetail.cancelled ? 'Цуцлагдсан' : isPast(selectedDetail.slotDate, selectedDetail.slotTime) ? 'Өнгөрсөн' : 'Хүлээгдэж байна'}</div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {/* Review only for past */}
              {isPast(selectedDetail.slotDate, selectedDetail.slotTime) && !selectedDetail.cancelled && (
                <button className="bg-primary text-white px-4 py-1 rounded-full hover:bg-primary-dark transition flex items-center gap-1">
                  <FaStar /> Үнэлгээ өгөх
                </button>
              )}
              <a
                href={`https://calendar.google.com/calendar/u/0/r/eventedit?text=Appointment+with+${encodeURIComponent(selectedDetail.docData.name)}&dates=${selectedDetail.slotDate.replace(/_/g, '')}T${selectedDetail.slotTime.replace(':', '')}00Z/${selectedDetail.slotDate.replace(/_/g, '')}T${selectedDetail.slotTime.replace(':', '')}00Z`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 border rounded-full flex items-center gap-1 text-xs hover:bg-blue-50 text-blue-600 border-blue-400"
              ><FaCloudDownloadAlt /> Google Calendar</a>
              <a
                href={`mailto:${selectedDetail.docData.email}?subject=Appointment&body=Сайн байна уу,`}
                className="px-3 py-1 border rounded-full flex items-center gap-1 text-xs hover:bg-green-50 text-green-600 border-green-400"
              ><FaEnvelope /> Имэйл</a>
              <a
                href={`https://m.me/${selectedDetail.docData.messenger || ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 border rounded-full flex items-center gap-1 text-xs hover:bg-purple-50 text-purple-600 border-purple-400"
              ><FaComments /> Чат</a>
            </div>
          </div>
        </div>
      )}

      {/* Цуцлах Modal */}
      {cancelModalOpen && (
        <CancelModal
          onClose={() => setCancelModalOpen(false)}
          onSubmit={doCancel}
        />
      )}
      {/* Animation for modal (Tailwind) */}
      <style>{`
        .animate-fade-in { animation: fadeIn .25s cubic-bezier(.4,0,.2,1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
};

function FaClipboardList(props) {
  return <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" className={props.className || ""}><rect x={9} y={2} width={6} height={4} rx={1} /><rect x={3} y={7} width={18} height={14} rx={2} /><path d="M9 8v1M15 8v1" /></svg>
}

export default MyAppointments;
