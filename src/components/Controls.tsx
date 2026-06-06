'use client';

interface ControlsProps {
  isMicMuted: boolean;
  isCameraOff: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onHangup: () => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
  unreadCount: number;
}

export default function Controls({
  isMicMuted,
  isCameraOff,
  onToggleMic,
  onToggleCamera,
  onHangup,
  onToggleChat,
  isChatOpen,
  unreadCount,
}: ControlsProps) {
  const btnBase =
    'flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer';

  return (
    <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-7 z-30">
      <div
        className="glass-strong rounded-2xl flex items-center gap-3 animate-fadeIn"
        style={{
          padding: '0.875rem 1.5rem',
          boxShadow: '0 12px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
        }}
      >
        {/* Mic toggle */}
        <button
          data-test-id="mute-mic-button"
          onClick={onToggleMic}
          className={btnBase}
          style={{
            width: '3.25rem',
            height: '3.25rem',
            borderRadius: '0.875rem',
            background: isMicMuted ? 'rgba(255, 107, 107, 0.18)' : 'rgba(255, 255, 255, 0.07)',
            border: `1px solid ${isMicMuted ? 'rgba(255, 107, 107, 0.35)' : 'rgba(255,255,255,0.08)'}`,
            color: isMicMuted ? 'var(--danger)' : 'var(--text-primary)',
          }}
          title={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
        >
          {isMicMuted ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="1" y1="1" x2="23" y2="23"/>
              <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
              <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .41-.04.81-.1 1.2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          )}
        </button>

        {/* Camera toggle */}
        <button
          data-test-id="toggle-camera-button"
          onClick={onToggleCamera}
          className={btnBase}
          style={{
            width: '3.25rem',
            height: '3.25rem',
            borderRadius: '0.875rem',
            background: isCameraOff ? 'rgba(255, 107, 107, 0.18)' : 'rgba(255, 255, 255, 0.07)',
            border: `1px solid ${isCameraOff ? 'rgba(255, 107, 107, 0.35)' : 'rgba(255,255,255,0.08)'}`,
            color: isCameraOff ? 'var(--danger)' : 'var(--text-primary)',
          }}
          title={isCameraOff ? 'Turn camera on' : 'Turn camera off'}
        >
          {isCameraOff ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="1" y1="1" x2="23" y2="23"/>
              <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 7l-7 5 7 5V7z"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
          )}
        </button>

        {/* Chat toggle */}
        <button
          onClick={onToggleChat}
          className={`${btnBase} relative`}
          style={{
            width: '3.25rem',
            height: '3.25rem',
            borderRadius: '0.875rem',
            background: isChatOpen ? 'rgba(108, 92, 231, 0.18)' : 'rgba(255, 255, 255, 0.07)',
            border: `1px solid ${isChatOpen ? 'rgba(108, 92, 231, 0.35)' : 'rgba(255,255,255,0.08)'}`,
            color: isChatOpen ? 'var(--accent-secondary)' : 'var(--text-primary)',
          }}
          title="Toggle chat"
          id="toggle-chat-btn"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          {unreadCount > 0 && (
            <span
              className="absolute flex items-center justify-center font-bold text-white"
              style={{
                top: '-4px',
                right: '-4px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'var(--danger)',
                fontSize: '0.6rem',
                boxShadow: '0 2px 8px rgba(255,107,107,0.5)',
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>

        {/* Divider */}
        <div style={{ width: '1px', height: '2rem', margin: '0 0.25rem', background: 'rgba(255,255,255,0.08)' }} />

        {/* Hangup */}
        <button
          data-test-id="hangup-button"
          onClick={onHangup}
          className={btnBase}
          style={{
            width: '3.75rem',
            height: '3.25rem',
            borderRadius: '0.875rem',
            background: 'linear-gradient(135deg, #ff6b6b, #ee5a5a)',
            boxShadow: '0 4px 20px rgba(255, 107, 107, 0.4)',
          }}
          title="Leave call"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/>
            <line x1="23" y1="1" x2="1" y2="23"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
