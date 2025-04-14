import React, { useState, useContext } from 'react';
import axios from 'axios';
import { DoctorContext } from '../../context/DoctorContext';

const AddAdvice = () => {
  const { dToken } = useContext(DoctorContext);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🔵 Submitting...");
    console.log("title:", title);
    console.log("summary:", summary);
    console.log("image:", image);
    console.log("token:", dToken);
    console.log("API:", import.meta.env.VITE_BACKEND_URL);

    if (!title || !summary || !image) {
      alert('Гарчиг, агуулга, зураг гурвын аль нэг нь дутуу байна.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('summary', summary);
    formData.append('image', image);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/advice/create`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${dToken}`,
          },
        }
      );

      console.log("✅ Response:", res.data);

      if (res.data.success) {
        alert('✅ Зөвлөгөө амжилттай нэмэгдлээ.');
        setTitle('');
        setSummary('');
        setImage(null);
        document.getElementById('adviceImageInput').value = null;
        window.location.href = '/advice'; // 📌 Redirect to public advice view
      } else {
        alert(res.data.message || 'Амжилтгүй боллоо.');
      }
    } catch (err) {
      console.error('❌ Advice нэмэхэд алдаа:', err);
      if (err.response) {
        alert(`❌ Сервер хариу: ${err.response.data.message}`);
      } else {
        alert('❌ Сүлжээний алдаа эсвэл сервер холбогдсонгүй.');
      }
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">🩺 Зөвлөгөө нэмэх</h2>
      <form onSubmit={handleSubmit} className="bg-blue-50 p-5 rounded space-y-3">
        <input
          type="text"
          placeholder="Гарчиг оруулна уу"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Агуулгыг оруулна уу"
          className="w-full p-2 border rounded h-28"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />

        <input
          id="adviceImageInput"
          name="image"
          type="file"
          accept="image/*"
          className="w-full"
          onChange={(e) => setImage(e.target.files[0])}
        />

        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            className="w-48 mt-2 rounded shadow"
          />
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Нэмэх
        </button>
      </form>
    </div>
  );
};

export default AddAdvice;
