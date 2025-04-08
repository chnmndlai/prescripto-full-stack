import React from 'react';
import { assets } from '../assets/assets';

const Contact = () => {
  return (
    <div className="px-4 md:px-10">
      {/* Title */}
      <div className='text-center text-2xl pt-10 text-[#707070]'>
        <p>ХОЛБОО <span className='text-gray-700 font-semibold'>БАРИХ</span></p>
      </div>

      {/* Main Section */}
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-20 text-sm'>
        <img className='w-full md:max-w-[360px] rounded-xl' src={assets.contact_image} alt="Contact" />

        <div className='flex flex-col justify-center items-start gap-6 text-gray-600'>
          <p className='font-semibold text-lg'>БИДНИЙ ОФФИС</p>
          <p>
            Улаанбаатар хот, Сүхбаатар дүүрэг,<br />
            Их Сургуулийн гудамж - 2, 8-р давхар
          </p>
          <p>
            Утас: +976-8811-2233<br />
            Имэйл: info@mentalcare.mn
          </p>

          <p className='font-semibold text-lg'>МЭРГЭЖЛИЙН БАГТ НЭГДЭХ</p>
          <p>
            Манай сэтгэлзүйчдийн багт нэгдэж, бусдад туслах үйлсэд хувь нэмрээ оруулаарай.
          </p>
          <button className='border border-primary text-primary px-8 py-3 text-sm hover:bg-primary hover:text-white transition-all duration-500 rounded-full'>Ажлын байр харах</button>
        </div>
      </div>

      {/* Contact Form */}
      <div className='bg-gray-50 rounded-xl p-8 shadow max-w-3xl mx-auto mb-20'>
        <h2 className='text-xl font-semibold mb-4'>Холбоо барих маягт</h2>
        <form className='flex flex-col gap-4'>
          <input type='text' placeholder='Нэр' className='px-4 py-2 border border-gray-300 rounded-md' required />
          <input type='email' placeholder='Имэйл' className='px-4 py-2 border border-gray-300 rounded-md' required />
          <textarea placeholder='Зурвас' rows={5} className='px-4 py-2 border border-gray-300 rounded-md' required></textarea>
          <button type='submit' className='bg-primary text-white py-2 px-6 rounded-md hover:opacity-90 transition'>Илгээх</button>
        </form>
      </div>

      {/* Google Map */}
      <div className='max-w-5xl mx-auto mb-20'>
        <h2 className='text-xl font-semibold mb-4'>Байршил</h2>
        <iframe
          title='Google Map'
          src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.271167259447!2d106.9175392759683!3d47.918458270178714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5d9692c694d77c2d%3A0x963bb6e86d688d63!2z0JzQtdC70LjQvdCw0Y8g0LzQtdC00YjQuNC5INCg0LXRgdGC0LDQvdCw!5e0!3m2!1smn!2smn!4v1711787200000!5m2!1smn!2smn'
          width='100%'
          height='300'
          allowFullScreen=''
          loading='lazy'
          className='rounded-lg border border-gray-300'
        ></iframe>
      </div>

      {/* Live Chat Placeholder */}
      <div className='max-w-4xl mx-auto mb-28 text-center'>
        <h2 className='text-xl font-semibold mb-2'>Live Chat</h2>
        <p className='text-gray-600 mb-4'>Манай зөвлөхүүд одоо онлайн байна. Та шууд асуулт асууж болно.</p>
        <button className='bg-primary text-white px-6 py-2 rounded-full hover:opacity-90 transition'>Чат эхлүүлэх</button>
      </div>
    </div>
  );
};

export default Contact;

