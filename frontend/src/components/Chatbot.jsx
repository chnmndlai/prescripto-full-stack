import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaPaperPlane, FaBroom, FaChevronDown, FaChevronUp, FaRegSmile, FaRobot, FaBolt, FaGraduationCap, FaPhoneAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Typing animation component
const TypingDots = () => (
  <span className="inline-flex gap-1 pl-2 align-middle">
    <span className="dot bg-gray-400" />
    <span className="dot bg-gray-400" style={{ animationDelay: '0.2s' }} />
    <span className="dot bg-gray-400" style={{ animationDelay: '0.4s' }} />
    <style>{`
      .dot {
        display: inline-block;
        width: 6px; height: 6px;
        border-radius: 50%;
        margin-right: 2px;
        animation: blink 1s infinite;
        vertical-align: middle;
      }
      @keyframes blink {
        0%, 80%, 100% { opacity: 0.25; }
        40% { opacity: 1; }
      }
    `}</style>
  </span>
);

// Quick Reply Icon
const quickReplyIcon = text => {
  if (text.includes("Тест")) return <FaBolt className="mr-2" />;
  if (text.includes("Сургалт")) return <FaGraduationCap className="mr-2" />;
  if (text.includes("Зөвлөгөө")) return <FaPhoneAlt className="mr-2" />;
  return <FaRegSmile className="mr-2" />;
};

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatlog');
    return saved
      ? JSON.parse(saved)
      : [
        {
          role: 'assistant',
          content: '👋 Сайн байна уу! Prescripto chatbot-д тавтай морил!',
          buttons: ['🧠 Тест бөглөх', '📚 Сургалт', '📞 Зөвлөгөө авах'],
        },
      ];
  });

  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Online status mock
  const [online, setOnline] = useState(true);

  // Escape key to close
  useEffect(() => {
    const escHandler = e => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', escHandler);
    return () => window.removeEventListener('keydown', escHandler);
  }, [onClose]);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, minimized]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('chatlog', JSON.stringify(messages));
  }, [messages]);

  // History clear
  const handleClearHistory = () => {
    setMessages([
      {
        role: 'assistant',
        content: '👋 Сайн байна уу! Prescripto chatbot-д тавтай морил!',
        buttons: ['🧠 Тест бөглөх', '📚 Сургалт', '📞 Зөвлөгөө авах'],
      }
    ]);
    setUserInput('');
  };

  // API system message
  const baseSystemMessage = {
    role: 'system',
    content: `
      You are a friendly and helpful AI chatbot that provides mental health support.
      Detect the language of the user's input. If the input is in Mongolian, respond in clear, kind, and understandable Mongolian.
      If the input is in English, respond in clear, kind, and understandable English.
      Always respond in the same language the user uses.
    `,
  };

  // Handle message send
  const sendMessage = async (text) => {
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setUserInput('');
    setLoading(true);

    // Quick reply routing
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
      setMessages([
        ...newMessages,
        { role: 'assistant', content: '⚠️ Алдаа гарлаа. Дахин оролдоно уу.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = useCallback(() => {
    if (userInput.trim()) sendMessage(userInput);
  }, [userInput, messages]);

  // Accessibility: autoFocus & shadow
  const [inputFocused, setInputFocused] = useState(false);

  // Minimize handler
  if (minimized) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.6 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 32, scale: 0.7 }}
        className="fixed bottom-24 right-6 z-50 shadow-2xl"
      >
        <button
          className="flex items-center gap-3 bg-indigo-700 text-white rounded-full px-6 py-3 shadow-lg border border-indigo-300 text-lg font-bold hover:bg-indigo-800 transition"
          aria-label="Чат нээх"
          onClick={() => setMinimized(false)}
        >
          <FaRobot size={22} className="animate-bounce" />
          Prescripto chatbot
          <FaChevronUp className="ml-1" />
        </button>
      </motion.div>
    );
  }

  // Render
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.97 }}
      transition={{ duration: 0.26, type: 'spring', stiffness: 180 }}
      className="
        w-[370px] max-w-full h-[520px] bg-white rounded-3xl border border-gray-100 shadow-2xl flex flex-col
        overflow-hidden fixed bottom-24 right-6 z-50"
      style={{
        boxShadow: '0 8px 32px 0 rgba(32,45,100,0.19), 0 2px 8px rgba(64,64,110,0.09)',
        backdropFilter: 'blur(10px)',
      }}
      tabIndex={0}
      aria-label="Prescripto chatbot popup"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-500 text-white py-3 px-5 flex items-center justify-between rounded-t-3xl shadow sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl animate-spin-slow">
            🤖
          </span>
          <span className="font-bold">Prescripto</span>
          <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold 
            ${online ? 'bg-green-500/80 text-white' : 'bg-gray-300 text-gray-600'}`}>
            {online ? 'Онлайн' : 'Оффлайн'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMinimized(true)}
            title="Жижигрүүлэх"
            className="text-white/80 hover:text-white px-2 text-xl focus:outline-none"
            tabIndex={0}
          >
            <FaChevronDown />
          </button>
          <button
            onClick={onClose}
            className="text-white hover:text-red-200 font-bold text-2xl leading-none transition"
            title="Хаах"
            aria-label="Чат хаах"
            tabIndex={0}
          >
            ×
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 bg-gradient-to-b from-gray-50 to-white" tabIndex={0}>
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} mb-4`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.18 }}
            >
              <div
                className={`
                  px-5 py-2 max-w-[87%] text-[15px] rounded-2xl shadow-md
                  whitespace-pre-line break-words transition-all
                  ${msg.role === 'user'
                    ? 'bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-medium shadow-lg rounded-br-lg'
                    : 'bg-white/80 text-gray-900 shadow border border-gray-100 backdrop-blur rounded-bl-lg'
                  }
                `}
                style={{
                  borderTopLeftRadius: '1.7rem',
                  borderTopRightRadius: '1.7rem',
                  borderBottomLeftRadius: msg.role === 'user' ? '1.7rem' : '0.7rem',
                  borderBottomRightRadius: msg.role === 'user' ? '0.7rem' : '1.7rem',
                  marginLeft: msg.role === 'user' ? 'auto' : 0,
                  marginRight: msg.role === 'user' ? 0 : 'auto',
                  fontWeight: msg.role === 'assistant' && idx === 0 ? '500' : undefined,
                  fontSize: msg.role === 'assistant' && idx === 0 ? '16px' : undefined,
                }}
              >
                {msg.content}
              </div>
              {/* Quick Reply Buttons */}
              {msg.buttons && (
                <div className="mt-3 flex flex-row flex-wrap gap-2">
                  {msg.buttons.map((btnText, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickReply(btnText)}
                      className="
                        px-5 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold rounded-full shadow
                        flex items-center gap-2 hover:bg-indigo-100 hover:text-indigo-900 transition text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300
                      "
                      tabIndex={0}
                      aria-label={btnText}
                    >
                      {quickReplyIcon(btnText)}
                      {btnText}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="text-xs text-gray-500 flex items-center gap-1 mt-2 ml-2 animate-pulse">
            <FaRobot className="text-indigo-400" />
            Хариулт бичиж байна <TypingDots />
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="border-t px-3 py-3 bg-white flex items-center gap-2 relative">
        <input
          ref={inputRef}
          type="text"
          className={`flex-1 text-[15px] px-4 py-2 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 transition-all duration-200
            ${inputFocused ? 'focus:ring-indigo-400 ring-2 ring-indigo-200 shadow-lg' : ''}
          `}
          placeholder="Та юу асуух вэ?"
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          tabIndex={0}
          aria-label="Чат бичих"
          autoFocus
          maxLength={512}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="
            bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 px-5 py-2 rounded-full shadow-lg
            transition disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-indigo-400
          "
          style={{ boxShadow: '0 2px 10px 0 #8a63d252' }}
          aria-label="Илгээх"
          tabIndex={0}
        >
          <FaPaperPlane size={18} className="opacity-85" />
          Илгээх
        </button>
        {/* Clear history button */}
        <button
          className="absolute right-20 top-3 text-indigo-400 hover:text-red-400 transition text-lg"
          onClick={handleClearHistory}
          title="Түүх цэвэрлэх"
          aria-label="Чат түүх цэвэрлэх"
          tabIndex={0}
        >
          <FaBroom />
        </button>
      </div>
    </motion.div>
  );

  // Quick reply shortcut
  function handleQuickReply(text) {
    sendMessage(text);
  }
};

export default Chatbot;
