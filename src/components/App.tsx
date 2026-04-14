import { useState } from 'react';
import { Navbar } from './Layout/Navbar';
import { LandingPage } from './Layout/LandingPage';
import { InteractiveVideoPlayer } from './Player/InteractiveVideoPlayer';
import { AdminPanel } from './Admin/AdminPanel';
import { PlaygroundView } from './Playground/PlaygroundView';
import { DocsPage } from './Docs/DocsPage';
import { QuizProvider } from '../context/QuizContext';
import { DEFAULT_QUIZ_DATA, VIDEO_URL } from '../utils/constants';
import { PlayerConfig } from '../types';
import '../style.css'; // Main vanilla CSS

export const VidQuizDemo = () => {
  const [view, setView] = useState('landing');
  
  const config: PlayerConfig = {
    videoUrl: VIDEO_URL,
    theme: 'dark',
    allowSkip: false,
    showFeedback: true
  };

  return (
    <QuizProvider 
      initialQuestions={DEFAULT_QUIZ_DATA} 
      config={config}
      callbacks={{
        onComplete: (res) => console.log('Quiz Complete!', res),
        onAnswer: (ans) => console.log('Answered:', ans)
      }}
    >
      <div className="vq-app-root vq-theme-dark">
        <Navbar currentView={view} onNavigate={setView} />
        <main className="vq-main-content">
          {view === 'docs' && <DocsPage onNavigate={setView} />}
          {view === 'playground' && <PlaygroundView />}
          {view === 'admin' && <AdminPanel />}
          {view === 'player' && (
            <div className="vq-container vq-pt-12 vq-px-6">
              <InteractiveVideoPlayer />
            </div>
          )}
          {view === 'landing' && <LandingPage onNavigate={setView} />}
        </main>
      </div>
    </QuizProvider>
  );
};
