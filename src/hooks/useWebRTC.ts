'use client';

import { useRef, useCallback, useState } from 'react';

const STUN_SERVER = process.env.NEXT_PUBLIC_STUN_SERVER || 'stun:stun.l.google.com:19302';

const rtcConfig: RTCConfiguration = {
  iceServers: [
    { urls: STUN_SERVER },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

interface PeerConnectionCallbacks {
  sendOffer: (target: string, sdp: RTCSessionDescriptionInit) => void;
  sendAnswer: (target: string, sdp: RTCSessionDescriptionInit) => void;
  sendIceCandidate: (target: string, candidate: RTCIceCandidateInit) => void;
}

export type ConnectionStatus = 'waiting' | 'connecting' | 'connected';

export function useWebRTC(localStream: MediaStream | null, callbacks: PeerConnectionCallbacks) {
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('waiting');
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  const updateConnectionStatus = useCallback(() => {
    const connections = peerConnectionsRef.current;
    if (connections.size === 0) {
      setConnectionStatus('waiting');
      return;
    }

    let hasConnected = false;
    let hasConnecting = false;

    connections.forEach((pc) => {
      const state = pc.connectionState;
      if (state === 'connected') hasConnected = true;
      if (state === 'connecting' || state === 'new') hasConnecting = true;
    });

    if (hasConnected) {
      setConnectionStatus('connected');
    } else if (hasConnecting) {
      setConnectionStatus('connecting');
    } else {
      setConnectionStatus('waiting');
    }
  }, []);

  const createPeerConnection = useCallback(
    (peerId: string): RTCPeerConnection => {
      const pc = new RTCPeerConnection(rtcConfig);

      // Add local tracks to the connection
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          pc.addTrack(track, localStream);
        });
      }

      // Handle incoming remote tracks
      pc.ontrack = (event) => {
        console.log('Received remote track from:', peerId);
        const [remoteStream] = event.streams;
        if (remoteStream) {
          setRemoteStreams((prev) => {
            const updated = new Map(prev);
            updated.set(peerId, remoteStream);
            return updated;
          });
        }
      };

      // Handle ICE candidates (trickle ICE)
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          callbacksRef.current.sendIceCandidate(peerId, event.candidate.toJSON());
        }
      };

      // Monitor connection state
      pc.onconnectionstatechange = () => {
        console.log(`Connection state with ${peerId}:`, pc.connectionState);
        updateConnectionStatus();

        if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
          console.warn(`Connection with ${peerId} ${pc.connectionState}`);
        }
      };

      pc.oniceconnectionstatechange = () => {
        console.log(`ICE connection state with ${peerId}:`, pc.iceConnectionState);
        updateConnectionStatus();
      };

      peerConnectionsRef.current.set(peerId, pc);
      setConnectionStatus('connecting');
      return pc;
    },
    [localStream, updateConnectionStatus]
  );

  // Create offer and send to target peer
  const createOffer = useCallback(
    async (peerId: string) => {
      try {
        const pc = createPeerConnection(peerId);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        callbacksRef.current.sendOffer(peerId, offer);
        console.log('Offer sent to:', peerId);
      } catch (err) {
        console.error('Error creating offer:', err);
      }
    },
    [createPeerConnection]
  );

  // Handle incoming offer from a peer
  const handleOffer = useCallback(
    async (peerId: string, sdp: RTCSessionDescriptionInit) => {
      try {
        const pc = createPeerConnection(peerId);
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        callbacksRef.current.sendAnswer(peerId, answer);
        console.log('Answer sent to:', peerId);
      } catch (err) {
        console.error('Error handling offer:', err);
      }
    },
    [createPeerConnection]
  );

  // Handle incoming answer from a peer
  const handleAnswer = useCallback(
    async (peerId: string, sdp: RTCSessionDescriptionInit) => {
      try {
        const pc = peerConnectionsRef.current.get(peerId);
        if (pc) {
          await pc.setRemoteDescription(new RTCSessionDescription(sdp));
          console.log('Answer received from:', peerId);
        }
      } catch (err) {
        console.error('Error handling answer:', err);
      }
    },
    []
  );

  // Handle incoming ICE candidate from a peer
  const handleIceCandidate = useCallback(
    async (peerId: string, candidate: RTCIceCandidateInit) => {
      try {
        const pc = peerConnectionsRef.current.get(peerId);
        if (pc) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (err) {
        console.error('Error adding ICE candidate:', err);
      }
    },
    []
  );

  // Remove a peer connection and its stream
  const removePeer = useCallback((peerId: string) => {
    const pc = peerConnectionsRef.current.get(peerId);
    if (pc) {
      pc.close();
      peerConnectionsRef.current.delete(peerId);
    }
    setRemoteStreams((prev) => {
      const updated = new Map(prev);
      updated.delete(peerId);
      return updated;
    });
    updateConnectionStatus();
  }, [updateConnectionStatus]);

  // Close all peer connections
  const closeAllConnections = useCallback(() => {
    peerConnectionsRef.current.forEach((pc) => {
      pc.close();
    });
    peerConnectionsRef.current.clear();
    setRemoteStreams(new Map());
    setConnectionStatus('waiting');
  }, []);

  return {
    remoteStreams,
    connectionStatus,
    createOffer,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    removePeer,
    closeAllConnections,
  };
}
