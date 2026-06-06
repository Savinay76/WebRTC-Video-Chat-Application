'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SignalingEvents {
  onExistingUsers: (userIds: string[]) => void;
  onUserJoined: (userId: string) => void;
  onUserLeft: (userId: string) => void;
  onOffer: (data: { sender: string; sdp: RTCSessionDescriptionInit }) => void;
  onAnswer: (data: { sender: string; sdp: RTCSessionDescriptionInit }) => void;
  onIceCandidate: (data: { sender: string; candidate: RTCIceCandidateInit }) => void;
  onChatMessage: (data: { message: string; sender: string; senderId: string; timestamp: number }) => void;
}

export function useSignaling(roomId: string, events: SignalingEvents) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState<string>('');
  const eventsRef = useRef(events);
  eventsRef.current = events;

  useEffect(() => {
    const socket = io(window.location.origin, {
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setIsConnected(true);
      setSocketId(socket.id || '');
      socket.emit('join-room', roomId);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socket.on('existing-users', (userIds: string[]) => {
      eventsRef.current.onExistingUsers(userIds);
    });

    socket.on('user-joined', (userId: string) => {
      eventsRef.current.onUserJoined(userId);
    });

    socket.on('user-left', (userId: string) => {
      eventsRef.current.onUserLeft(userId);
    });

    socket.on('offer', (data: { sender: string; sdp: RTCSessionDescriptionInit }) => {
      eventsRef.current.onOffer(data);
    });

    socket.on('answer', (data: { sender: string; sdp: RTCSessionDescriptionInit }) => {
      eventsRef.current.onAnswer(data);
    });

    socket.on('ice-candidate', (data: { sender: string; candidate: RTCIceCandidateInit }) => {
      eventsRef.current.onIceCandidate(data);
    });

    socket.on('chat-message', (data: { message: string; sender: string; senderId: string; timestamp: number }) => {
      eventsRef.current.onChatMessage(data);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomId]);

  const sendOffer = useCallback((target: string, sdp: RTCSessionDescriptionInit) => {
    socketRef.current?.emit('offer', { target, sdp });
  }, []);

  const sendAnswer = useCallback((target: string, sdp: RTCSessionDescriptionInit) => {
    socketRef.current?.emit('answer', { target, sdp });
  }, []);

  const sendIceCandidate = useCallback((target: string, candidate: RTCIceCandidateInit) => {
    socketRef.current?.emit('ice-candidate', { target, candidate });
  }, []);

  const sendChatMessage = useCallback((roomId: string, message: string, senderName: string) => {
    socketRef.current?.emit('chat-message', { roomId, message, sender: senderName });
  }, []);

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();
  }, []);

  return {
    socketId,
    isConnected,
    sendOffer,
    sendAnswer,
    sendIceCandidate,
    sendChatMessage,
    disconnect,
  };
}
