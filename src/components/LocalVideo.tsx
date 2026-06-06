'use client';

import { useEffect, useRef } from 'react';

interface LocalVideoProps {
  stream: MediaStream | null;
  isCameraOff: boolean;
}

export default function LocalVideo({ stream, isCameraOff }: LocalVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div
      className="absolute bottom-28 right-6 rounded-2xl overflow-hidden z-20 animate-fadeInScale transition-all duration-300 hover:scale-105"
      style={{
        width: '260px',
        border: '2px solid rgba(255,255,255,0.1)',
        boxShadow: '0 12px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
        aspectRatio: '16/10',
      }}
    >
      <video
        ref={videoRef}
        data-test-id="local-video"
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
        style={{
          transform: 'scaleX(-1)',
          display: isCameraOff ? 'none' : 'block',
        }}
      />
      {isCameraOff && (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ background: 'var(--bg-secondary)' }}
        >
          <div className="text-center">
            <div style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>📷</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Camera Off</p>
          </div>
        </div>
      )}
      {/* Label */}
      <div
        className="absolute bottom-2.5 left-2.5 glass px-2.5 py-1 rounded-lg"
        style={{ backdropFilter: 'blur(12px)' }}
      >
        <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>You</span>
      </div>
    </div>
  );
}
