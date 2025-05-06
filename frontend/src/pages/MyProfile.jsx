import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('address', JSON.stringify(userData.address));
      formData.append('gender', userData.gender);
      formData.append('dob', userData.dob);
      if (image) formData.append('image', image);

      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, { headers: { token } });

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return userData ? (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">👤 Миний мэдээлэл</h1>

      {/* Зураг ба нэр */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
        <label htmlFor="image" className="relative cursor-pointer">
          <img
            className="w-32 h-32 rounded-full object-cover shadow"
            src={image ? URL.createObjectURL(image) : userData.image}
            alt="Профайл зураг"
          />
          {isEdit && (
            <>
              <div className="absolute bottom-0 right-0 bg-blue-600 p-1 rounded-full">
                <img className="w-5" src={assets.upload_icon} alt="upload" />
              </div>
              <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
            </>
          )}
        </label>
        <div>
          {isEdit ? (
            <input
              className="bg-gray-100 px-2 py-1 rounded text-xl font-medium max-w-[250px]"
              type="text"
              onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
              value={userData.name}
            />
          ) : (
            <h2 className="text-2xl font-semibold text-gray-800">{userData.name}</h2>
          )}
        </div>
      </div>

      <hr className="my-4 border-gray-300" />

      {/* Холбоо барих */}
      <div>
        <h3 className="text-gray-700 font-semibold mb-2">📞 Холбоо барих мэдээлэл</h3>
        <div className="grid grid-cols-[140px_1fr] gap-2">
          <span className="font-medium">Имэйл:</span>
          <span className="text-blue-600">{userData.email}</span>

          <span className="font-medium">Утас:</span>
          {isEdit ? (
            <input
              className="bg-gray-50 px-2 py-1 rounded"
              type="text"
              onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))}
              value={userData.phone}
            />
          ) : (
            <span>{userData.phone}</span>
          )}

          <span className="font-medium">Хаяг:</span>
          {isEdit ? (
            <div className="flex flex-col gap-1">
              <input
                className="bg-gray-50 px-2 py-1 rounded"
                type="text"
                placeholder="Гудамж, дүүрэг"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value },
                  }))
                }
                value={userData.address?.line1 || ''}
              />
              <input
                className="bg-gray-50 px-2 py-1 rounded"
                type="text"
                placeholder="Хот, аймаг"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value },
                  }))
                }
                value={userData.address?.line2 || ''}
              />
            </div>
          ) : (
            <span className="text-gray-600">
              {userData.address?.line1 || ''}<br />
              {userData.address?.line2 || ''}
            </span>
          )}
        </div>
      </div>

      {/* Үндсэн мэдээлэл */}
      <div className="mt-6">
        <h3 className="text-gray-700 font-semibold mb-2">📄 Үндсэн мэдээлэл</h3>
        <div className="grid grid-cols-[140px_1fr] gap-2">
          <span className="font-medium">Хүйс:</span>
          {isEdit ? (
            <select
              className="bg-gray-50 px-2 py-1 rounded"
              onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}
              value={userData.gender}
            >
              <option value="Not Selected">Сонгох</option>
              <option value="Male">Эрэгтэй</option>
              <option value="Female">Эмэгтэй</option>
            </select>
          ) : (
            <span>{userData.gender}</span>
          )}

          <span className="font-medium">Төрсөн огноо:</span>
          {isEdit ? (
            <input
              className="bg-gray-50 px-2 py-1 rounded"
              type="date"
              onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))}
              value={userData.dob}
            />
          ) : (
            <span>
              {userData.dob
                ? new Date(userData.dob).toLocaleDateString('mn-MN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Оруулаагүй'}
            </span>
          )}
        </div>
      </div>

      {/* Хадгалах / Засах товч */}
      <div className="mt-8 text-right">
        {isEdit ? (
          <button
            onClick={updateUserProfileData}
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Хадгалах
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="border border-blue-600 text-blue-600 px-6 py-2 rounded-full hover:bg-blue-600 hover:text-white transition"
          >
            Засах
          </button>
        )}
      </div>
    </div>
  ) : null;
};

export default MyProfile;
