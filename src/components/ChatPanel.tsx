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
      className="absolute top-0 right-0 bottom-0 z-20 flex flex-col animate-slideInRight"
      style={{
        width: '22rem',
        background: 'rgba(10, 10, 20, 0.92)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div>
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
            💬 Chat
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginTop: '2px' }}>
            {messages.length} message{messages.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div
        data-test-id="chat-log"
        ref={logRef}
        className="flex-1 overflow-y-auto"
        style={{ padding: '1rem 1.25rem' }}
      >
        {messages.length === 0 && (
          <div className="text-center" style={{ paddingTop: '3rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.5 }}>💬</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No messages yet</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', opacity: 0.6, marginTop: '0.25rem' }}>
              Start the conversation!
            </p>
          </div>
        )}
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              data-test-id="chat-message"
              className={`flex flex-col ${msg.isOwn ? 'items-end' : 'items-start'}`}
            >
              <span
                style={{
                  fontSize: '0.62rem',
                  marginBottom: '0.25rem',
                  padding: '0 0.25rem',
                  color: 'var(--text-secondary)',
                  fontWeight: 500,
                }}
              >
                {msg.isOwn ? 'You' : msg.sender}
              </span>
              <div
                style={{
                  padding: '0.6rem 0.9rem',
                  borderRadius: '0.75rem',
                  maxWidth: '85%',
                  fontSize: '0.85rem',
                  lineHeight: 1.45,
                  background: msg.isOwn
                    ? 'linear-gradient(135deg, var(--accent-primary), #7c6cf7)'
                    : 'rgba(255,255,255,0.06)',
                  color: msg.isOwn ? '#fff' : 'var(--text-primary)',
                  borderBottomRightRadius: msg.isOwn ? '4px' : '0.75rem',
                  borderBottomLeftRadius: msg.isOwn ? '0.75rem' : '4px',
                  boxShadow: msg.isOwn ? '0 2px 12px rgba(108,92,231,0.3)' : 'none',
                }}
              >
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex gap-2.5">
          <input
            data-test-id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Type a message..."
            className="flex-1 outline-none transition-all duration-200"
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.07)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
            }}
          />
          <button
            data-test-id="chat-submit"
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="font-medium transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            style={{
              padding: '0.75rem 1.1rem',
              borderRadius: '0.75rem',
              background: 'var(--accent-primary)',
              color: '#fff',
              fontSize: '0.85rem',
              border: 'none',
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
