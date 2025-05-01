import React, { useState } from 'react';

const questions = [
  {
    question: 'Би инээмсэглэх, хөгжилдөх зүйлд баярлах боломжтой байсан уу?',
    options: [
      { text: 'Тийм, үргэлж.', score: 0 },
      { text: 'Заримдаа, яг урьдын адил.', score: 1 },
      { text: 'Тийм ч их биш.', score: 2 },
      { text: 'Огт баярлаж чадаагүй.', score: 3 },
    ],
  },
  {
    question: 'Би ирээдүйдээ итгэлтэй байсан уу?',
    options: [
      { text: 'Тийм, урьдын адил.', score: 0 },
      { text: 'Бага зэрэг эргэлзэж байсан.', score: 1 },
      { text: 'Маш ихээр санаа зовсон.', score: 2 },
      { text: 'Ирээдүйгээс маш их айж байсан.', score: 3 },
    ],
  },
  {
    question: 'Би өөрийгөө хэрэггүй хүн мэт мэдэрсэн үү?',
    options: [
      { text: 'Үгүй, огт тэгж мэдрээгүй.', score: 0 },
      { text: 'Заримдаа мэдэрсэн.', score: 1 },
      { text: 'Ихэнх үед мэдэрсэн.', score: 2 },
      { text: 'Үргэлж мэдэрч байсан.', score: 3 },
    ],
  },
  {
    question: 'Би юу ч хийхээс цуцаж, залхуурсан уу?',
    options: [
      { text: 'Үгүй, урьдын адил эрч хүчтэй байсан.', score: 0 },
      { text: 'Заримдаа бага зэрэг цуцсан.', score: 1 },
      { text: 'Ихэнх үед залхуурч байсан.', score: 2 },
      { text: 'Огт юу ч хийж чадахгүй байсан.', score: 3 },
    ],
  },
  {
    question: 'Би ямар нэг зүйлд өөрийгөө буруутгасан уу?',
    options: [
      { text: 'Үгүй, ерөөсөө.', score: 0 },
      { text: 'Заримдаа өөрийгөө буруутгасан.', score: 1 },
      { text: 'Маш ихээр өөрийгөө буруутгасан.', score: 2 },
      { text: 'Байнга өөрийгөө зэмлэсэн.', score: 3 },
    ],
  },
  {
    question: 'Би ямар нэгэн зүйлд айдас, сандрал мэдэрсэн үү?',
    options: [
      { text: 'Үгүй, тайван байсан.', score: 0 },
      { text: 'Хааяа бага зэрэг айсан.', score: 1 },
      { text: 'Ихэвчлэн айж байсан.', score: 2 },
      { text: 'Үргэлж түгшиж байсан.', score: 3 },
    ],
  },
  {
    question: 'Би унтаж амрахад хүндрэлтэй байсан уу? (Хүүхэдтэй холбоогүй шалтгаанаар)',
    options: [
      { text: 'Үгүй, унтахад асуудалгүй байсан.', score: 0 },
      { text: 'Хааяа бага зэрэг хүндрэлтэй байсан.', score: 1 },
      { text: 'Ихэвчлэн унтаж чадахгүй байсан.', score: 2 },
      { text: 'Бараг огт унтаж чадаагүй.', score: 3 },
    ],
  },
  {
    question: 'Би уйлмаар эсвэл нулимс гармаар санагдсан уу?',
    options: [
      { text: 'Үгүй, ерөөсөө.', score: 0 },
      { text: 'Заримдаа уйлсан.', score: 1 },
      { text: 'Ихэнх үед уйлсан.', score: 2 },
      { text: 'Өдөр бүр уйлж байсан.', score: 3 },
    ],
  },
  {
    question: 'Би уурлах, уцаарлах мэдрэмж төрсөн үү?',
    options: [
      { text: 'Үгүй, ердийн байдлаар тайван байсан.', score: 0 },
      { text: 'Хааяа бага зэрэг уурласан.', score: 1 },
      { text: 'Ихэнх үед уурласан.', score: 2 },
      { text: 'Үргэлж уурлаж бухимдсан.', score: 3 },
    ],
  },
  {
    question: 'Өөрийгөө эсвэл хүүхдээ гэмтээх тухай бодол төрсөн үү?',
    options: [
      { text: 'Үгүй, ерөөсөө.', score: 0 },
      { text: 'Хааяа бага зэрэг бодсон.', score: 1 },
      { text: 'Ихэнхдээ ийм бодол орж ирсэн.', score: 2 },
      { text: 'Үргэлж ийм бодолтой байсан.', score: 3 },
    ],
  },
];

const PostpartumQuiz = () => {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState('');

  const handleChange = (qIndex, score) => {
    setAnswers({ ...answers, [qIndex]: score });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(answers).length !== questions.length) {
      alert('Бүх асуултад хариулна уу!');
      return;
    }
    const totalScore = Object.values(answers).reduce((acc, val) => acc + val, 0);

    if (totalScore <= 9) {
      setResult('Энгийн ядрал, сэтгэл санааны түр зуурын өөрчлөлт.');
    } else if (totalScore <= 12) {
      setResult('Боломжит сэтгэл гутрал, анхааралтай ажиглах хэрэгтэй.');
    } else {
      setResult('Сэтгэл гутрал байж болзошгүй, заавал сэтгэл зүйч эсвэл эмчид хандаарай.');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Төрсний дараах сэтгэл гутрал илрүүлэх сорил</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q, idx) => (
          <div key={idx} className="bg-white shadow rounded-lg p-4">
            <p className="font-semibold mb-3">{idx + 1}. {q.question}</p>
            <div className="space-y-2">
              {q.options.map((option, oidx) => (
                <label key={oidx} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${idx}`}
                    value={option.score}
                    onChange={() => handleChange(idx, option.score)}
                    className="text-blue-500 focus:ring-primary"
                  />
                  <span className="text-gray-700">{option.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        <button
          type="submit"
          className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition"
        >
          Илгээх
        </button>
      </form>

      {result && (
        <div className="mt-8 p-4 bg-green-100 border border-green-400 rounded-lg text-green-700 text-center">
          {result}
        </div>
      )}
    </div>
  );
};

export default PostpartumQuiz;
