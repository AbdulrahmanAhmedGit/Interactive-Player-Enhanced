import { PlayCircle, Settings, Video } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="vq-navbar">
      <div className="vq-navbar-inner">
        <div className="vq-navbar-brand" onClick={() => onNavigate('landing')}>
          <div className="vq-navbar-logo">
            <PlayCircle size={18} />
          </div>
          <span className="vq-navbar-title">VidQuiz<span className="vq-accent">.</span></span>
        </div>
        
        <div className="vq-navbar-actions">
          {currentView !== 'admin' && (
            <button onClick={() => onNavigate('admin')} className="vq-nav-link">
              <Settings size={16} /> Creator Mode
            </button>
          )}
          {currentView !== 'player' && currentView !== 'landing' && (
            <button onClick={() => onNavigate('player')} className="vq-nav-link">
              <Video size={16} /> Watch Video
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
