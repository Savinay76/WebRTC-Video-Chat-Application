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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Ambient background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20 animate-gradient"
          style={{ background: 'radial-gradient(circle, #6c5ce7 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-15 animate-gradient"
          style={{ background: 'radial-gradient(circle, #a29bfe 0%, transparent 70%)', animationDelay: '1.5s' }}
        />
        <div
          className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full opacity-10 animate-float"
          style={{ background: 'radial-gradient(circle, #fd79a8 0%, transparent 70%)' }}
        />
      </div>

      {/* Main card */}
      <div className="glass-strong rounded-3xl p-10 max-w-md w-full mx-4 animate-fadeInScale relative z-10" style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}>
        {/* Logo & title */}
        <div className="text-center mb-10">
          <div
            className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center text-3xl animate-gradient"
            style={{ background: 'var(--accent-gradient)' }}
          >
            📹
          </div>
          <h1 className="text-4xl font-bold mb-3" style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            MeshCall
          </h1>
          <p style={{ color: 'var(--text-secondary)' }} className="text-base">
            Peer-to-peer video chat with WebRTC mesh topology
          </p>
        </div>

        {/* Create room */}
        <button
          onClick={createRoom}
          className="w-full py-4 rounded-xl text-white font-semibold text-lg mb-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] cursor-pointer animate-gradient"
          style={{ background: 'var(--accent-gradient)', boxShadow: '0 4px 20px rgba(108, 92, 231, 0.4)' }}
          id="create-room-btn"
        >
          ✨ Create New Room
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px" style={{ background: 'var(--border-glass)' }} />
          <span style={{ color: 'var(--text-secondary)' }} className="text-sm font-medium">or join existing</span>
          <div className="flex-1 h-px" style={{ background: 'var(--border-glass)' }} />
        </div>

        {/* Join room */}
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter room ID..."
            value={joinRoomId}
            onChange={(e) => setJoinRoomId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && joinRoom()}
            className="flex-1 px-5 py-3.5 rounded-xl bg-transparent text-white placeholder:text-gray-500 outline-none transition-all duration-300 focus:border-[var(--accent-primary)]"
            style={{ border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.03)' }}
            id="join-room-input"
          />
          <button
            onClick={joinRoom}
            disabled={!joinRoomId.trim()}
            className="px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)', color: 'var(--accent-secondary)' }}
            id="join-room-btn"
          >
            Join
          </button>
        </div>

        {/* Features */}
        <div className="mt-10 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: '🔒', label: 'P2P Encrypted' },
            { icon: '👥', label: 'Up to 4 Peers' },
            { icon: '💬', label: 'Text Chat' },
          ].map((feat) => (
            <div key={feat.label} className="py-3 px-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="text-xl mb-1">{feat.icon}</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{feat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
