import React from 'react'
import { Link } from 'react-router-dom'
import quizDiabetes from '../assets/quiz-diabetes.png'
import quizElderly from '../assets/quiz-elderly.png'
import quizPostpartum from '../assets/quiz-postpartum.png'
const quizzes = [
  {
    id: 'diabetes',
    title: 'ЧИХРИЙН ШИЖИН ӨВЧНИЙ ЭРСДЭЛ ҮНЭЛЭХ АСУУМЖ',
    description: 'Та 60 хан секунд зарцуулан өөрийн болон хайртай дотны хүмүүсийнхээ амьдралыг хамгаалаарай.',
    date: '2022-05-27',
    image: quizDiabetes,
  },
  {
    id: 'elderly-depression',
    title: 'НАСТНЫ СЭТГЭЛ ГУТРАЛ ИЛРҮҮЛЭХ СОРИЛ',
    description: 'Настны сэтгэл гутралыг хурдавчилсан аргаар оношлоход зориулагдсан сорил.',
    date: '2022-05-31',
    image: quizElderly,
  },
  {
    id: 'postpartum',
    title: 'ТӨРСНИЙ ДАРААХ СЭТГЭЛ ГУТРАЛ ИЛРҮҮЛЭХ',
    description: 'Эдинбургийн сорил нь жирэмсний болон төрсний дараах сэтгэл гутралын сорил юм.',
    date: '2022-06-16',
    image: quizPostpartum,
  },
]

const QuizList = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">🧠 Сэтгэлзүйн сорилууд</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white border rounded-lg shadow hover:shadow-lg transition">
            <img src={quiz.image} alt={quiz.title} className="w-full h-48 object-cover rounded-t-lg" />
            <div className="p-4">
              <h2 className="font-bold text-lg">{quiz.title}</h2>
              <p className="text-gray-600 text-sm mt-2">{quiz.description}</p>
              <div className="flex justify-between items-center mt-4">
                <Link
                  to={`/quiz/${quiz.id}`}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Бөглөх
                </Link>
                <span className="text-blue-500 text-sm">{quiz.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuizList
