import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext)
  const { currency, backendUrl } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)

  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        about: profileData.about,
        available: profileData.available
      }

      const { data } = await axios.post(
        backendUrl + '/api/doctor/update-profile',
        updateData,
        { headers: { Authorization: `Bearer ${dToken}` } }
      )

      if (data.success) {
        toast.success(data.message)
        setIsEdit(false)
        getProfileData()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  }

  useEffect(() => {
    if (dToken) {
      getProfileData()
    }
  }, [dToken])

  return profileData && (
    <div className='m-5'>
      <div className='flex flex-col gap-4'>
        {/* Эмчийн зураг */}
        <div>
  <img
    className='w-48 aspect-[3/4] object-cover rounded-xl shadow-md'
    src={profileData.image}
    alt='Эмчийн зураг'
  />
</div>


        {/* Үндсэн мэдээлэл */}
        <div className='flex-1 border border-gray-100 rounded-xl p-8 py-7 bg-white'>
          <p className='flex items-center gap-2 text-3xl font-semibold text-gray-800'>{profileData.name}</p>
          <div className='flex items-center gap-2 mt-1 text-gray-600'>
            <p>{profileData.degree} - {profileData.speciality}</p>
            <span className='py-0.5 px-2 bg-blue-100 text-blue-700 text-xs rounded-full'>{profileData.experience} жил</span>
          </div>

          {/* Танилцуулга */}
          <div className='mt-4'>
            <p className='text-sm font-medium text-gray-700 mb-1'>Танилцуулга:</p>
            {
              isEdit
                ? <textarea onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))} className='w-full outline-primary p-2 border rounded' rows={6} value={profileData.about} />
                : <p className='text-sm text-gray-600 whitespace-pre-line max-w-[700px]'>{profileData.about}</p>
            }
          </div>

          {/* Төлбөр */}
          <div className='mt-4'>
            <p className='text-sm font-medium text-gray-700 mb-1'>Үзлэгийн төлбөр:</p>
            {
              isEdit
                ? <input type='number' onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))} value={profileData.fees} className='border px-2 py-1 rounded' />
                : <p className='text-gray-800 font-semibold'>₮ {profileData.fees}</p>
            }
          </div>

          {/* Хаяг */}
          <div className='mt-4'>
            <p className='text-sm font-medium text-gray-700 mb-1'>Хаяг:</p>
            <div className='text-sm text-gray-600'>
              {
                isEdit
                  ? (
                    <>
                      <input type='text' onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={profileData.address.line1} className='border px-2 py-1 rounded w-full mb-2' />
                      <input type='text' onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={profileData.address.line2} className='border px-2 py-1 rounded w-full' />
                    </>
                  )
                  : (
                    <>
                      <p>{profileData.address.line1}</p>
                      <p>{profileData.address.line2}</p>
                    </>
                  )
              }
            </div>
          </div>

          {/* Боломжтой эсэх */}
          <div className='flex items-center gap-2 mt-4'>
            {
              isEdit
                ? <input
                    type='checkbox'
                    onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))}
                    checked={profileData.available}
                  />
                : <p className='text-green-600 text-sm font-medium'>✅ Боломжтой</p>
            }
            {isEdit && <label className='text-sm text-gray-700'>Боломжтой</label>}
          </div>

          {/* Товчлуурууд */}
          <div className='mt-6'>
            {
              isEdit
                ? <button onClick={updateProfile} className='px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition'>💾 Хадгалах</button>
                : <button onClick={() => setIsEdit(true)} className='px-6 py-2 border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition'>✏️ Засах</button>
            }
          </div>

          {/* Үнэлгээ ба сэтгэгдэл */}
          <div className='mt-10 pt-6 border-t'>
            <p className='text-lg font-semibold text-gray-800 mb-2'>💬 Үнэлгээ ба сэтгэгдэл</p>
            {
              profileData.reviews && profileData.reviews.length > 0 ? (
                <div className='space-y-4'>
                  {profileData.reviews.map((review, index) => (
                    <div key={index} className='border rounded-lg p-4 bg-gray-50 shadow-sm'>
                      <p className='text-sm text-gray-800 font-medium'>{review.user}</p>
                      <p className='text-sm text-gray-600 mt-1'>{review.comment}</p>
                      <p className='text-xs text-yellow-500 mt-1'>⭐ {review.rating}/5</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-sm text-gray-500'>Одоогоор сэтгэгдэл алга байна.</p>
              )
            }
          </div>

        </div>
      </div>
    </div>
  )
}

export default DoctorProfile
