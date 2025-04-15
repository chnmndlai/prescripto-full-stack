import React, { useState } from 'react';
import axios from 'axios';

const DiabetesQuiz = () => {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setAnswers({
      ...answers,
      [e.target.name]: parseInt(e.target.value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalScore = Object.values(answers).reduce((acc, val) => acc + val, 0);

    let riskLevel = '';
    if (totalScore <= 4) riskLevel = 'Бага';
    else if (totalScore <= 8) riskLevel = 'Дунд';
    else riskLevel = 'Өндөр';

    const displayResult =
      riskLevel === 'Бага'
        ? `✅ Таны нийт оноо: ${totalScore}. Эрсдэл бага байна.`
        : riskLevel === 'Дунд'
        ? `⚠️ Таны нийт оноо: ${totalScore}. Дунд эрсдэлтэй байна.`
        : `🚨 Таны нийт оноо: ${totalScore}. Өндөр эрсдэлтэй! Та эмчид хандаарай.`;

    setResult(displayResult);

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/quiz-results`, {
        score: totalScore,
        level: riskLevel,
        createdAt: new Date(),
        userId: localStorage.getItem('userId') || null
      });
    } catch (err) {
      console.error('Quiz хадгалах үед алдаа:', err);
    }
  };

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Чихрийн шижингийн эрсдэлийн үнэлгээ</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Асуулт 1 */}
        <div>
          <p>1. Таны нас хэд вэ?</p>
          <label><input type="radio" name="q1" value="0" onChange={handleChange} /> 40-с доош</label><br/>
          <label><input type="radio" name="q1" value="1" onChange={handleChange} /> 40–49</label><br/>
          <label><input type="radio" name="q1" value="2" onChange={handleChange} /> 50–59</label><br/>
          <label><input type="radio" name="q1" value="3" onChange={handleChange} /> 60-аас дээш</label>
        </div>

        {/* Асуулт 2 */}
        <div>
          <p>2. Таны Биеийн жингийн индекс (BMI) хэд вэ?</p>
          <label><input type="radio" name="q2" value="0" onChange={handleChange} /> &lt;25</label><br/>
          <label><input type="radio" name="q2" value="1" onChange={handleChange} /> 25–30</label><br/>
          <label><input type="radio" name="q2" value="2" onChange={handleChange} /> &gt;30</label>
        </div>

        {/* Асуулт 3 */}
        <div>
          <p>3. Та өдөр бүр дасгал хөдөлгөөн хийдэг үү?</p>
          <label><input type="radio" name="q3" value="0" onChange={handleChange} /> Тийм</label><br/>
          <label><input type="radio" name="q3" value="1" onChange={handleChange} /> Үгүй</label>
        </div>

        {/* Асуулт 4 */}
        <div>
          <p>4. Таны аав, ээж, ах дүүсээс хэн нэг нь чихрийн шижинтэй юу?</p>
          <label><input type="radio" name="q4" value="0" onChange={handleChange} /> Үгүй</label><br/>
          <label><input type="radio" name="q4" value="2" onChange={handleChange} /> Тийм</label>
        </div>

        {/* Асуулт 5 */}
        <div>
          <p>5. Таны бүсэлхийн тойрог хэд вэ?</p>
          <label><input type="radio" name="q5" value="0" onChange={handleChange} /> Эрсдэлгүй</label><br/>
          <label><input type="radio" name="q5" value="1" onChange={handleChange} /> Эрсдэлтэй</label>
        </div>

        {/* Асуулт 6 */}
        <div>
          <p>6. Таны цусны даралт өндөр үү?</p>
          <label><input type="radio" name="q6" value="0" onChange={handleChange} /> Үгүй</label><br/>
          <label><input type="radio" name="q6" value="1" onChange={handleChange} /> Тийм</label>
        </div>

        {/* Асуулт 7 */}
        <div>
          <p>7. Та чихрийн шижинтэй жирэмсэлж байсан уу?</p>
          <label><input type="radio" name="q7" value="0" onChange={handleChange} /> Үгүй</label><br/>
          <label><input type="radio" name="q7" value="1" onChange={handleChange} /> Тийм</label>
        </div>

        {/* Асуулт 8 */}
        <div>
          <p>8. Та чихрийн шижингийн урьдчилсан оноштой байсан уу?</p>
          <label><input type="radio" name="q8" value="0" onChange={handleChange} /> Үгүй</label><br/>
          <label><input type="radio" name="q8" value="2" onChange={handleChange} /> Тийм</label>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Илгээх
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 border-l-4 border-blue-500 bg-blue-50 text-blue-800 rounded shadow">
          {result}
        </div>
      )}
    </div>
  );
};

export default DiabetesQuiz;
