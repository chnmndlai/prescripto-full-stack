import React, { useState } from 'react';
import { motion } from 'framer-motion';

const moods = [
  { key: 'happy', emoji: '😃', label: 'Баяртай' },
  { key: 'ok', emoji: '🙂', label: 'Тайван' },
  { key: 'meh', emoji: '😐', label: 'Зүгээр' },
  { key: 'sad', emoji: '😞', label: 'Гунигтай' },
  { key: 'cry', emoji: '😭', label: 'Уйлмаар' },
  { key: 'anxious', emoji: '😰', label: 'Сандарч байна' },
];

const getPrompt = (key, label) =>
  `Миний өнөөдрийн сэтгэл санаа: "${label}" (${key} emoji). Намайг эерэг болгож, зоригжуулах богино (1-2 өгүүлбэр) мотивацийн зөвлөгөө өгөөч.`;

const Banner = () => {
  const [selected, setSelected] = useState(null);
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAdvice = async (key, label) => {
    setLoading(true);
    setAdvice('');
    try {
      await new Promise((r) => setTimeout(r, 1100));
      const mockText = {
        happy: "Гайхалтай байна! Эрч хүчээрээ бусдыг ч бас урамшуулж чадна.",
        ok: "Амьдралын тайван үеийг сайхан мэдэрч, өөртөө амралт олгоорой.",
        meh: "Жижиг баярт зүйлийг олж хар, өнөөдөр ч бас сайхан зүйл тохиолдоно.",
        sad: "Гуниглах бол амьдралын нэг хэсэг, чамд боломж, урам зориг ирэх болно.",
        cry: "Уйлж болохыг өөртөө зөвшөөр. Бүх зүйл сайхан болно!",
        anxious: "Амьсгал дээрээ төвлөрч, алгуур өөртөө хандаарай — чи чадна!",
      };
      setAdvice(mockText[key] || "Өдөр бүр шинэ боломж авчирдаг.");
    } catch (err) {
      setAdvice("Уучлаарай, зөвлөгөө авахад алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const emojiVariant = {
    initial: { scale: 1, rotate: 0 },
    hover: { scale: 1.17, rotate: -6, transition: { type: 'spring', stiffness: 400 } },
    tap: { scale: 0.97, rotate: 6 },
    selected: { scale: 1.2, rotate: 0, boxShadow: "0 0 28px #f3e8ff" },
  };

  const handleSelect = (key, label) => {
    setSelected(key);
    setAdvice('');
    fetchAdvice(key, label);
  };

  return (
    <section className="
      flex flex-col items-center justify-center min-h-[55vh]
      bg-gradient-to-br from-blue-100 via-white to-pink-100
      rounded-3xl shadow-2xl mx-2 my-8 p-8
      relative
      ">
      {/* Glassmorphism layer */}
      <div className="absolute inset-0 rounded-3xl backdrop-blur-md bg-white/60 pointer-events-none z-0" />
      <div className="relative z-10 flex flex-col items-center w-full">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-7 text-center">Өнөөдөрийн мэдрэмжээ эможигоор илэрхийлээрэй</h2>
        <div className="flex flex-wrap gap-7 justify-center mb-7">
          {moods.map(({ key, emoji, label }) => (
            <motion.button
              key={key}
              aria-label={label}
              initial="initial"
              animate={selected === key ? "selected" : "initial"}
              whileHover="hover"
              whileTap="tap"
              variants={emojiVariant}
              onClick={() => handleSelect(key, label)}
              className={`text-5xl transition-all p-3 rounded-full border-4 shadow-xl focus:outline-none
                ${selected === key ? "border-violet-300 bg-white/80" : "border-transparent bg-white/50"}
              `}
              style={{ filter: selected === key ? "drop-shadow(0 0 24px #d8b4fe)" : "drop-shadow(0 2px 12px #e0e7ff)" }}
            >
              {emoji}
              <div className="text-xs mt-1 text-gray-600 font-semibold">{label}</div>
            </motion.button>
          ))}
        </div>
        {/* AI зөвлөгөө хэсэг */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/90 rounded-xl shadow-md px-7 py-6 max-w-md w-full mx-auto text-center backdrop-blur-md border border-violet-100"
          >
            <div className="text-3xl mb-1">{moods.find(i => i.key === selected).emoji}</div>
            <div className="text-lg font-bold text-violet-600 mb-2">{moods.find(i => i.key === selected).label}</div>
            <div className="text-gray-700 text-base min-h-[48px] flex items-center justify-center">
              {loading ? (
                <span className="animate-pulse text-gray-400">Зөвлөгөө ачааллаж байна...</span>
              ) : (
                advice
              )}
            </div>
            <button
              className="mt-4 px-4 py-1 rounded-full bg-violet-500 text-white text-xs font-semibold hover:bg-violet-600 transition-all"
              onClick={() => setSelected(null)}
            >
              Дахин сонгох
            </button>
          </motion.div>
        )}
        {!selected && (
          <p className="text-gray-500 mt-2 text-sm">Emoji дээр дараарай</p>
        )}
      </div>
    </section>
  );
};

export default Banner;
