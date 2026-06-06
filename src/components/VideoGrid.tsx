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
    <div className="relative rounded-2xl overflow-hidden animate-fadeInScale" style={{ background: 'var(--bg-secondary)', aspectRatio: '16/9' }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-3 left-3 glass px-3 py-1.5 rounded-lg">
        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
          Peer {peerId.slice(0, 6)}
        </span>
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
      className={`grid gap-4 w-full h-full p-4 ${gridClass}`}
      style={{ alignContent: 'center' }}
    >
      {Array.from(remoteStreams.entries()).map(([peerId, stream]) => (
        <RemoteVideo key={peerId} stream={stream} peerId={peerId} />
      ))}

      {count === 0 && (
        <div className="flex flex-col items-center justify-center h-full animate-fadeIn">
          <div className="text-6xl mb-6 animate-float">🎥</div>
          <p className="text-xl font-medium" style={{ color: 'var(--text-secondary)' }}>
            Waiting for others to join...
          </p>
          <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>
            Share the room link to invite participants
          </p>
        </div>
      )}
    </div>
  );
}
