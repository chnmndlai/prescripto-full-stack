import React from 'react';
import { assets } from '../assets/assets';

const About = () => {
  return (
    <div id="about" className="px-4 md:px-10">
      {/* Title */}
      <div className='text-center text-2xl pt-10 text-[#707070]'>
        <p>БИДНИЙ <span className='text-gray-700 font-semibold'>ТУХАЙ</span></p>
      </div>

      {/* Main section */}
      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px] rounded-xl' src={assets.about_image} alt="About" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>
            MentalCare системд тавтай морил! Бид сэтгэлзүйн эрүүл мэндийн салбарт тулгуурлан хэрэглэгч бүрт тохирсон эмчилгээ, зөвлөгөө, дэмжлэгийг хялбархан, хүртээмжтэй байдлаар хүргэхийг зорьдог.
          </p>
          <p>
            Та манай платформоор дамжуулан туршлагатай сэтгэл судлаач, сэтгэцийн эмч нартай цаг товлох, сэтгэлзүйн тест бөглөх, зөвлөгөө авах боломжтой. Бид танд хамгийн тохирсон шийдлийг санал болгохын төлөө ажиллаж байна.
          </p>
          <b className='text-gray-800'>Алсын хараа</b>
          <p>
            Бидний зорилго бол сэтгэлзүйн тусламжийг хүн бүрт тэгш хүртээмжтэй, цахимаар хялбар хүртээх. Эрүүл ухаан — Эрүүл амьдрал.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className='text-xl my-4 font-semibold'>
        <p>ЯАГААД <span className='text-gray-700'>БИДНИЙГ СОНГОХ ВЭ?</span></p>
      </div>

      <div className='flex flex-col md:flex-row mb-20 gap-4'>
        <div className='border px-8 md:px-10 py-8 sm:py-16 flex flex-col gap-4 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer rounded-xl'>
          <b>ХЯЛБАР ЦАГ ЗАХИАЛГА:</b>
          <p>Цахимаар хэдхэн даралтаар өөрт тохирсон эмчид цаг захиалах боломж.</p>
        </div>
        <div className='border px-8 md:px-10 py-8 sm:py-16 flex flex-col gap-4 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer rounded-xl'>
          <b>ИТГЭЛТЭЙ ЭМЧ НАР:</b>
          <p>Манай системд зөвхөн туршлагатай, бүртгэлтэй сэтгэл зүйч, эмч нар бүртгэлтэй байдаг.</p>
        </div>
        <div className='border px-8 md:px-10 py-8 sm:py-16 flex flex-col gap-4 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer rounded-xl'>
          <b>ЗӨВЛӨГӨӨ БА ТЕСТ:</b>
          <p>Та өөрт тохирсон сэтгэлзүйн зөвлөгөө, тест бөглөх боломжтой.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
