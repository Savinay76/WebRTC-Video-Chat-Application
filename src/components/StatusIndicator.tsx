'use client';

import type { ConnectionStatus } from '@/hooks/useWebRTC';

interface StatusIndicatorProps {
  status: ConnectionStatus;
  peerCount: number;
}

export default function StatusIndicator({ status, peerCount }: StatusIndicatorProps) {
  return (
    <div className="absolute top-5 left-5 z-30">
      {status === 'waiting' && (
        <div
          data-test-id="status-waiting"
          className="glass rounded-full flex items-center gap-2.5 animate-fadeIn"
          style={{ padding: '0.55rem 1.1rem' }}
        >
          <span
            className="rounded-full"
            style={{
              width: '0.55rem',
              height: '0.55rem',
              background: 'var(--warning)',
              boxShadow: '0 0 10px var(--warning)',
            }}
          />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--warning)' }}>
            Waiting for others...
          </span>
        </div>
      )}

      {status === 'connecting' && (
        <div
          data-test-id="status-connecting"
          className="glass rounded-full flex items-center gap-2.5 animate-fadeIn"
          style={{ padding: '0.55rem 1.1rem' }}
        >
          <span
            className="rounded-full animate-pulse"
            style={{
              width: '0.55rem',
              height: '0.55rem',
              background: 'var(--accent-secondary)',
              boxShadow: '0 0 10px var(--accent-secondary)',
            }}
          />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-secondary)' }}>
            Connecting...
          </span>
        </div>
      )}

      {status === 'connected' && (
        <div
          data-test-id="status-connected"
          className="glass rounded-full flex items-center gap-2.5 animate-fadeIn"
          style={{ padding: '0.55rem 1.1rem' }}
        >
          <span
            className="rounded-full"
            style={{
              width: '0.55rem',
              height: '0.55rem',
              background: 'var(--success)',
              boxShadow: '0 0 10px var(--success)',
            }}
          />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--success)' }}>
            Connected · {peerCount} peer{peerCount !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
}
