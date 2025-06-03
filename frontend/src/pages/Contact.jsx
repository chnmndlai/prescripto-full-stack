import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaCommentDots, FaPaperPlane, FaFacebookF, FaInstagram, FaPhoneAlt, FaCopy, FaCheckCircle, FaMapMarkerAlt, FaBriefcase, FaUserFriends, FaComments } from 'react-icons/fa';
import { assets } from '../assets/assets';

const SOCIALS = [
  { icon: <FaFacebookF />, label: 'Facebook', url: 'https://facebook.com/mentalcare.mn' },
  { icon: <FaInstagram />, label: 'Instagram', url: 'https://instagram.com/mentalcare.mn' },
];

const Contact = () => {
  // States for form
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Email validation helper
  const isEmail = (email) =>
    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  // Form submission mock
  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('Бүх талбарыг бөглөнө үү');
      return;
    }
    if (!isEmail(form.email)) {
      setError('Имэйл буруу байна');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setSent(false), 3500);
    }, 1800);
  };

  // Copy phone/email
  const handleCopy = (txt) => {
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="px-4 md:px-10">
      {/* Title */}
      <div className="text-center text-2xl pt-10 text-[#707070] tracking-wide">
        <p>
          ХОЛБОО <span className="text-gray-700 font-semibold">БАРИХ</span>
        </p>
      </div>

      {/* Main Office + Info Section */}
      <div className="my-10 flex flex-col md:flex-row gap-10 mb-20 text-sm items-center">
        {/* Carousel/Photo */}
        <div className="relative w-full md:max-w-[360px] group flex-shrink-0">
          <img className="w-full rounded-2xl shadow-lg object-cover transition group-hover:scale-105" src={assets.contact_image} alt="Contact Office" />
          {/* Logo overlay */}
          <div className="absolute top-3 left-3 bg-white/70 rounded-full p-2 shadow-lg flex items-center">
            <FaMapMarkerAlt className="text-primary text-xl" />
          </div>
        </div>
        {/* Office info */}
        <div className="flex flex-col gap-4 text-gray-700 w-full max-w-xl">
          <div>
            <p className="font-semibold text-lg flex items-center gap-2"><FaMapMarkerAlt /> БИДНИЙ ОФФИС</p>
            <p className="mt-1 leading-relaxed text-[15px]">
              Улаанбаатар хот, Сүхбаатар дүүрэг, <br />
              Их Сургуулийн гудамж - 2, 8-р давхар
            </p>
          </div>
          <div className="flex flex-col gap-1 text-base">
            <div className="flex items-center gap-2">
              <FaPhoneAlt />
              <a
                href="tel:+97688112233"
                className="underline decoration-dotted decoration-primary hover:text-primary transition"
                tabIndex={0}
              >+976-8811-2233</a>
              <button onClick={() => handleCopy('+976-8811-2233')} aria-label="Copy phone" className="ml-1 text-gray-400 hover:text-primary">
                <FaCopy /> {copied && <span className="text-xs ml-1 text-green-500 animate-bounce">Хууллаа!</span>}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope />
              <a
                href="mailto:info@mentalcare.mn"
                className="underline decoration-dotted decoration-primary hover:text-primary transition"
                tabIndex={0}
              >info@mentalcare.mn</a>
              <button onClick={() => handleCopy('info@mentalcare.mn')} aria-label="Copy email" className="ml-1 text-gray-400 hover:text-primary">
                <FaCopy />
              </button>
            </div>
          </div>
          {/* Socials */}
          <div className="flex gap-4 mt-2">
            {SOCIALS.map(s => (
              <a key={s.label} href={s.url} aria-label={s.label} target="_blank" rel="noopener"
                className="p-2 bg-gray-100 hover:bg-primary hover:text-white rounded-full transition text-lg shadow"
              >{s.icon}</a>
            ))}
          </div>
          <div>
            <p className="font-semibold text-lg flex items-center gap-2 mt-6">
              <FaBriefcase className="animate-pulse" /> МЭРГЭЖЛИЙН БАГТ НЭГДЭХ
              <span className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full animate-bounce">Нээлттэй</span>
            </p>
            <p className="mt-1 text-[15px]">
              Манай сэтгэлзүйчдийн багт нэгдэж, бусдад туслах үйлсэд хувь нэмрээ оруулаарай.
            </p>
            <button className="mt-2 border-2 border-primary text-primary px-8 py-2 text-sm rounded-full hover:bg-primary hover:text-white transition pulse-cta flex items-center gap-2">
              <FaUserFriends className="text-lg" /> Ажлын байр харах
            </button>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow max-w-3xl mx-auto mb-20">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><FaCommentDots /> Холбоо барих маягт</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit} autoComplete="on" aria-label="Contact form">
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Нэр"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition"
              value={form.name}
              onChange={handleChange}
              required
              aria-label="Нэр"
              autoFocus
            />
          </div>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Имэйл"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition"
              value={form.email}
              onChange={handleChange}
              required
              aria-label="Имэйл"
            />
          </div>
          <div className="relative">
            <FaCommentDots className="absolute left-3 top-3 text-gray-400" />
            <textarea
              name="message"
              placeholder="Зурвас"
              rows={5}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition resize-none"
              value={form.message}
              onChange={handleChange}
              required
              aria-label="Зурвас"
              maxLength={500}
            />
            <span className="absolute right-4 bottom-2 text-xs text-gray-400">{form.message.length}/500</span>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white py-2 px-6 rounded-full font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition text-base shadow disabled:opacity-70"
            aria-label="Илгээх"
          >
            {loading
              ? <span className="loader-border h-5 w-5 rounded-full border-2 border-t-2 border-t-white border-white border-opacity-20 animate-spin"></span>
              : <FaPaperPlane className="text-lg" />
            }
            Илгээх
          </button>
          {error && <div className="bg-red-100 text-red-600 px-3 py-2 rounded mt-2">{error}</div>}
          {sent && (
            <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded mt-2 animate-fadeIn">
              <FaCheckCircle className="text-xl" /> Амжилттай илгээгдлээ!
            </div>
          )}
        </form>
      </div>

      {/* Google Map */}
      <div className="max-w-5xl mx-auto mb-20">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><FaMapMarkerAlt /> Байршил</h2>
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.271167259447!2d106.9175392759683!3d47.918458270178714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5d9692c694d77c2d%3A0x963bb6e86d688d63!2z0JzQtdC70LjQvdCw0Y8g0LzQtdC00YjQuNC5INCg0LXRgdGC0LDQvdCw!5e0!3m2!1smn!2smn!4v1711787200000!5m2!1smn!2smn"
          width="100%"
          height="260"
          allowFullScreen=""
          loading="lazy"
          className="rounded-lg border border-gray-300"
        ></iframe>
        <a href="https://goo.gl/maps/T87Zz3M4h7zjvCeN9" target="_blank" rel="noopener"
           className="mt-2 inline-flex items-center gap-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-full px-4 py-2 font-semibold transition text-sm">
          <FaMapMarkerAlt /> Зам асуух (Google Maps)
        </a>
      </div>

      {/* Live Chat Placeholder */}
      <div className="max-w-4xl mx-auto mb-28 text-center">
        <h2 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2"><FaComments /> Live Chat</h2>
        <p className="text-gray-600 mb-4">Манай зөвлөхүүд <span className="bg-green-100 text-green-700 rounded-full px-2 py-1 text-xs ml-1">3 онлайн</span> байна. Та шууд асуулт асууж болно.</p>
        <button
          className="bg-primary text-white px-8 py-2 rounded-full font-semibold flex items-center gap-2 hover:opacity-90 transition shadow pulse-cta"
          aria-label="Чат эхлүүлэх"
          // onClick={() => ...openChatModal() } // Your real chat handler
        >
          <FaComments className="text-lg" /> Чат эхлүүлэх
        </button>
      </div>

      {/* Animation CSS */}
      <style>{`
        .pulse-cta { animation: pulse-btn 1.5s infinite; }
        @keyframes pulse-btn {
          0% { box-shadow: 0 0 0 0 #8a63d255; }
          70% { box-shadow: 0 0 0 10px #8a63d208; }
          100% { box-shadow: 0 0 0 0 #8a63d255; }
        }
        .loader-border {
          border-top-color: #8a63d2 !important;
        }
        @keyframes fadeIn { 0%{opacity:0;transform:translateY(16px)} 100%{opacity:1;transform:translateY(0)} }
        .animate-fadeIn { animation: fadeIn 0.7s; }
      `}</style>
    </div>
  );
};

export default Contact;
