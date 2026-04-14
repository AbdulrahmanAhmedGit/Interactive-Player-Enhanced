import { PlayCircle, Video, FileText, Sparkles } from 'lucide-react';

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
          {currentView !== 'docs' && (
            <button onClick={() => onNavigate('docs')} className="vq-nav-link">
              <FileText size={16} /> Docs
            </button>
          )}
          {currentView !== 'playground' && (
            <button onClick={() => onNavigate('playground')} className="vq-btn vq-btn-primary vq-btn-sm" style={{ borderRadius: 'var(--vq-radius-full)' }}>
              <Sparkles size={16} /> Try It Yourself
            </button>
          )}
          {currentView === 'admin' && (
            <button onClick={() => onNavigate('player')} className="vq-nav-link">
              <Video size={16} /> Watch Video
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
