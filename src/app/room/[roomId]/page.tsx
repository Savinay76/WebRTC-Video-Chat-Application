'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useState, useRef, useEffect } from 'react';
import { useSignaling } from '@/hooks/useSignaling';
import { useUserMedia } from '@/hooks/useUserMedia';
import { useWebRTC } from '@/hooks/useWebRTC';
import VideoGrid from '@/components/VideoGrid';
import LocalVideo from '@/components/LocalVideo';
import Controls from '@/components/Controls';
import ChatPanel, { ChatMessage } from '@/components/ChatPanel';
import StatusIndicator from '@/components/StatusIndicator';

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [roomLink, setRoomLink] = useState('');
  const [copied, setCopied] = useState(false);

  // Media
  const { stream, isMicMuted, isCameraOff, error: mediaError, toggleMic, toggleCamera, stopAllTracks } = useUserMedia();

  // WebRTC
  const {
    remoteStreams,
    connectionStatus,
    createOffer,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    removePeer,
    closeAllConnections,
  } = useWebRTC(stream, {
    sendOffer: (target, sdp) => signalingRef.current?.sendOffer(target, sdp),
    sendAnswer: (target, sdp) => signalingRef.current?.sendAnswer(target, sdp),
    sendIceCandidate: (target, candidate) => signalingRef.current?.sendIceCandidate(target, candidate),
  });

  // Refs for signaling callbacks
  const signalingRef = useRef<ReturnType<typeof useSignaling> | null>(null);

  // Signaling
  const signaling = useSignaling(roomId, {
    onExistingUsers: useCallback(
      (userIds: string[]) => {
        console.log('Existing users in room:', userIds);
        userIds.forEach((userId) => {
          createOffer(userId);
        });
      },
      [createOffer]
    ),
    onUserJoined: useCallback(
      (userId: string) => {
        console.log('User joined:', userId);
        createOffer(userId);
      },
      [createOffer]
    ),
    onUserLeft: useCallback(
      (userId: string) => {
        console.log('User left:', userId);
        removePeer(userId);
      },
      [removePeer]
    ),
    onOffer: useCallback(
      (data: { sender: string; sdp: RTCSessionDescriptionInit }) => {
        handleOffer(data.sender, data.sdp);
      },
      [handleOffer]
    ),
    onAnswer: useCallback(
      (data: { sender: string; sdp: RTCSessionDescriptionInit }) => {
        handleAnswer(data.sender, data.sdp);
      },
      [handleAnswer]
    ),
    onIceCandidate: useCallback(
      (data: { sender: string; candidate: RTCIceCandidateInit }) => {
        handleIceCandidate(data.sender, data.candidate);
      },
      [handleIceCandidate]
    ),
    onChatMessage: useCallback(
      (data: { message: string; sender: string; senderId: string; timestamp: number }) => {
        const newMsg: ChatMessage = {
          id: `${data.senderId}-${data.timestamp}`,
          message: data.message,
          sender: data.sender,
          senderId: data.senderId,
          timestamp: data.timestamp,
          isOwn: false,
        };
        setChatMessages((prev) => [...prev, newMsg]);
        if (!isChatOpen) {
          setUnreadCount((prev) => prev + 1);
        }
      },
      [isChatOpen]
    ),
  });

  // Store signaling ref
  signalingRef.current = signaling;

  // Set room link on mount
  useEffect(() => {
    setRoomLink(window.location.href);
  }, []);

  // Expose stream globally for testing
  useEffect(() => {
    if (stream) {
      (window as unknown as Record<string, MediaStream>).__localStream = stream;
    }
  }, [stream]);

  const handleSendMessage = useCallback(
    (message: string) => {
      const senderName = `User ${signaling.socketId?.slice(0, 6) || 'You'}`;
      signaling.sendChatMessage(roomId, message, senderName);

      const newMsg: ChatMessage = {
        id: `${signaling.socketId}-${Date.now()}`,
        message,
        sender: senderName,
        senderId: signaling.socketId || '',
        timestamp: Date.now(),
        isOwn: true,
      };
      setChatMessages((prev) => [...prev, newMsg]);
    },
    [signaling, roomId]
  );

  const handleToggleChat = useCallback(() => {
    setIsChatOpen((prev) => {
      if (!prev) setUnreadCount(0);
      return !prev;
    });
  }, []);

  const handleHangup = useCallback(() => {
    closeAllConnections();
    stopAllTracks();
    signaling.disconnect();
    router.push('/');
  }, [closeAllConnections, stopAllTracks, signaling, router]);

  const copyRoomLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(roomLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const input = document.createElement('input');
      input.value = roomLink;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [roomLink]);

  return (
    <div
      className="h-screen w-screen flex flex-col relative"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Status indicator */}
      <StatusIndicator status={connectionStatus} peerCount={remoteStreams.size} />

      {/* Room ID badge */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
        <button
          onClick={copyRoomLink}
          className="glass rounded-full px-4 py-2 flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          title="Copy room link"
        >
          <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            {copied ? '✅ Copied!' : `🔗 ${roomId.slice(0, 8)}...`}
          </span>
        </button>
      </div>

      {/* Media error */}
      {mediaError && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 glass-strong rounded-xl px-6 py-3 animate-fadeIn">
          <p className="text-sm" style={{ color: 'var(--danger)' }}>
            ⚠️ {mediaError}
          </p>
        </div>
      )}

      {/* Video area */}
      <div className="flex-1 relative">
        <VideoGrid remoteStreams={remoteStreams} />
        <LocalVideo stream={stream} isCameraOff={isCameraOff} />
        <ChatPanel
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          isOpen={isChatOpen}
        />
      </div>

      {/* Controls */}
      <Controls
        isMicMuted={isMicMuted}
        isCameraOff={isCameraOff}
        onToggleMic={toggleMic}
        onToggleCamera={toggleCamera}
        onHangup={handleHangup}
        onToggleChat={handleToggleChat}
        isChatOpen={isChatOpen}
        unreadCount={unreadCount}
      />
    </div>
  );
}
