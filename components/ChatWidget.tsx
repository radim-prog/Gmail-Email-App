import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Mic, X, Minimize2, Maximize2 } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatWidgetProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isProcessing: boolean;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ messages, onSendMessage, isProcessing }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;
    onSendMessage(inputValue);
    setInputValue("");
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-105 z-50 flex items-center gap-2"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="font-medium">AI Asistent</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300" style={{maxHeight: '600px', height: '80vh'}}>
      {/* Header */}
      <div className="bg-blue-600 p-4 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <h3 className="font-medium">Gmail AI Assistant</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1.5 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 scrollbar-hide">
        {messages.length === 0 && (
            <div className="text-center text-slate-400 mt-10 space-y-2">
                <p>Jsem tu, abych pomohl.</p>
                <p className="text-sm">Zkus: "Zruš pravidla pro alza.cz"</p>
            </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-100 shrink-0">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Řekni mi, co mám udělat..."
            className="w-full bg-slate-100 text-slate-900 placeholder-slate-400 rounded-full py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            autoFocus
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isProcessing}
            className="absolute right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-400 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};