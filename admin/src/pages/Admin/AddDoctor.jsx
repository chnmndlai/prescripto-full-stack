import React, { useContext, useRef, useState } from "react";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { MdVisibility, MdVisibilityOff, MdClose, MdCloudUpload } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";

const SPECIALITIES = [
  "Клиник сэтгэл зүйч",
  "Сэтгэцийн эмч",
  "Хүүхдийн сэтгэл зүйч",
  "Зан үйл судлаач",
  "Сэтгэл засалч / зөвлөх",
  "Гэр бүл, хосын сэтгэл зүйч",
  "Ерөнхий эмч",
];

const EXPERIENCES = [
  "1 жил", "2 жил", "3 жил", "4 жил", "5 жил", "6 жил", "7 жил", "8 жил", "10 жил+"
];

const AddDoctor = () => {
  // state
  const [docImg, setDocImg] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState(EXPERIENCES[0]);
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState(SPECIALITIES[0]);
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  // ux state
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // context
  const { backendUrl } = useContext(AppContext);
  const { aToken } = useContext(AdminContext);

  // ref for focus
  const nameRef = useRef(null);

  // focus on mount
  React.useEffect(() => {
    if (nameRef.current) nameRef.current.focus();
  }, []);

  // validation
  const validate = async () => {
    let e = {};
    if (!docImg) e.docImg = "Зураг оруулна уу!";
    if (!name.trim()) e.name = "Нэрээ оруулна уу!";
    if (!email.match(/^[^@]+@[^@]+\.[a-z]{2,}$/i)) e.email = "Имэйл буруу байна!";
    if (password.length < 6) e.password = "6-аас дээш тэмдэгт байх!";
    if (!fees || Number(fees) <= 0) e.fees = "Төлбөрийг зөв оруулна уу!";
    if (!degree.trim()) e.degree = "Сургууль/зэрэг оруулна уу!";
    if (!address1.trim()) e.address1 = "Хаяг 1 шаардлагатай!";
    // Unique email check (simulate)
    // e.email = await checkEmailUnique(email) ? undefined : "Имэйл бүртгэлтэй байна!";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // remove img
  const removeImg = () => setDocImg(null);

  // on submit
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!(await validate())) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append("address", JSON.stringify({ line1: address1, line2: address2 }));

      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-doctor`,
        formData,
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message || "Амжилттай нэмэгдлээ!");
        setDocImg(null);
        setName("");
        setPassword("");
        setEmail("");
        setAddress1("");
        setAddress2("");
        setDegree("");
        setAbout("");
        setFees("");
        setSpeciality(SPECIALITIES[0]);
        setExperience(EXPERIENCES[0]);
        setErrors({});
        if (nameRef.current) nameRef.current.focus();
      } else {
        toast.error(data.message || "Алдаа гарлаа!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Серверийн алдаа!");
    }
    setLoading(false);
  };

  // drag drop for img
  const onDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) setDocImg(e.dataTransfer.files[0]);
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="max-w-2xl w-full mx-auto p-6 mt-8 bg-white rounded-3xl shadow-xl border border-blue-100 animate-fadein"
      autoComplete="off"
    >
      <div className="mb-6 flex items-center gap-4">
        <div
          className={`relative group border-2 border-dashed border-blue-300 rounded-full bg-blue-50 w-24 h-24 flex items-center justify-center cursor-pointer transition hover:shadow-md`}
          onDrop={onDrop}
          onDragOver={e => e.preventDefault()}
        >
          {docImg ? (
            <>
              <img
                src={URL.createObjectURL(docImg)}
                className="object-cover w-24 h-24 rounded-full"
                alt="Doctor avatar"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-100"
                title="Зураг устгах"
                onClick={removeImg}
                tabIndex={0}
              >
                <MdClose className="text-red-500" />
              </button>
            </>
          ) : (
            <label htmlFor="doc-img" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
              <MdCloudUpload className="text-blue-400 text-3xl mb-1" />
              <span className="text-xs text-blue-400">Зураг оруулах</span>
              <input
                id="doc-img"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => setDocImg(e.target.files[0])}
              />
            </label>
          )}
        </div>
        <div>
          <p className="text-xl font-bold text-blue-700 mb-1">Шинэ эмч нэмэх</p>
          <p className="text-gray-500 text-sm">Бүх талбарыг үнэн зөв бөглөнө үү.</p>
          {errors.docImg && <span className="text-xs text-red-500">{errors.docImg}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* Left col */}
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-sm font-semibold">Нэр</label>
            <input
              ref={nameRef}
              value={name}
              onChange={e => setName(e.target.value)}
              className={`mt-1 px-3 py-2 rounded-xl border outline-none w-full ${errors.name ? "border-red-400" : "border-gray-200"} focus:ring-2 focus:ring-blue-100 transition`}
              type="text"
              placeholder="Жишээ: Бат-Эрдэнэ"
              required
            />
            {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
          </div>
          <div>
            <label className="text-sm font-semibold">Имэйл</label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={`mt-1 px-3 py-2 rounded-xl border outline-none w-full ${errors.email ? "border-red-400" : "border-gray-200"} focus:ring-2 focus:ring-blue-100 transition`}
              type="email"
              placeholder="doctor@example.com"
              required
            />
            {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
          </div>
          <div>
            <label className="text-sm font-semibold">Нууц үг</label>
            <div className="relative">
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={`mt-1 px-3 py-2 rounded-xl border outline-none w-full pr-10 ${errors.password ? "border-red-400" : "border-gray-200"} focus:ring-2 focus:ring-blue-100 transition`}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute top-3 right-3 text-gray-400 hover:text-blue-500"
                onClick={() => setShowPassword(v => !v)}
              >
                {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
              </button>
            </div>
            {errors.password && <span className="text-xs text-red-500">{errors.password}</span>}
          </div>
          <div>
            <label className="text-sm font-semibold">Ажилласан жил</label>
            <select
              value={experience}
              onChange={e => setExperience(e.target.value)}
              className="mt-1 px-3 py-2 rounded-xl border border-gray-200 w-full focus:ring-2 focus:ring-blue-100 transition"
            >
              {EXPERIENCES.map(exp => <option key={exp} value={exp}>{exp}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold">Үйлчилгээний төлбөр (₮)</label>
            <input
              value={fees}
              onChange={e => setFees(e.target.value)}
              className={`mt-1 px-3 py-2 rounded-xl border outline-none w-full ${errors.fees ? "border-red-400" : "border-gray-200"} focus:ring-2 focus:ring-blue-100 transition`}
              type="number"
              min="0"
              placeholder="Жишээ: 30000"
              required
            />
            {errors.fees && <span className="text-xs text-red-500">{errors.fees}</span>}
          </div>
        </div>

        {/* Right col */}
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-sm font-semibold">Мэргэшил</label>
            <select
              value={speciality}
              onChange={e => setSpeciality(e.target.value)}
              className="mt-1 px-3 py-2 rounded-xl border border-gray-200 w-full focus:ring-2 focus:ring-blue-100 transition"
            >
              {SPECIALITIES.map(spec => <option key={spec} value={spec}>{spec}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold">Төгссөн сургууль / зэрэг</label>
            <input
              value={degree}
              onChange={e => setDegree(e.target.value)}
              className={`mt-1 px-3 py-2 rounded-xl border outline-none w-full ${errors.degree ? "border-red-400" : "border-gray-200"} focus:ring-2 focus:ring-blue-100 transition`}
              type="text"
              placeholder="Жишээ: АУИС, их эмч"
              required
            />
            {errors.degree && <span className="text-xs text-red-500">{errors.degree}</span>}
          </div>
          <div>
            <label className="text-sm font-semibold">Хаяг</label>
            <input
              value={address1}
              onChange={e => setAddress1(e.target.value)}
              className={`mt-1 px-3 py-2 rounded-xl border outline-none w-full ${errors.address1 ? "border-red-400" : "border-gray-200"} focus:ring-2 focus:ring-blue-100 transition`}
              type="text"
              placeholder="Хаяг 1"
              required
            />
            <input
              value={address2}
              onChange={e => setAddress2(e.target.value)}
              className="mt-2 px-3 py-2 rounded-xl border border-gray-200 w-full focus:ring-2 focus:ring-blue-100 transition"
              type="text"
              placeholder="Хаяг 2"
            />
            {errors.address1 && <span className="text-xs text-red-500">{errors.address1}</span>}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="text-sm font-semibold">Эмчийн тухай</label>
        <textarea
          value={about}
          onChange={e => setAbout(e.target.value)}
          className="mt-1 px-3 py-2 rounded-xl border border-gray-200 w-full focus:ring-2 focus:ring-blue-100 transition"
          rows={4}
          placeholder="Эмчийн товч намтар, туршлага, мэргэшил, онцлог, ..."
        />
      </div>

      <button
        type="submit"
        className={`w-full py-3 rounded-xl text-white font-bold transition flex items-center justify-center gap-2
          ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-lg"}
        `}
        disabled={loading}
      >
        {loading && <FaSpinner className="animate-spin" />}
        Эмч нэмэх
      </button>
    </form>
  );
};

export default AddDoctor;
