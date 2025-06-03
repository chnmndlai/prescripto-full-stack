// src/pages/Login.jsx
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import logo from '../assets/logo.svg';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';

export default function Login() {
  const { backendUrl, token, setToken, setDToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [mode, setMode] = useState('signup'); // 'signup' эсвэл 'login'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [pwdStrength, setPwdStrength] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) navigate('/');
  }, [token]);

  // Email форматын валидаци
  const validateEmail = (value) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(re.test(value) ? '' : 'Зөв имэйл оруулна уу');
  };

  // Нууц үгийн simple strength шалгалт
  const checkStrength = (pwd) => {
    if (pwd.length >= 12) return 'Strong';
    if (pwd.length >= 8) return 'Medium';
    if (pwd.length > 0) return 'Weak';
    return '';
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;
      if (mode === 'signup') {
        res = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });
        if (res.data.success) {
          localStorage.setItem('dToken', res.data.token);
          setDToken(res.data.token);
          toast.success('Амжилттай бүртгэгдлээ!');
          setMode('login');
        } else {
          toast.error(res.data.message);
        }
      } else {
        res = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
          remember: rememberMe,
        });
        if (res.data.success) {
          localStorage.setItem('token', res.data.token);
          setToken(res.data.token);
          toast.success('Амжилттай нэвтэрлээ!');
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Сервертэй холбогдож чадсангүй.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6"
      >
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src={logo}
            alt="Logo"
            className="h-12 w-12 object-contain"
          />
        </div>

        {/* Title & subtitle */}
        <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-gray-100">
          {mode === 'signup' ? 'Шинэ бүртгэл' : 'Нэвтрэх'}
        </h2>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          {mode === 'signup'
            ? 'Шинэ хэрэглэгчийн бүртгэл үүсгэнэ үү'
            : 'Имэйл ба нууц үгээр нэвтэрнэ үү'}
        </p>

        <div className="space-y-4">
          {/* Full Name (signup only) */}
          {mode === 'signup' && (
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Бүтэн нэр"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Имэйл хаяг"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              onBlur={() => validateEmail(email)}
              required
              className={`w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700
                focus:outline-none focus:ring-2 ${
                  emailError ? 'border-red-400 focus:ring-red-400' : 'focus:ring-primary'
                }`}
            />
            {emailError && (
              <p className="mt-1 text-xs text-red-500">{emailError}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Нууц үг"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPwdStrength(checkStrength(e.target.value));
              }}
              required
              className="w-full pl-10 pr-10 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {showPassword ? (
              <FaEyeSlash
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <FaEye
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
          {mode === 'signup' && pwdStrength && (
            <p className="text-xs text-gray-600 dark:text-gray-400">
              🔒 Нууц үгний хүч: {pwdStrength}
            </p>
          )}

          {/* Remember me & Forgot */}
          {mode === 'login' && (
            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="form-checkbox h-4 w-4 text-primary"
                />
                <span className="text-gray-600 dark:text-gray-400">
                  Намайг сана
                </span>
              </label>
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => toast.info('Нууц үг сэргээх линк явуулах')}
              >
                Нууц үгээ мартсан?
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !!emailError}
            className={`w-full flex justify-center items-center gap-2 py-2 rounded-lg text-white
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'}
            `}
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            )}
            {mode === 'signup' ? 'Бүртгүүлэх' : 'Нэвтрэх'}
          </button>
        </div>

        {/* Toggle mode */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          {mode === 'signup' ? 'Өмнө бүртгүүлсэн үү? ' : 'Шинэ хэрэглэгч бол '}
          <button
            type="button"
            onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
            className="text-primary font-medium hover:underline"
          >
            {mode === 'signup' ? 'Нэвтрэх' : 'Бүртгүүлэх'}
          </button>
        </p>
      </form>
    </div>
  );
}
