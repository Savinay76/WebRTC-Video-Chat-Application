'use client';

import { useEffect, useRef } from 'react';

interface VideoGridProps {
  remoteStreams: Map<string, MediaStream>;
}

function RemoteVideo({ stream, peerId }: { stream: MediaStream; peerId: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div
      className="relative rounded-2xl overflow-hidden animate-fadeInScale"
      style={{
        background: 'var(--bg-secondary)',
        aspectRatio: '16/9',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      {/* Peer label */}
      <div
        className="absolute bottom-3 left-3 glass px-3 py-1.5 rounded-lg"
        style={{ backdropFilter: 'blur(12px)' }}
      >
        <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>
          👤 Peer {peerId.slice(0, 6)}
        </span>
      </div>
      {/* Connection quality indicator */}
      <div className="absolute top-3 right-3">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{
            background: 'var(--success)',
            boxShadow: '0 0 8px var(--success)',
          }}
        />
      </div>
    </div>
  );
}

export default function VideoGrid({ remoteStreams }: VideoGridProps) {
  const count = remoteStreams.size;
  const gridClass =
    count <= 1
      ? 'video-grid-1'
      : count === 2
        ? 'video-grid-2'
        : 'video-grid-3';

  return (
    <div
      data-test-id="remote-video-container"
      className={`grid gap-5 w-full h-full ${gridClass}`}
      style={{
        alignContent: 'center',
        padding: '1.5rem 2rem',
      }}
    >
      {Array.from(remoteStreams.entries()).map(([peerId, stream]) => (
        <RemoteVideo key={peerId} stream={stream} peerId={peerId} />
      ))}

      {count === 0 && (
        <div className="flex flex-col items-center justify-center h-full animate-fadeIn">
          <div
            className="animate-float"
            style={{
              fontSize: '5rem',
              marginBottom: '1.5rem',
              filter: 'drop-shadow(0 4px 20px rgba(108,92,231,0.3))',
            }}
          >
            🎥
          </div>
          <p
            className="font-semibold"
            style={{
              color: 'var(--text-primary)',
              fontSize: '1.35rem',
              marginBottom: '0.5rem',
            }}
          >
            Waiting for others to join...
          </p>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              opacity: 0.7,
            }}
          >
            Share the room link to invite participants
          </p>
        </div>
      )}
    </div>
  );
}
