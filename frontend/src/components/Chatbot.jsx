import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Сайн байна уу! Prescripto chatbot-д тавтай морил!',
      buttons: ['🧠 Тест бөглөх', '📚 Сургалт', '📞 Зөвлөгөө авах'],
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  const baseSystemMessage = {
    role: 'system',
    content: `
      You are a friendly and helpful AI chatbot that provides mental health support.
      Detect the language of the user's input. If the input is in Mongolian, respond in clear, kind, and understandable Mongolian.
      If the input is in English, respond in clear, kind, and understandable English.
      Always respond in the same language the user uses.
    `,
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async (text) => {
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setUserInput('');
    setLoading(true);

    // Quick action navigation
    if (text === '🧠 Тест бөглөх') {
      navigate('/quiz/diabetes');
      return;
    }
    if (text === '📚 Сургалт') {
      navigate('/training');
      return;
    }
    if (text === '📞 Зөвлөгөө авах') {
      navigate('/doctors');
      return;
    }

    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo',
          messages: [baseSystemMessage, ...newMessages],
        }),
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || '🤖 Хариулт ирсэнгүй.';

      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { role: 'assistant', content: '⚠️ Алдаа гарлаа. Дахин оролдоно уу.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (userInput.trim()) {
      sendMessage(userInput);
    }
  };

  const handleQuickReply = (text) => {
    sendMessage(text);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-[360px] h-[500px] bg-white shadow-xl rounded-2xl flex flex-col border border-gray-200 overflow-hidden fixed bottom-24 right-6 z-50"
    >
      {/* Header */}
      <div className="bg-indigo-500 text-white py-2 px-4 flex items-center justify-between">
        <h2 className="font-semibold text-sm">Prescripto 🤖 Chatbot</h2>
        <button onClick={onClose} className="text-white hover:text-red-300 font-bold text-lg">
          ×
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx}>
            <div
              className={`text-sm px-4 py-2 max-w-[80%] rounded-xl whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-blue-100 ml-auto text-right'
                  : 'bg-white border ml-0 text-left'
              }`}
            >
              {msg.content}
            </div>

            {/* Quick buttons */}
            {msg.buttons && (
              <div className="mt-2 flex flex-col gap-2 w-[85%]">
                {msg.buttons.map((btnText, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickReply(btnText)}
                    className="text-sm px-3 py-2 bg-gray-100 text-gray-800 rounded-md text-left border hover:bg-gray-200 transition"
                  >
                    {btnText}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="text-xs text-gray-500 animate-pulse">🤖 Хариулт бичиж байна...</div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="border-t px-3 py-2 bg-white flex items-center gap-2">
        <input
          type="text"
          className="flex-1 text-sm px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Та юу асуух вэ?"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-4 py-2 rounded-full"
        >
          Илгээх
        </button>
      </div>
    </motion.div>
  );
};

export default Chatbot;
