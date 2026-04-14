import { useRef, useEffect, useState } from 'react';
import { useQuizContext } from '../../context/QuizContext';
import { useVideoPlayer } from '../../hooks/useVideoPlayer';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { VideoControls } from './VideoControls';
import { ProgressBar } from './ProgressBar';
import { QuizOverlay } from './QuizOverlay';
import { ScoreHeader } from './ScoreHeader';
import { CompletionScreen } from './CompletionScreen';
import { AddQuestionModal } from '../Playground/AddQuestionModal';
import { PlusCircle } from 'lucide-react';

interface InteractiveVideoPlayerProps {
  customVideoUrl?: string;
  isCreatorMode?: boolean;
}

export const InteractiveVideoPlayer: React.FC<InteractiveVideoPlayerProps> = ({ customVideoUrl, isCreatorMode }) => {
  const { config, questions, setQuestions, engine, handleAnswerSubmit, progress, completeQuiz } = useQuizContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const playerState = useVideoPlayer({ videoRef, containerRef });

  // Handle quiz triggers
  useEffect(() => {
    if (playerState.isPlaying && playerState.currentTime > 0) {
      const triggered = engine.checkTriggers(playerState.currentTime);
      if (triggered) {
        playerState.setIsPlaying(false);
        videoRef.current?.pause();
      }
    }
  }, [playerState.currentTime, playerState.isPlaying, engine]);

  // Handle video end
  useEffect(() => {
    if (playerState.duration > 0 && playerState.currentTime >= playerState.duration && !playerState.isPlaying) {
      if (!engine.showOverlay && engine.askedQuestions.length === questions.length) {
         completeQuiz(playerState.duration);
      }
    }
  }, [playerState.currentTime, playerState.duration, playerState.isPlaying, engine.showOverlay]);

  const resumeVideo = () => {
    engine.resume();
    videoRef.current?.play().catch(console.error);
    playerState.setIsPlaying(true);
  };

  useKeyboardShortcuts({
    onPlayPause: playerState.togglePlay,
    onMute: playerState.toggleMute,
    onFullscreen: playerState.toggleFullscreen,
    onSkipOverlay: config.allowSkip ? resumeVideo : undefined
  }, engine.showOverlay);

  const isComplete = playerState.duration > 0 && playerState.currentTime >= playerState.duration && !engine.showOverlay;

  return (
    <div className="vq-player-container-wrapper">
      <ScoreHeader progress={progress} />
      
      <div 
        ref={containerRef} 
        className={`vq-player-container vq-theme-${config.theme || 'dark'}`}
      >
        {!playerState.videoError ? (
          <video
            ref={videoRef}
            className="vq-video-element"
            src={customVideoUrl || config.videoUrl}
            playsInline
            {...playerState.videoEvents}
          />
        ) : (
          <div className="vq-video-error">
            <p>Video unavailable.</p>
          </div>
        )}

        {/* Creator Mode Add Button */}
        {isCreatorMode && !playerState.isPlaying && !engine.showOverlay && !showAddModal && playerState.currentTime > 0 && (
          <button className="vq-fab vq-animate-in" onClick={() => setShowAddModal(true)}>
            <PlusCircle size={20} /> Add Question Here
          </button>
        )}

        {/* Add Question Modal */}
        {showAddModal && (
          <AddQuestionModal 
            time={Math.floor(playerState.currentTime)} 
            onClose={() => setShowAddModal(false)}
            onAdd={(q) => {
              setQuestions([...questions, q]);
              setShowAddModal(false);
            }}
          />
        )}

        {/* Quiz Overlay */}
        {engine.showOverlay && engine.currentQuestion && (
           <QuizOverlay 
             question={engine.currentQuestion}
             onSubmit={handleAnswerSubmit}
             onResume={resumeVideo}
             allowSkip={config.allowSkip}
             showFeedback={config.showFeedback}
           />
        )}

        {/* Completion Screen */}
        {isComplete && questions.length > 0 && (
          <CompletionScreen progress={progress} onReplay={() => playerState.seek(0, false)} />
        )}

        {/* Controls */}
        {!playerState.videoError && !engine.showOverlay && (
          <div className="vq-controls-overlay">
            <ProgressBar 
              currentTime={playerState.currentTime}
              duration={playerState.duration}
              questions={questions}
              askedQuestions={engine.askedQuestions}
              onSeek={playerState.seek}
            />
            <VideoControls playerState={playerState} />
          </div>
        )}
      </div>
    </div>
  );
};
