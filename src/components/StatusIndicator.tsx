'use client';

import type { ConnectionStatus } from '@/hooks/useWebRTC';

interface StatusIndicatorProps {
  status: ConnectionStatus;
  peerCount: number;
}

export default function StatusIndicator({ status, peerCount }: StatusIndicatorProps) {
  return (
    <div className="absolute top-4 left-4 z-30">
      {status === 'waiting' && (
        <div
          data-test-id="status-waiting"
          className="glass rounded-full px-4 py-2 flex items-center gap-2 animate-fadeIn"
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: 'var(--warning)', boxShadow: '0 0 8px var(--warning)' }}
          />
          <span className="text-xs font-medium" style={{ color: 'var(--warning)' }}>
            Waiting for others...
          </span>
        </div>
      )}

      {status === 'connecting' && (
        <div
          data-test-id="status-connecting"
          className="glass rounded-full px-4 py-2 flex items-center gap-2 animate-fadeIn"
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: 'var(--accent-secondary)', boxShadow: '0 0 8px var(--accent-secondary)' }}
          />
          <span className="text-xs font-medium" style={{ color: 'var(--accent-secondary)' }}>
            Connecting...
          </span>
        </div>
      )}

      {status === 'connected' && (
        <div
          data-test-id="status-connected"
          className="glass rounded-full px-4 py-2 flex items-center gap-2 animate-fadeIn"
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: 'var(--success)', boxShadow: '0 0 8px var(--success)' }}
          />
          <span className="text-xs font-medium" style={{ color: 'var(--success)' }}>
            Connected · {peerCount} peer{peerCount !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
}
