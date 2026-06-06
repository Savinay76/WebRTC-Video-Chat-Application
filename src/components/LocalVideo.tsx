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
      className="absolute bottom-28 right-6 w-52 rounded-2xl overflow-hidden shadow-2xl z-20 animate-fadeInScale transition-all duration-300 hover:scale-105"
      style={{
        border: '2px solid var(--border-glass)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
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
            <div className="text-3xl mb-2">📷</div>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Camera Off</p>
          </div>
        </div>
      )}
      <div className="absolute bottom-2 left-2 glass px-2 py-1 rounded-md">
        <span className="text-[10px] font-medium" style={{ color: 'var(--text-secondary)' }}>You</span>
      </div>
    </div>
  );
}
