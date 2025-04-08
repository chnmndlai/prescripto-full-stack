import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
    const navigate = useNavigate();

    return (
        <div className='flex flex-col md:flex-row items-center justify-between bg-primary rounded-2xl px-6 sm:px-10 md:px-14 lg:px-20 py-10 mt-20 md:mx-10 shadow-lg'>
            
            {/* Зүүн тал */}
            <div className='flex-1 text-center md:text-left'>
                <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight'>
                    Сэтгэлзүйн тусламж <br />
                    
                </h1>
                <p className='text-white text-sm sm:text-base mt-4'>
                    Хувийн мэргэжлийн зөвлөгөө, онлайн цаг захиалгын систем.
                </p>
                <button 
                    onClick={() => { navigate('/login'); scrollTo(0, 0) }}
                    className='bg-white text-[#333] text-sm sm:text-base px-6 py-3 rounded-full mt-6 hover:scale-105 transition-all font-medium shadow-md'
                >
                    Бүртгэл үүсгэх
                </button>
            </div>

            {/* Баруун талын зураг */}
            <div className='hidden md:block md:w-1/2 lg:w-[400px] relative mt-10 md:mt-0'>
                <img 
                    className='w-full max-w-md mx-auto' 
                    src={assets.appointment_img} 
                    alt="Сэтгэлзүйн зөвлөгөөний зураг" 
                />
            </div>
        </div>
    );
}

export default Banner
