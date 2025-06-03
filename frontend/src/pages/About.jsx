import React from 'react';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';
import { FaClock, FaUserMd, FaHandsHelping, FaCheckCircle, FaRegStar } from 'react-icons/fa';

// CountUp effect (animates numbers)
function CountUp({ end, suffix = '', duration = 2 }) {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    let start = 0;
    const t0 = Date.now();
    const timer = setInterval(() => {
      const progress = Math.min((Date.now() - t0) / (duration * 1000), 1);
      setValue(Math.round(progress * end));
      if (progress === 1) clearInterval(timer);
    }, 32);
    return () => clearInterval(timer);
  }, [end, duration]);
  return (
    <span>
      {value}{suffix}
    </span>
  );
}

const stats = [
  { icon: <FaUserMd />, label: 'Бүртгэлтэй эмч', value: 120, suffix: '+' },
  { icon: <FaHandsHelping />, label: 'Зөвлөгөө', value: 500, suffix: '+' },
  { icon: <FaClock />, label: 'Дундаж хариу цаг', value: 5, suffix: ' мин' },
];

const whyChoose = [
  {
    icon: <FaCheckCircle className="text-primary text-3xl mb-2" />,
    title: 'Хялбар захиалга',
    desc: 'Цахимаар хэдхэн даралтаар эмчид цаг захиалаарай.'
  },
  {
    icon: <FaUserMd className="text-indigo-500 text-3xl mb-2" />,
    title: 'Итгэлтэй мэргэжилтнүүд',
    desc: 'Зөвхөн туршлагатай, бүртгэлтэй эмч, судлаачид үйлчилнэ.'
  },
  {
    icon: <FaRegStar className="text-yellow-400 text-3xl mb-2" />,
    title: 'Тест ба зөвлөгөө',
    desc: 'Өөрт тохирсон онлайн тест, шинжилгээ, зөвлөгөө авах боломж.'
  },
];

const About = () => (
  <div id="about" className="px-4 md:px-10 lg:px-20 py-16 space-y-16 bg-gradient-to-b from-white via-indigo-50 to-white">
    {/* Hero Section */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75 }}
      className="flex flex-col-reverse md:flex-row items-center gap-12"
    >
      <motion.div
        className="md:w-1/2 text-gray-700 space-y-6"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15, duration: 0.8 }}
      >
        <h2 className="text-4xl sm:text-5xl font-extrabold text-center md:text-left leading-tight mb-4 tracking-tight">
          БИДНИЙ <span className="bg-gradient-to-r from-primary to-indigo-500 text-transparent bg-clip-text">ТУХАЙ</span>
        </h2>
        <p className="text-base sm:text-lg">
          <b>MentalCare</b> бол сэтгэлзүйн эрүүл мэндийн дижитал платформ. Бид таны хэзээ ч, хаана ч мэргэжлийн зөвлөгөө, эмчилгээ, дэмжлэг авахад тусалдаг.
        </p>
        <p>
          Манай системд бүртгэлтэй туршлагатай сэтгэл судлаач, сэтгэцийн эмч нартай хялбар цаг захиалж, онлайн тест бөглөх, хэрэгцээт зөвлөгөө авах боломжтой.
        </p>
        <div className="bg-primary/10 rounded-xl px-5 py-3 text-base font-semibold">
          <span className="text-primary">Алсын хараа:</span>  
          <br />
          Сэтгэлзүйн тусламжийг хүн бүрт тэгш, шуурхай, хялбар байдлаар хүргэх — Эрүүл ухаан, Эрүүл амьдрал.
        </div>
      </motion.div>
      {/* Hero image - илүү engaging */}
      <motion.div
        className="w-full md:w-1/2 flex justify-center items-center"
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
        whileHover={{ rotate: 2, scale: 1.03, boxShadow: '0 8px 40px #8a63d244' }}
      >
        <img
          src={assets.about_image}
          alt="About Us"
          className="rounded-3xl shadow-2xl border-4 border-white max-w-xs sm:max-w-md md:max-w-full"
          style={{
            filter: "drop-shadow(0 8px 40px #8a63d219)"
          }}
        />
      </motion.div>
    </motion.div>

    {/* Why Choose Us */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.18 }}
      className="space-y-6 text-center"
    >
      <h3 className="text-2xl sm:text-3xl font-bold mb-3">
        ЯАГААД <span className="text-primary">БИДНИЙГ</span> СОНГОХ ВЭ?
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
        {whyChoose.map(({ icon, title, desc }, idx) => (
          <motion.div
            key={idx}
            whileHover={{
              scale: 1.07,
              boxShadow: "0 8px 40px #818cf855",
              background: "linear-gradient(110deg,#f1f5fe 40%,#eef1fc 100%)"
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.07 * idx }}
            className="border bg-white rounded-2xl p-8 flex flex-col items-center gap-3 shadow hover:shadow-2xl cursor-pointer transition"
            tabIndex={0}
            aria-label={title}
          >
            <div className="mb-2">{icon}</div>
            <h4 className="text-lg font-semibold mb-1">{title}</h4>
            <p className="text-gray-500">{desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>

    {/* Stats Section */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.12 }}
      className="bg-gradient-to-r from-primary via-indigo-500 to-blue-500 text-white rounded-3xl p-10 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 shadow-xl"
    >
      {stats.map(({ icon, label, value, suffix }, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.08 * i }}
          className="flex flex-col items-center gap-4"
        >
          <span className="inline-flex items-center justify-center w-16 h-16 bg-white/15 rounded-full border-4 border-white/10 shadow-lg mb-2 text-4xl">
            {icon}
          </span>
          <p className="text-4xl font-extrabold tracking-tight drop-shadow-sm">
            <CountUp end={value} suffix={suffix} duration={1.5} />
          </p>
          <p className="text-base">{label}</p>
        </motion.div>
      ))}
    </motion.div>
  </div>
);

export default About;
