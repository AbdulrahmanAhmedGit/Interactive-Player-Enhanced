import { useEffect } from 'react';

interface ShortcutHandlers {
  onPlayPause?: () => void;
  onMute?: () => void;
  onFullscreen?: () => void;
  onSubmitOverlay?: () => void;
  onSkipOverlay?: () => void;
}

export const useKeyboardShortcuts = (
  { onPlayPause, onMute, onFullscreen, onSubmitOverlay, onSkipOverlay }: ShortcutHandlers,
  isOverlayActive: boolean
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (isOverlayActive) {
        if (e.key === 'Escape' && onSkipOverlay) {
          onSkipOverlay();
        } else if (e.key === 'Enter' && onSubmitOverlay) {
          onSubmitOverlay();
        }
      } else {
        switch (e.key.toLowerCase()) {
          case ' ':
          case 'k':
            e.preventDefault();
            onPlayPause?.();
            break;
          case 'm':
            onMute?.();
            break;
          case 'f':
            onFullscreen?.();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPlayPause, onMute, onFullscreen, onSubmitOverlay, onSkipOverlay, isOverlayActive]);
};
