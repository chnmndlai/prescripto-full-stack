import React, { useState, useRef, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '👋 Сайн байна уу! Би таны сэтгэлзүйн туслах chatbot байна. Юу мэдэхийг хүсэж байна вэ?' }
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);

    const botReply = getBotReply(input);
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    }, 600);

    setInput('');
  };

  const getBotReply = (message) => {
    const msg = message.toLowerCase();
    if (msg.includes('сэтгэл')) return '🧠 Сэтгэл гутрал олон хүчин зүйлээс шалтгаалж болно. Та илүү дэлгэрэнгүй хуваалцаж болох уу?';
    if (msg.includes('тест')) return '📋 Манай тест таны сэтгэлзүйн байдалд үнэлгээ өгнө. Та сонирхож байна уу?';
    return '🤖 Таны асуултыг ойлголоо. Илүү дэлгэрэнгүй мэдээлэл өгвөл би туслахад бэлэн!';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-[360px] h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 fixed bottom-24 right-6 z-50 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-4 py-3 shadow">
        <h3 className="font-semibold text-sm">Prescripto 🤖 Chatbot</h3>
        <button onClick={onClose}>
          <FiX className="text-lg hover:text-red-300 transition" />
        </button>
      </div>

      {/* Message area */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap shadow ${
              msg.sender === 'user'
                ? 'ml-auto bg-blue-100 text-right text-gray-800'
                : 'mr-auto bg-white text-gray-800 border'
            }`}
          >
            {msg.text}
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t bg-white flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Та юу асуух вэ?"
          className="flex-1 px-4 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 text-sm rounded-full font-medium"
        >
          Илгээх
        </button>
      </form>
    </motion.div>
  );
};

export default Chatbot;
