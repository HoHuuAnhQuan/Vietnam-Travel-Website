import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false); // Trạng thái mở/đóng
  const [messages, setMessages] = useState([
    { text: "Hello! I am VinaBot 🤖. Where would you like travel advice for today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Tự động cuộn xuống tin nhắn mới nhất
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Thêm tin nhắn của người dùng
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // 2. Gọi API Backend
      const res = await axios.post('http://localhost:5000/api/ai/chat', { message: input });
      
      // 3. Thêm phản hồi của Bot
      const botMessage = { text: res.data.reply, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { text: "Connection failed, please try again!", sender: "bot" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* --- CỬA SỔ CHAT --- */}
      {isOpen && (
        <div className="bg-white w-80 md:w-96 h-[500px] rounded-2xl shadow-2xl border border-gray-200 flex flex-col mb-4 overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-red-800 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-full">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">AI Travel Assistant</h3>
                <span className="text-xs text-yellow-200 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded transition">
              <X size={20} />
            </button>
          </div>

          {/* Nội dung Chat */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-red-600 text-white rounded-tr-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 p-3 rounded-2xl rounded-tl-none text-xs text-gray-500 italic animate-pulse">
                  VinaBot đang soạn tin...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input 
              type="text" 
              placeholder="Ask something about travel..." 
              className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition disabled:opacity-50" disabled={loading}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* --- NÚT BẬT/TẮT CHAT --- */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-red-700 text-white p-4 rounded-full shadow-lg hover:bg-red-800 transition transform hover:scale-110 flex items-center justify-center group"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        
        {/* Tooltip nhắc nhở */}
        {!isOpen && (
          <span className="absolute right-full mr-4 bg-white text-gray-800 text-xs font-bold py-2 px-3 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition duration-300">
            Ask me about traveling in Vietnam! 🤖
          </span>
        )}
      </button>
    </div>
  );
};

export default ChatBot;