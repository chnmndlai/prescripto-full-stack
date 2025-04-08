import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const quizData = {
  diabetes: {
    title: 'Чихрийн шижин өвчний эрсдэлийг үнэлэх асуумж',
    questions: [
      'Таны гэр бүлд чихрийн шижин өвчтэй хүн байдаг уу?',
      'Та сүүлийн үед хэт их шингэн уудаг болсон уу?',
      'Та сүүлийн 1 жилд 5 кг-аас их жин хаясан уу?',
    ],
  },
  postpartum: {
    title: 'Төрсний дараах сэтгэл гутралыг илрүүлэх сорил',
    questions: [
      'Танд уйтгар гуниг, сэтгэлээр унах мэдрэмж төрж байна уу?',
      'Хүүхдээ харж байхдаа өөрийгөө буруутгах мэдрэмж төрдөг үү?',
      'Та хангалттай амарч чадахгүй байна уу?',
    ],
  },
  'elderly-depression': {
    title: 'Настны сэтгэл гутрал илрүүлэх сорил',
    questions: [
      'Та амьдралын утга учиргүй мэт санагдаж байна уу?',
      'Та сэтгэл дундуур байдалтай олон өдөр өнгөрөөж байна уу?',
      'Сүүлийн үед хов хоосон мэдрэмж давамгайлж байна уу?',
    ],
  },
}

const QuizDetail = () => {
  const { id } = useParams()
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const quiz = quizData[id]

  const handleChange = (index, value) => {
    setAnswers({ ...answers, [index]: value })
  }

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/quiz/submit', {
        answers,
        userId: 'USER_ID', // Хэрэглэгчийн context-оос авна
        quizType: id,
      })
      setSubmitted(true)
    } catch (err) {
      console.error('Хадгалахад алдаа:', err)
    }
  }

  if (!quiz) return <div>Тест олдсонгүй.</div>
  if (submitted) return <div>Баярлалаа! Таны тест илгээгдлээ.</div>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">{quiz.title}</h1>
      {quiz.questions.map((q, i) => (
        <div key={i} className="mb-4">
          <p>{q}</p>
          <div className="flex gap-4 mt-1">
            <label>
              <input
                type="radio"
                name={`q${i}`}
                onChange={() => handleChange(i, 'Тийм')}
              />{' '}
              Тийм
            </label>
            <label>
              <input
                type="radio"
                name={`q${i}`}
                onChange={() => handleChange(i, 'Үгүй')}
              />{' '}
              Үгүй
            </label>
          </div>
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
      >
        Илгээх
      </button>
    </div>
  )
}

export default QuizDetail
