'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export function useUserMedia() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let mounted = true;

    const initMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user',
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        if (mounted) {
          streamRef.current = mediaStream;
          setStream(mediaStream);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          console.error('Failed to get user media:', err);
          if (err instanceof DOMException) {
            if (err.name === 'NotAllowedError') {
              setError('Camera and microphone permissions denied. Please allow access.');
            } else if (err.name === 'NotFoundError') {
              setError('No camera or microphone found.');
            } else {
              setError(`Media error: ${err.message}`);
            }
          } else {
            setError('Failed to access camera and microphone.');
          }
        }
      }
    };

    initMedia();

    return () => {
      mounted = false;
    };
  }, []);

  const toggleMic = useCallback(() => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMicMuted((prev) => !prev);
    }
  }, []);

  const toggleCamera = useCallback(() => {
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsCameraOff((prev) => !prev);
    }
  }, []);

  const stopAllTracks = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
      setStream(null);
    }
  }, []);

  return {
    stream,
    isMicMuted,
    isCameraOff,
    error,
    toggleMic,
    toggleCamera,
    stopAllTracks,
  };
}
