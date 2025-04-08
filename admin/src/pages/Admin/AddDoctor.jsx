import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState('1 жил')
  const [fees, setFees] = useState('')
  const [about, setAbout] = useState('')
  const [speciality, setSpeciality] = useState('Ерөнхий эмч')
  const [degree, setDegree] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')

  const { backendUrl } = useContext(AppContext)
  const { aToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    if (!docImg) {
      return toast.error('Зураг сонгоогүй байна')
    }

    try {
      const formData = new FormData()
      formData.append('image', docImg)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('experience', experience)
      formData.append('fees', Number(fees))
      formData.append('about', about)
      formData.append('speciality', speciality)
      formData.append('degree', degree)
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

      const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, {
        headers: { aToken }
      })

      if (data.success) {
        toast.success(data.message)
        // Reset all fields
        setDocImg(false)
        setName('')
        setPassword('')
        setEmail('')
        setAddress1('')
        setAddress2('')
        setDegree('')
        setAbout('')
        setFees('')
        setSpeciality('Ерөнхий эмч')
        setExperience('1 жил')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-semibold">Шинэ эмч нэмэх</p>

      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        <div className="flex items-center gap-4 mb-8 text-gray-600">
          <label htmlFor="doc-img">
            <img
              className="w-16 h-16 bg-gray-100 rounded-full object-cover cursor-pointer"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt="Эмчийн зураг"
            />
          </label>
          <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
          <p>Эмчийн <br /> зургийг оруулах</p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4">

            <div className="flex flex-col gap-1">
              <p>Нэр</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Жишээ: Бат-Эрдэнэ"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p>Имэйл</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="border rounded px-3 py-2"
                type="email"
                placeholder="doctor@example.com"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p>Нууц үг</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="border rounded px-3 py-2"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p>Ажилласан жил</p>
              <select
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                className="border rounded px-2 py-2"
              >
                {["1 жил", "2 жил", "3 жил", "4 жил", "5 жил", "6 жил", "7 жил", "8 жил", "10 жил"].map((exp) => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <p>Үйлчилгээний төлбөр (₮)</p>
              <input
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                className="border rounded px-3 py-2"
                type="number"
                placeholder="Жишээ: 30000"
                required
              />
            </div>
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">

            <div className="flex flex-col gap-1">
              <p>Мэргэшил</p>
              <select
                onChange={(e) => setSpeciality(e.target.value)}
                value={speciality}
                className="border rounded px-2 py-2"
              >
                {[
                  "Клиник сэтгэл зүйч",
                  "Сэтгэцийн эмч",
                  "Хүүхдийн сэтгэл зүйч",
                  "Зан үйл судлаач",
                  "Сэтгэл засалч / зөвлөх",
                  "Гэр бүл, хосын сэтгэл зүйч"
                ].map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <p>Төгссөн сургууль / зэрэг</p>
              <input
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Жишээ: АУИС, их эмч"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p>Хаяг</p>
              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Хаяг 1"
                required
              />
              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Хаяг 2"
                required
              />
            </div>

          </div>
        </div>

        <div>
          <p className="mt-4 mb-2">Эмчийн тухай</p>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            className="w-full px-4 pt-2 border rounded"
            rows={5}
            placeholder="Эмчийн товч намтар, туршлага гэх мэт..."
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-primary hover:bg-blue-600 transition px-10 py-3 mt-4 text-white rounded-full"
        >
          Эмч нэмэх
        </button>
      </div>
    </form>
  )
}

export default AddDoctor
