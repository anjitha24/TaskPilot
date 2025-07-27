import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am TaskPilot AI. How can I help you with your projects today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } }; // This needs to be passed
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // ✅ FIXED: Added the 'authHeader' to the API call
      const res = await axios.post('http://localhost:8000/api/chat', { message: input }, authHeader);
      const botMessage = { sender: 'bot', text: res.data.reply };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = { sender: 'bot', text: 'Sorry, I am having trouble connecting. Please try again later.' };
      setMessages(prev => [...prev, errorMessage]);
      console.error("Chatbot error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .chatbot-container { position: fixed; bottom: 20px; right: 20px; z-index: 1000; }
        .chat-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white; border: none; border-radius: 50%; width: 60px; height: 60px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3); font-size: 28px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.3s ease;
        }
        .chat-button:hover { transform: scale(1.1); }
        .chat-window {
          position: fixed; bottom: 90px; right: 20px;
          width: 370px; height: 500px;
          background: rgba(15, 15, 35, 0.8);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          display: flex; flex-direction: column;
          overflow: hidden;
          animation: slideInUp 0.4s ease;
        }
        .chat-header { padding: 15px; background: rgba(0,0,0,0.2); color: white; font-weight: 600; text-align: center; }
        .messages-area { flex-grow: 1; padding: 15px; overflow-y: auto; color: white; }
        .message { margin-bottom: 15px; display: flex; flex-direction: column; }
        .message.user { align-items: flex-end; }
        .message.bot { align-items: flex-start; }
        .message-bubble {
          padding: 10px 15px; border-radius: 18px; max-width: 80%;
          line-height: 1.5;
        }
        .message.user .message-bubble { background: #1976d2; color: white; border-bottom-right-radius: 5px; }
        .message.bot .message-bubble { background: #333; color: white; border-bottom-left-radius: 5px; }
        .chat-input-form { display: flex; padding: 10px; border-top: 1px solid rgba(255, 255, 255, 0.1); }
        .chat-input {
          flex-grow: 1; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2);
          border-radius: 20px; color: white; padding: 10px 15px; font-size: 1rem;
        }
        .chat-input:focus { outline: none; border-color: #a8a8ff; }
        .send-btn {
          background: #1976d2; color: white; border: none; border-radius: 50%;
          width: 40px; height: 40px; margin-left: 10px; font-size: 20px;
          cursor: pointer;
        }
        @keyframes slideInUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
      <div className="chatbot-container">
        {isOpen && (
          <div className="chat-window">
            <div className="chat-header">TaskPilot AI</div>
            <div className="messages-area">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}`}>
                  <div className="message-bubble">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              ))}
              {isLoading && <div className="message bot"><div className="message-bubble">...</div></div>}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="chat-input-form">
              <input
                type="text"
                className="chat-input"
                placeholder="Ask about your projects..."
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <button type="submit" className="send-btn">➤</button>
            </form>
          </div>
        )}
        <button className="chat-button" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? '✕' : '🤖'}
        </button>
      </div>
    </>
  );
};

export default Chatbot;