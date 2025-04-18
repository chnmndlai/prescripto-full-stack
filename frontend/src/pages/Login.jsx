import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [state, setState] = useState('Бүртгүүлэх');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { backendUrl, token, setToken, setDToken } = useContext(AppContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      let res;
      if (state === 'Бүртгүүлэх') {
        res = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });

        if (res.data.success) {
          localStorage.setItem('dToken', res.data.token);
          setDToken(res.data.token);
          toast.success('Амжилттай бүртгэгдлээ!');
        } else {
          toast.error(res.data.message);
        }
      } else {
        res = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });

        if (res.data.success) {
          localStorage.setItem('token', res.data.token);
          setToken(res.data.token);
          toast.success('Амжилттай нэвтэрлээ!');
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (error) {
      console.error('Серверийн алдаа:', error);
      toast.error(error.response?.data?.message || 'Сервертэй холбогдож чадсангүй.');
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg bg-white'>
        <p className='text-2xl font-semibold'>
          {state === 'Бүртгүүлэх' ? 'Шинэ бүртгэл үүсгэх' : 'Нэвтрэх'}
        </p>
        <p>
          Та сэтгэл зүйн тусламж авахын тулд {state === 'Бүртгүүлэх' ? 'шинэ бүртгэл үүсгэнэ үү' : 'нэвтэрнэ үү'}
        </p>
        {state === 'Бүртгүүлэх' && (
          <div className='w-full'>
            <p>Бүтэн нэр</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className='border border-[#DADADA] rounded w-full p-2 mt-1'
              type='text'
              required
            />
          </div>
        )}
        <div className='w-full'>
          <p>Имэйл</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className='border border-[#DADADA] rounded w-full p-2 mt-1'
            type='email'
            required
          />
        </div>
        <div className='w-full'>
          <p>Нууц үг</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className='border border-[#DADADA] rounded w-full p-2 mt-1'
            type='password'
            required
          />
        </div>
        <button className='bg-primary text-white w-full py-2 my-2 rounded-md text-base'>
          {state === 'Бүртгүүлэх' ? 'Бүртгүүлэх' : 'Нэвтрэх'}
        </button>
        {state === 'Бүртгүүлэх' ? (
          <p>
            Өмнө бүртгүүлсэн үү?{' '}
            <span onClick={() => setState('Нэвтрэх')} className='text-primary underline cursor-pointer'>
              Энд дарж нэвтэрнэ үү
            </span>
          </p>
        ) : (
          <p>
            Бүртгэл үүсгэх бол{' '}
            <span onClick={() => setState('Бүртгүүлэх')} className='text-primary underline cursor-pointer'>
              Энд дарна уу
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
