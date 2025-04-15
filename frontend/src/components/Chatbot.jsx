import React, { useState, useRef, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

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
    if (message.includes('сэтгэл')) return '🧠 Сэтгэл гутрал олон хүчин зүйлээс шалтгаалж болно. Та илүү дэлгэрэнгүй хуваалцаж болох уу?';
    if (message.includes('тест')) return '📋 Манай тест таны сэтгэлзүйн байдалд үнэлгээ өгнө. Та сонирхож байна уу?';
    return '🤖 Таны асуултыг ойлголоо. Илүү дэлгэрэнгүй мэдээлэл өгвөл би туслахад бэлэн!';
  };

  return (
    <div className="w-[360px] h-[520px] bg-white rounded-2xl shadow-xl border border-gray-200 relative flex flex-col overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-3">
        <h3 className="font-semibold text-sm">Prescripto 🤖 Chatbot</h3>
        <button onClick={onClose}>
          <FiX className="text-lg hover:text-red-300" />
        </button>
      </div>

      {/* Message Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[80%] p-2 px-3 rounded-lg text-sm whitespace-pre-wrap ${
              msg.sender === 'user'
                ? 'ml-auto bg-blue-100 text-right'
                : 'mr-auto bg-white border text-gray-800'
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-3 border-t bg-white flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Та юу асуух вэ?"
          className="flex-1 px-3 py-2 text-sm border rounded-full focus:outline-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 text-sm rounded-full hover:bg-blue-700"
        >
          Илгээх
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
