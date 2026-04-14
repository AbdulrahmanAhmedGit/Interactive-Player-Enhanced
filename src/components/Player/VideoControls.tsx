import { Play, Pause, Maximize, Volume2, VolumeX } from 'lucide-react';
import { formatTime } from '../../utils/formatTime';

interface VideoControlsProps {
  playerState: any;
}

export const VideoControls: React.FC<VideoControlsProps> = ({ playerState }) => {
  return (
    <div className="vq-controls-bar">
      <div>
        <button onClick={playerState.togglePlay} className="vq-control-btn" aria-label="Play/Pause">
          {playerState.isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button onClick={playerState.toggleMute} className="vq-control-btn" aria-label="Mute">
          {playerState.isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <span className="vq-time-display">
          {formatTime(playerState.currentTime)} / {formatTime(playerState.duration)}
        </span>
      </div>
      <button onClick={playerState.toggleFullscreen} className="vq-control-btn" aria-label="Fullscreen">
        <Maximize size={18} />
      </button>
    </div>
  );
};
