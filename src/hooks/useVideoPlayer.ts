import { useState, useEffect, RefObject } from 'react';

interface UseVideoPlayerProps {
  videoRef: RefObject<HTMLVideoElement>;
  containerRef: RefObject<HTMLDivElement>;
}

export const useVideoPlayer = ({ videoRef, containerRef }: UseVideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(e => console.error("Play error:", e));
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    setCurrentTime(current);
    if (duration > 0) {
      setProgress((current / duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const seek = (timeOrPercentage: number, isPercentage = true) => {
    if (!videoRef.current || duration === 0) return;
    if (isPercentage) {
      videoRef.current.currentTime = timeOrPercentage * duration;
    } else {
      videoRef.current.currentTime = timeOrPercentage;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMutedState = !isMuted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return {
    isPlaying,
    progress,
    currentTime,
    duration,
    isMuted,
    isFullscreen,
    videoError,
    
    setIsPlaying,
    setVideoError,
    togglePlay,
    toggleMute,
    seek,
    toggleFullscreen,
    
    // Event handlers to attach to <video>
    videoEvents: {
      onClick: togglePlay,
      onTimeUpdate: handleTimeUpdate,
      onLoadedMetadata: handleLoadedMetadata,
      onEnded: () => setIsPlaying(false),
      onError: () => setVideoError(true),
    }
  };
};
