'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const router = useRouter();
  const [joinRoomId, setJoinRoomId] = useState('');

  const createRoom = () => {
    const roomId = uuidv4();
    router.push(`/room/${roomId}`);
  };

  const joinRoom = () => {
    if (joinRoomId.trim()) {
      router.push(`/room/${joinRoomId.trim()}`);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute rounded-full animate-gradient"
          style={{
            top: '-15%',
            left: '-5%',
            width: '700px',
            height: '700px',
            background: 'radial-gradient(circle, rgba(108,92,231,0.25) 0%, transparent 65%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute rounded-full animate-gradient"
          style={{
            bottom: '-15%',
            right: '-5%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(162,155,254,0.2) 0%, transparent 65%)',
            filter: 'blur(40px)',
            animationDelay: '1.5s',
          }}
        />
        <div
          className="absolute rounded-full animate-float"
          style={{
            top: '35%',
            right: '15%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(253,121,168,0.12) 0%, transparent 65%)',
            filter: 'blur(30px)',
          }}
        />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Main card */}
      <div
        className="glass-strong rounded-3xl max-w-lg w-full mx-6 animate-fadeInScale relative z-10"
        style={{
          boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
          padding: '3.5rem 3rem',
        }}
      >
        {/* Logo & title */}
        <div className="text-center" style={{ marginBottom: '2.5rem' }}>
          <div
            className="mx-auto flex items-center justify-center animate-gradient"
            style={{
              width: '5.5rem',
              height: '5.5rem',
              borderRadius: '1.25rem',
              background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
              fontSize: '2.5rem',
              marginBottom: '1.75rem',
              boxShadow: '0 8px 30px rgba(108,92,231,0.4)',
            }}
          >
            📹
          </div>
          <h1
            className="font-extrabold"
            style={{
              fontSize: '3rem',
              lineHeight: '1.1',
              background: 'linear-gradient(135deg, #6c5ce7, #a29bfe, #d4a5ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.75rem',
              letterSpacing: '-0.02em',
            }}
          >
            MeshCall
          </h1>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1.05rem',
              lineHeight: '1.5',
              maxWidth: '320px',
              margin: '0 auto',
            }}
          >
            Peer-to-peer video chat powered by WebRTC mesh topology
          </p>
        </div>

        {/* Create room button */}
        <button
          onClick={createRoom}
          className="w-full font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] cursor-pointer animate-gradient"
          style={{
            padding: '1.1rem 2rem',
            borderRadius: '0.875rem',
            background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
            color: '#fff',
            fontSize: '1.15rem',
            boxShadow: '0 6px 30px rgba(108, 92, 231, 0.45)',
            border: 'none',
            marginBottom: '2rem',
            letterSpacing: '0.01em',
          }}
          id="create-room-btn"
        >
          ✨ Create New Room
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4" style={{ marginBottom: '1.5rem' }}>
          <div className="flex-1" style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          <span
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            or join existing
          </span>
          <div className="flex-1" style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />
        </div>

        {/* Join room */}
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Paste room ID here..."
            value={joinRoomId}
            onChange={(e) => setJoinRoomId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && joinRoom()}
            className="flex-1 outline-none transition-all duration-300"
            style={{
              padding: '0.95rem 1.25rem',
              borderRadius: '0.875rem',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.04)',
              color: '#fff',
              fontSize: '0.95rem',
            }}
            id="join-room-input"
          />
          <button
            onClick={joinRoom}
            disabled={!joinRoomId.trim()}
            className="font-semibold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            style={{
              padding: '0.95rem 1.75rem',
              borderRadius: '0.875rem',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--accent-secondary)',
              fontSize: '0.95rem',
            }}
            id="join-room-btn"
          >
            Join →
          </button>
        </div>

        {/* Feature cards */}
        <div
          className="grid grid-cols-3 gap-3 text-center"
          style={{ marginTop: '2.5rem' }}
        >
          {[
            { icon: '🔒', label: 'P2P Encrypted', sub: 'Direct connection' },
            { icon: '👥', label: 'Up to 4 Peers', sub: 'Mesh topology' },
            { icon: '💬', label: 'Text Chat', sub: 'Real-time messages' },
          ].map((feat) => (
            <div
              key={feat.label}
              className="rounded-xl transition-all duration-300 hover:scale-105"
              style={{
                padding: '1.1rem 0.75rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{feat.icon}</div>
              <div
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '0.2rem',
                }}
              >
                {feat.label}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', opacity: 0.7 }}>
                {feat.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer tagline */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center"
        style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', opacity: 0.5 }}
      >
        Built with Next.js · WebRTC · Socket.IO
      </div>
    </div>
  );
}
