import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { MdStar, MdEdit, MdCheckCircle, MdLocationOn, MdClose, MdSave, MdError, MdPerson } from 'react-icons/md'
import { motion, AnimatePresence } from 'framer-motion'

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext)
  const { currency, backendUrl } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState({})

  // Loading effect for skeleton
  const [profileLoading, setProfileLoading] = useState(true)
  useEffect(() => {
    if (dToken) {
      setProfileLoading(true)
      Promise.resolve(getProfileData()).finally(() => setProfileLoading(false))
    }
  }, [dToken])

  // Validation
  const validate = () => {
    let e = {}
    if (!profileData.about?.trim()) e.about = "Танилцуулга шаардлагатай"
    if (!profileData.fees || profileData.fees <= 0) e.fees = "Төлбөр оруулна уу"
    if (!profileData.address?.line1?.trim()) e.address1 = "Хаяг 1 оруулна уу"
    setError(e)
    return Object.keys(e).length === 0
  }

  const updateProfile = async () => {
    if (!validate()) return
    setLoading(true)
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
        setSuccess(true)
        setTimeout(() => setSuccess(false), 1400)
        setIsEdit(false)
        getProfileData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
    setLoading(false)
  }

  // Skeleton loader UI
  if (profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <svg className="animate-spin mr-3" width={32} height={32} viewBox="0 0 44 44" fill="none">
          <circle cx="22" cy="22" r="20" stroke="#6366F1" strokeWidth="4" strokeLinecap="round" strokeDasharray="90 90" strokeDashoffset="0" />
        </svg>
        <span className="text-blue-400 font-semibold text-lg">Ачааллаж байна...</span>
      </div>
    )
  }

  return profileData && (
    <div className='max-w-4xl mx-auto p-2 sm:p-8'>
      <motion.div
        initial={{ y: 32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col sm:flex-row gap-8 bg-white rounded-2xl shadow-lg border border-blue-100 p-6"
      >
        {/* Зураг */}
        <div className="flex flex-col items-center gap-3 w-full sm:w-60">
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className='w-44 h-56 object-cover rounded-2xl shadow-lg border-4 border-white bg-gray-100'
            src={profileData.image}
            alt='Эмчийн зураг'
          />
          <div className='flex flex-col items-center gap-1 mt-2'>
            <span className='bg-blue-100 text-blue-600 rounded-full px-3 py-0.5 text-xs font-bold'>{profileData.speciality}</span>
            <span className='bg-green-100 text-green-600 rounded-full px-3 py-0.5 text-xs font-bold'>{profileData.experience} жил</span>
            {profileData.available &&
              <span className='flex items-center gap-1 bg-green-50 text-green-600 rounded-full px-2 py-0.5 text-xs font-bold mt-1'>
                <MdCheckCircle /> Боломжтой
              </span>
            }
          </div>
        </div>

        {/* Info section */}
        <div className='flex-1 flex flex-col gap-2'>
          <div className="flex items-start gap-2 justify-between">
            <div>
              <p className='text-2xl font-bold text-blue-700'>{profileData.name}</p>
              <p className='text-gray-500 mb-1'>{profileData.degree}</p>
            </div>
            {isEdit ? (
              <button onClick={() => setIsEdit(false)} className="text-gray-400 hover:text-red-500 ml-3"><MdClose size={22} /></button>
            ) : (
              <button onClick={() => setIsEdit(true)} className="text-blue-500 bg-blue-50 rounded-full p-2 hover:bg-blue-100 transition" title="Засах">
                <MdEdit size={22} />
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="my-1 border-t" />

          {/* Танилцуулга */}
          <div className='mt-2 mb-2'>
            <span className='flex items-center gap-1 font-medium text-gray-700 mb-1'><MdPerson /> Танилцуулга:</span>
            {isEdit ? (
              <>
                <textarea
                  onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))}
                  className={`w-full outline-primary p-2 border rounded-xl focus:ring-2 transition ${error.about ? 'border-red-400 ring-red-100' : ''}`}
                  rows={5}
                  value={profileData.about}
                  maxLength={1000}
                />
                {error.about && <span className="text-xs text-red-500 flex items-center gap-1 mt-1"><MdError /> {error.about}</span>}
              </>
            ) : (
              <p className='text-sm text-gray-600 whitespace-pre-line max-w-[700px]'>{profileData.about}</p>
            )}
          </div>

          {/* Divider */}
          <div className="border-t my-1" />

          {/* Төлбөр ба Address */}
          <div className='flex gap-6 flex-wrap items-end'>
            <div>
              <span className="flex items-center gap-1 text-gray-500 text-xs"><MdStar className="text-yellow-400" /> Үзлэгийн төлбөр:</span>
              {isEdit
                ? (
                  <>
                    <input
                      type='number'
                      min={0}
                      onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))}
                      value={profileData.fees}
                      className={`border px-2 py-1 rounded-xl mt-1 focus:ring-2 transition ${error.fees ? 'border-red-400 ring-red-100' : ''}`}
                    />
                    {error.fees && <span className="text-xs text-red-500 flex items-center gap-1 mt-1"><MdError /> {error.fees}</span>}
                  </>
                )
                : <p className="font-semibold text-gray-800 mt-1">{currency}{profileData.fees}</p>
              }
            </div>
            <div>
              <span className="flex items-center gap-1 text-gray-500 text-xs"><MdLocationOn className="text-blue-400" /> Хаяг:</span>
              {isEdit
                ? (
                  <>
                    <input
                      type='text'
                      onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                      value={profileData.address.line1}
                      className={`border px-2 py-1 rounded-xl w-full mb-2 mt-1 focus:ring-2 transition ${error.address1 ? 'border-red-400 ring-red-100' : ''}`}
                    />
                    <input
                      type='text'
                      onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                      value={profileData.address.line2}
                      className='border px-2 py-1 rounded-xl w-full'
                    />
                    {error.address1 && <span className="text-xs text-red-500 flex items-center gap-1 mt-1"><MdError /> {error.address1}</span>}
                  </>
                )
                : <p className="text-gray-800 mt-1">{profileData.address.line1}<br />{profileData.address.line2}</p>
              }
            </div>
          </div>

          {/* Боломжтой эсэх */}
          <div className='flex items-center gap-2 mt-4'>
            {isEdit
              ? <><input
                  type='checkbox'
                  onChange={() => setProfileData(prev => ({ ...prev, available: !prev.available }))}
                  checked={profileData.available}
                  className="accent-blue-500 w-5 h-5"
                /><label className='text-sm text-gray-700'>Боломжтой</label></>
              : null
            }
          </div>

          {/* Save / Cancel buttons */}
          <div className='mt-6 flex gap-3'>
            {isEdit &&
              <>
                <button
                  onClick={updateProfile}
                  disabled={loading}
                  className='flex items-center gap-1 px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition disabled:opacity-60'
                >
                  {loading ? (
                    <svg className="animate-spin mr-2" width={22} height={22} viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="20" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeDasharray="90 90" strokeDashoffset="0" /></svg>
                  ) : <MdSave />}
                  Хадгалах
                </button>
                <button
                  type="button"
                  onClick={() => setIsEdit(false)}
                  className="px-6 py-2 border border-blue-300 text-blue-600 rounded-full hover:bg-blue-50 transition"
                >
                  Цуцлах
                </button>
              </>
            }
            <AnimatePresence>
              {success &&
                <motion.span
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.85, opacity: 0 }}
                  className="ml-4 flex items-center gap-1 text-green-600 text-base font-bold bg-green-50 px-3 py-1 rounded-full shadow"
                >
                  <MdCheckCircle /> Амжилттай хадгаллаа!
                </motion.span>
              }
            </AnimatePresence>
          </div>

          {/* Үнэлгээ ба сэтгэгдэл */}
          <div className='mt-10 pt-6 border-t'>
            <p className='text-lg font-semibold text-blue-700 mb-2 flex items-center gap-2'><MdStar className="text-yellow-400" /> Үнэлгээ ба сэтгэгдэл</p>
            {profileData.reviews && profileData.reviews.length > 0 ? (
              <div className='grid md:grid-cols-2 gap-4'>
                {profileData.reviews.map((review, index) => (
                  <div key={index} className='border rounded-xl p-4 bg-gray-50 shadow-sm flex flex-col gap-1'>
                    <span className="flex items-center gap-2 font-medium text-blue-700">
                      <MdPerson className="bg-blue-100 rounded-full text-xl" /> {review.user}
                    </span>
                    <span className="text-sm text-gray-700">{review.comment}</span>
                    <span className="text-xs text-yellow-500 mt-1 flex items-center gap-1"><MdStar /> {review.rating}/5</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-sm text-gray-500'>Одоогоор сэтгэгдэл алга байна.</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default DoctorProfile
