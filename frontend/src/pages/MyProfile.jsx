import React, { useContext, useState, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import { FaEdit, FaSave, FaCamera, FaCheckCircle, FaTimesCircle, FaMars, FaVenus, FaGenderless, FaEyeSlash, FaEye } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Gender icon mapping
const genderIcon = gender => {
  if (gender === 'Male') return <FaMars className="inline text-blue-400" aria-label="Эрэгтэй" />;
  if (gender === 'Female') return <FaVenus className="inline text-pink-400" aria-label="Эмэгтэй" />;
  return <FaGenderless className="inline text-gray-400" aria-label="Тодорхойгүй" />;
};

const phoneRegex = /^(\+?976|0)?[0-9]{8}$/;
const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

const completeness = userData =>
  ['name', 'phone', 'dob', 'gender', 'address.line1', 'address.line2', 'image'].reduce(
    (sum, key) => sum + (key.split('.').reduce((o, k) => o?.[k], userData) ? 1 : 0), 0
  ) / 7 * 100;

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [showPhone, setShowPhone] = useState(false);
  const [errors, setErrors] = useState({});
  const fileRef = useRef();
  const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext);

  // Validation
  const validate = () => {
    const newErr = {};
    if (!userData.name) newErr.name = "Нэр оруулна уу";
    if (!userData.phone || !phoneRegex.test(userData.phone)) newErr.phone = "Зөв утасны дугаар оруулна уу";
    if (!userData.dob) newErr.dob = "Төрсөн огноо оруулна уу";
    if (!userData.gender) newErr.gender = "Хүйс сонгоно уу";
    if (!userData.address.line1 || !userData.address.line2) newErr.address = "Бүх хаяг бөглөнө үү";
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  // Update profile
  const updateUserProfileData = async () => {
    if (!validate()) return toast.error("Мэдээллээ шалгана уу");
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('address', JSON.stringify(userData.address));
      formData.append('gender', userData.gender);
      formData.append('dob', userData.dob);
      if (image) formData.append('image', image);

      const { data } = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success('Мэдээлэл амжилттай шинэчлэгдлээ');
        await loadUserProfileData();
        setIsEdit(false);
        setImage(null);
        setErrors({});
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Шинэчлэлтэд алдаа гарлаа');
    }
  };

  // Drag & drop image upload
  const handleDrop = e => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) setImage(e.dataTransfer.files[0]);
  };

  if (!userData) return null;

  // Profile completeness
  const percent = Math.round(completeness(userData));

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 md:px-0">
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 shadow-2xl mb-8 rounded-3xl border border-primary/10 relative"
      >
        <div className="absolute right-5 top-5">
          <span className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full shadow ${percent === 100 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            <FaCheckCircle className="mr-1" /> {percent}% профайл бөглөлт
          </span>
        </div>
        <div className="p-8">
          {/* Profile avatar */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar + Edit + Drag */}
            <motion.label
              htmlFor="avatar"
              className="relative group cursor-pointer avatar transition"
              whileHover={{ scale: 1.04, boxShadow: '0 0 0 6px #d6c8ff55' }}
              tabIndex={0}
              aria-label="Профайл зураг солих"
              onDrop={isEdit ? handleDrop : undefined}
              onDragOver={e => isEdit && e.preventDefault()}
            >
              <div className={`w-32 h-32 rounded-full ring-4 ring-primary/60 shadow-lg overflow-hidden flex items-center justify-center transition-all ${isEdit ? 'group-hover:ring-8 group-hover:ring-primary/80' : ''}`}>
                <img
                  src={image ? URL.createObjectURL(image) : userData.image}
                  alt="Профайл зураг"
                  className="object-cover w-full h-full"
                  draggable={false}
                />
                {isEdit && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 bg-black/20 flex items-center justify-center"
                  >
                    <FaCamera className="text-white text-2xl drop-shadow animate-pulse" aria-label="Зураг сонгох" />
                  </motion.div>
                )}
                {/* Loader spinner */}
                {image && (
                  <div className="absolute top-1 right-1 bg-white rounded-full shadow p-1">
                    <img src={assets.upload_icon} className="w-5 h-5" alt="Шинэ зураг" />
                  </div>
                )}
              </div>
              {isEdit && (
                <input
                  ref={fileRef}
                  id="avatar"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={e => setImage(e.target.files[0])}
                />
              )}
            </motion.label>
            {/* Name & Email */}
            <div className="flex-1 text-center md:text-left">
              {isEdit ? (
                <>
                  <input
                    type="text"
                    aria-label="Нэр засах"
                    className={`input input-bordered input-lg w-full max-w-xs mx-auto md:mx-0 ${errors.name ? 'border-red-400 focus:ring-red-400' : ''}`}
                    value={userData.name}
                    onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Нэр*"
                    autoFocus
                  />
                  {errors.name && <div className="text-xs text-red-400 mt-1"><FaTimesCircle className="inline" /> {errors.name}</div>}
                </>
              ) : (
                <h1 className="text-3xl font-bold text-primary mb-1">{userData.name}</h1>
              )}
              <div className="text-gray-500">{userData.email}</div>
            </div>
          </div>
          {/* Divider */}
          <div className="divider my-5" />
          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {/* Phone */}
            <div>
              <div className="flex items-center mb-1 gap-2">
                <span className="text-xl">📱</span>
                <span className="font-medium">Утас:</span>
                {!isEdit && (
                  <button
                    className="ml-2 text-xs text-gray-400 hover:text-primary transition"
                    tabIndex={0}
                    onClick={() => setShowPhone(v => !v)}
                    aria-label={showPhone ? "Утас нуух" : "Утас харах"}
                  >
                    {showPhone ? <FaEyeSlash /> : <FaEye />}
                  </button>
                )}
              </div>
              {isEdit ? (
                <>
                  <input
                    type="tel"
                    aria-label="Утас засах"
                    className={`input input-bordered w-full ${errors.phone ? 'border-red-400 focus:ring-red-400' : ''}`}
                    value={userData.phone}
                    onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Утас*"
                  />
                  {errors.phone && <div className="text-xs text-red-400 mt-1"><FaTimesCircle className="inline" /> {errors.phone}</div>}
                </>
              ) : (
                <span className="text-lg">{showPhone ? userData.phone : "••••••••"}</span>
              )}
            </div>
            {/* Gender */}
            <div>
              <div className="flex items-center mb-1 gap-2">
                <span className="text-xl">⚧️</span>
                <span className="font-medium">Хүйс:</span>
              </div>
              {isEdit ? (
                <>
                  <select
                    className={`select select-bordered w-full ${errors.gender ? 'border-red-400 focus:ring-red-400' : ''}`}
                    value={userData.gender}
                    onChange={e => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                  >
                    <option value="">Сонгох*</option>
                    <option value="Male">Эрэгтэй ♂️</option>
                    <option value="Female">Эмэгтэй ♀️</option>
                    <option value="Other">Бусад ⚧️</option>
                  </select>
                  {errors.gender && <div className="text-xs text-red-400 mt-1"><FaTimesCircle className="inline" /> {errors.gender}</div>}
                </>
              ) : (
                <span className="text-lg flex items-center gap-2">{genderIcon(userData.gender)} {userData.gender === "Male" ? "Эрэгтэй" : userData.gender === "Female" ? "Эмэгтэй" : "Бусад"}</span>
              )}
            </div>
            {/* DOB */}
            <div>
              <div className="flex items-center mb-1 gap-2">
                <span className="text-xl">🎂</span>
                <span className="font-medium">Төрсөн огноо:</span>
              </div>
              {isEdit ? (
                <>
                  <input
                    type="date"
                    className={`input input-bordered w-full ${errors.dob ? 'border-red-400 focus:ring-red-400' : ''}`}
                    value={userData.dob}
                    onChange={e => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                    placeholder="Төрсөн огноо*"
                  />
                  {errors.dob && <div className="text-xs text-red-400 mt-1"><FaTimesCircle className="inline" /> {errors.dob}</div>}
                </>
              ) : (
                <span className="text-lg">
                  {userData.dob
                    ? new Date(userData.dob).toLocaleDateString('mn-MN', { year: 'numeric', month: 'long', day: 'numeric' })
                    : 'Оруулаагүй'}
                </span>
              )}
            </div>
            {/* Address */}
            <div>
              <div className="flex items-center mb-1 gap-2">
                <span className="text-xl">🏠</span>
                <span className="font-medium">Хаяг:</span>
              </div>
              {isEdit ? (
                <>
                  <input
                    type="text"
                    placeholder="Гудамж, дүүрэг*"
                    className={`input input-bordered w-full mb-2 ${errors.address ? 'border-red-400 focus:ring-red-400' : ''}`}
                    value={userData.address.line1}
                    onChange={e => setUserData(prev => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value }
                    }))}
                  />
                  <input
                    type="text"
                    placeholder="Хот, аймаг*"
                    className={`input input-bordered w-full ${errors.address ? 'border-red-400 focus:ring-red-400' : ''}`}
                    value={userData.address.line2}
                    onChange={e => setUserData(prev => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value }
                    }))}
                  />
                  {errors.address && <div className="text-xs text-red-400 mt-1"><FaTimesCircle className="inline" /> {errors.address}</div>}
                </>
              ) : (
                <div>
                  <div>{userData.address.line1}</div>
                  <div>{userData.address.line2}</div>
                </div>
              )}
            </div>
          </div>
          {/* Save/Edit Button */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            {isEdit ? (
              <>
                <button
                  onClick={updateUserProfileData}
                  className="btn btn-primary px-8 py-2 flex items-center gap-2 text-lg"
                  aria-label="Профайл хадгалах"
                >
                  <FaSave className="inline" /> Хадгалах
                </button>
                <button
                  onClick={() => { setIsEdit(false); setImage(null); setErrors({}); }}
                  className="btn btn-ghost border px-8 py-2 text-lg"
                  aria-label="Буцах"
                >
                  <FaTimesCircle className="inline" /> Буцах
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="btn btn-outline px-10 py-2 text-lg flex items-center gap-2"
                aria-label="Профайл засах"
              >
                <FaEdit className="inline" /> Засах
              </button>
            )}
          </div>
        </div>
      </motion.div>
      {/* Pulse glow effect for avatar */}
      <style>{`
        .avatar:hover .w-32 { box-shadow: 0 0 0 8px #9154fa55; }
        .avatar:focus .w-32 { box-shadow: 0 0 0 8px #9154fa88; }
      `}</style>
    </div>
  );
};

export default MyProfile;
