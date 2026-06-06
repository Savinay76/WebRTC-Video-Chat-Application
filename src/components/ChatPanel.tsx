'use client';

import { useState, useRef, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  message: string;
  sender: string;
  senderId: string;
  timestamp: number;
  isOwn: boolean;
}

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isOpen: boolean;
}

export default function ChatPanel({ messages, onSendMessage, isOpen }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = () => {
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="absolute top-0 right-0 bottom-0 w-80 glass-strong z-20 flex flex-col animate-fadeIn"
      style={{ borderLeft: '1px solid var(--border-glass)' }}
    >
      {/* Header */}
      <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border-glass)' }}>
        <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Chat</h3>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{messages.length} messages</p>
      </div>

      {/* Messages */}
      <div
        data-test-id="chat-log"
        ref={logRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
      >
        {messages.length === 0 && (
          <div className="text-center py-10">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No messages yet</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>Start the conversation!</p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            data-test-id="chat-message"
            className={`flex flex-col ${msg.isOwn ? 'items-end' : 'items-start'}`}
          >
            <span className="text-[10px] mb-1 px-1" style={{ color: 'var(--text-secondary)' }}>
              {msg.isOwn ? 'You' : msg.sender}
            </span>
            <div
              className="px-3 py-2 rounded-xl max-w-[85%] text-sm"
              style={{
                background: msg.isOwn
                  ? 'var(--accent-primary)'
                  : 'rgba(255,255,255,0.06)',
                color: msg.isOwn ? '#fff' : 'var(--text-primary)',
                borderBottomRightRadius: msg.isOwn ? '4px' : '12px',
                borderBottomLeftRadius: msg.isOwn ? '12px' : '4px',
              }}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 py-3" style={{ borderTop: '1px solid var(--border-glass)' }}>
        <div className="flex gap-2">
          <input
            data-test-id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200 focus:border-[var(--accent-primary)]"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-primary)',
            }}
          />
          <button
            data-test-id="chat-submit"
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            style={{ background: 'var(--accent-primary)', color: '#fff' }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
