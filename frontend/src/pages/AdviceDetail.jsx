import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  FaFacebookF,
  FaTwitter,
  FaShareAlt,
  FaArrowLeft,
  FaStar,
  FaUserMd,
  FaClipboardCheck,
  FaClock,
  FaBookOpen,
  FaCheck
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AdviceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [advice, setAdvice] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showThanks, setShowThanks] = useState(false);

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/advice/${id}`);
        if (res.data.success) {
          setAdvice(res.data.advice);
        } else {
          toast.error('Зөвлөгөө ачааллаж чадсангүй');
        }
      } catch (err) {
        toast.error('Сервертэй холбогдож чадсангүй');
      } finally {
        setLoading(false);
      }
    };
    fetchAdvice();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-gray-400">Уншиж байна...</div>
      </div>
    );
  }
  if (!advice) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FaClipboardCheck size={44} className="mb-2 text-primary" />
        <p className="text-gray-400">Зөвлөгөө олдсонгүй.</p>
      </div>
    );
  }

  const { title, image, doctor, summary, createdAt } = advice;
  const date = new Date(createdAt).toLocaleDateString('mn-MN', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const wordCount = summary.split(' ').length;
  const readTime = Math.ceil(wordCount / 200);

  // Share
  const shareUrl = window.location.href;
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Rate submit
  const handleSubmit = async () => {
    setSubmitLoading(true);
    try {
      // API илгээх код энд орно (TODO)
      setShowThanks(true);
      setTimeout(() => setShowThanks(false), 2200);
      setComment('');
      setRating(0);
    } catch (e) {
      toast.error('Үнэлгээ илгээхэд алдаа гарлаа');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="max-w-screen-md mx-auto bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl shadow-2xl mb-8"
      aria-label="Зөвлөгөө дэлгэрэнгүй"
    >
      {/* Back button */}
      <motion.button
        whileHover={{ x: -4, backgroundColor: "#f1f3fa" }}
        transition={{ type: "spring", stiffness: 250 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-primary font-semibold px-3 py-2 mb-4 rounded-full transition shadow-none hover:shadow focus:outline-none"
        tabIndex={0}
        aria-label="Буцах"
      >
        <FaArrowLeft /> Буцах
      </motion.button>

      {/* Title & Meta */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-2 leading-tight">
        {title}
      </h1>
      <div className="flex flex-wrap justify-center items-center gap-2 text-xs mb-6">
        <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
          <span className="mr-1">🗓️</span> {date}
        </span>
        <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
          <FaBookOpen className="mr-1" /> {readTime} мин унших
        </span>
      </div>

      {/* Main Image with motion/tilt */}
      {image && (
        <motion.img
          src={image}
          alt={title}
          className="w-full max-h-80 object-cover rounded-2xl mb-6 mx-auto shadow-lg"
          whileHover={{ scale: 1.03, rotate: 1.4 }}
          transition={{ type: "spring", stiffness: 120, damping: 10 }}
          loading="lazy"
        />
      )}

      {/* Doctor info */}
      {doctor && (
        <motion.div
          whileHover={{ scale: 1.04 }}
          className="flex items-center gap-4 mb-8 transition"
        >
          <div className="relative group">
            <motion.img
              src={doctor.image}
              alt={doctor.name}
              className="w-14 h-14 rounded-full object-cover border-4 border-primary shadow-lg group-hover:shadow-xl transition"
              whileHover={{ scale: 1.1, rotate: 2 }}
            />
            {/* Animated ring */}
            <span className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse group-hover:border-primary/60 pointer-events-none" />
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-200">
            <p className="font-bold flex items-center gap-2">
              <FaUserMd className="text-indigo-400" />
              {doctor.name}
            </p>
            {doctor.speciality && (
              <span className="inline-flex items-center gap-1 mt-1 px-2 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-medium">
                🧑‍⚕️ {doctor.speciality}
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.18 }}
        className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line space-y-4 mb-8 text-base"
        style={{ lineHeight: 1.78 }}
      >
        {summary}
      </motion.div>

      {/* Share buttons */}
      <div className="flex justify-center gap-5 mb-8">
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Twitter дээр хуваалцах"
          className="btn btn-circle btn-ghost hover:bg-blue-100 transition"
        >
          <FaTwitter className="text-xl text-blue-400 hover:text-blue-600" />
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Facebook дээр хуваалцах"
          className="btn btn-circle btn-ghost hover:bg-blue-50 transition"
        >
          <FaFacebookF className="text-xl text-blue-600 hover:text-blue-700" />
        </a>
        <motion.button
          aria-label="Линк хуулах"
          className="btn btn-circle btn-ghost hover:bg-primary/10 relative"
          onClick={handleCopy}
          whileTap={{ scale: 0.95 }}
        >
          {copied ? <FaCheck className="text-xl text-green-500 animate-bounce" /> : <FaShareAlt className="text-xl text-gray-500 hover:text-primary" />}
          <AnimatePresence>
            {copied && (
              <motion.span
                className="absolute left-10 top-1 text-xs text-green-600"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25 }}
              >
                Хууллаа!
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Rating & Comment */}
      <div className="border-t pt-6 mt-6">
        <h2 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100 text-center">Таны үнэлгээ</h2>
        <div className="flex justify-center mb-4 gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              whileTap={{ scale: 1.25 }}
              className="focus:outline-none"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              aria-label={`${star} од`}
              tabIndex={0}
            >
              <FaStar
                className={`text-2xl transition-all drop-shadow ${
                  star <= (hoverRating || rating)
                    ? 'text-yellow-400 scale-110'
                    : 'text-gray-300'
                }`}
              />
            </motion.button>
          ))}
        </div>
        <textarea
          rows={3}
          placeholder="Сэтгэгдэл бичих..."
          value={comment}
          onChange={e => setComment(e.target.value)}
          className="w-full p-3 border rounded-xl resize-none text-sm focus:outline-none focus:ring-2 focus:ring-primary mb-4"
          aria-label="Сэтгэгдэл"
          maxLength={400}
        />
        <motion.button
          onClick={handleSubmit}
          className={`block mx-auto px-7 py-2 bg-primary text-white rounded-full hover:bg-primary-dark shadow-lg transition focus:outline-none focus:ring-2 focus:ring-primary font-medium ${submitLoading ? 'opacity-60 pointer-events-none' : ''}`}
          whileTap={{ scale: 0.96 }}
          disabled={submitLoading || (!rating && !comment)}
          aria-disabled={submitLoading || (!rating && !comment)}
        >
          {submitLoading ? "Илгээж байна..." : "Илгээх"}
        </motion.button>
        <AnimatePresence>
          {showThanks && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="text-green-600 text-center font-semibold mt-3"
            >
              Баярлалаа! Таны үнэлгээ хүлээн авлаа.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default AdviceDetail;
