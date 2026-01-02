import React, { useState } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import '../App.css';

const AIChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi there! I'm your Maintenance Assistant. How can I help you today?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newUserMessage = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');

        // Simulate AI response
        setTimeout(() => {
            const responses = [
                "I can help you track maintenance requests.",
                "To report a broken machine, go to the Equipment page.",
                "Check the dashboard for active work orders.",
                "I'm currently in demo mode, but I'm learning fast!",
                "That sounds important. Let me log that for you."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            const newBotMessage = { id: Date.now() + 1, text: randomResponse, sender: 'bot' };
            setMessages(prev => [...prev, newBotMessage]);
        }, 1000);
    };

    return (
        <div className="ai-chat-widget">
            {!isOpen && (
                <button className="chat-toggle-btn" onClick={toggleChat}>
                    <MessageCircle size={24} />
                    <span>Chat with AI</span>
                </button>
            )}

            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <div className="chat-title">
                            <Bot size={20} />
                            <span>Maintenance Assistant</span>
                        </div>
                        <button className="chat-close-btn" onClick={toggleChat}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`message ${msg.sender}`}>
                                {msg.sender === 'bot' && <div className="avatar bot"><Bot size={14} /></div>}
                                <div className="message-content">{msg.text}</div>
                                {msg.sender === 'user' && <div className="avatar user"><User size={14} /></div>}
                            </div>
                        ))}
                    </div>

                    <form className="chat-input-form" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type your message..."
                            className="chat-input"
                        />
                        <button type="submit" className="chat-send-btn">
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}

            <style>{`
                .ai-chat-widget {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 9999;
                    font-family: 'Outfit', sans-serif;
                }

                .chat-toggle-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 9999px;
                    font-weight: 600;
                    cursor: pointer;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    transition: all 0.2s;
                }

                .chat-toggle-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                    background: var(--primary-hover);
                }

                .chat-window {
                    width: 350px;
                    height: 500px;
                    background: var(--bg-secondary);
                    border-radius: 16px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    display: flex;
                    flex-direction: column;
                    border: 1px solid var(--border-color);
                    overflow: hidden;
                    animation: slideUp 0.3s ease-out;
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .chat-header {
                    padding: 16px;
                    background: var(--primary-color);
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .chat-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 600;
                }

                .chat-close-btn {
                    background: transparent;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .chat-close-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                .chat-messages {
                    flex-grow: 1;
                    padding: 16px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    background: var(--bg-primary);
                }

                .message {
                    display: flex;
                    align-items: flex-end;
                    gap: 8px;
                    max-width: 85%;
                }

                .message.user {
                    align-self: flex-end;
                    flex-direction: row-reverse; /* Avatar on right */
                }

                .message.bot {
                    align-self: flex-start;
                }

                .avatar {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .avatar.bot {
                    background: #e0e7ff;
                    color: #4f46e5;
                }
                
                .dark-mode .avatar.bot {
                    background: #312e81;
                    color: #818cf8;
                }

                .avatar.user {
                    background: #f1f5f9;
                    color: #64748b;
                }
                
                .dark-mode .avatar.user {
                    background: #334155;
                    color: #94a3b8;
                }

                .message-content {
                    padding: 8px 12px;
                    border-radius: 12px;
                    font-size: 0.9rem;
                    line-height: 1.4;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }

                .message.bot .message-content {
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                    border: 1px solid var(--border-color);
                    border-bottom-left-radius: 4px;
                }

                .message.user .message-content {
                    background: var(--primary-color);
                    color: white;
                    border-bottom-right-radius: 4px;
                }

                .chat-input-form {
                    padding: 12px;
                    background: var(--bg-secondary);
                    border-top: 1px solid var(--border-color);
                    display: flex;
                    gap: 8px;
                }

                .chat-input {
                    flex-grow: 1;
                    padding: 8px 12px;
                    border-radius: 20px;
                    border: 1px solid var(--border-color);
                    background: var(--bg-primary);
                    color: var(--text-primary);
                    font-size: 0.9rem;
                    outline: none;
                }

                .chat-input:focus {
                    border-color: var(--primary-color);
                }

                .chat-send-btn {
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                .chat-send-btn:hover {
                    background: var(--primary-hover);
                }
            `}</style>
        </div>
    );
};

export default AIChatWidget;
