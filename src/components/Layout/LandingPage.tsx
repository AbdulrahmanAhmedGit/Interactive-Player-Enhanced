import { Sparkles, Zap, Layout, Save } from 'lucide-react';

export const LandingPage: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="vq-landing">
      <section className="vq-hero">
        <div className="vq-hero-glow" />
        <div className="vq-hero-inner">
          <div className="vq-hero-badge">
            <Sparkles size={16} />
            <span>Now in Public Beta 2.0</span>
          </div>
          <h1>
            Transform passive viewing into <span className="vq-gradient-text">active learning.</span>
          </h1>
          <p>
            Embed MCQs, True/False, and text quizzes directly into your videos to test knowledge instantly.
          </p>
          <div className="vq-hero-actions">
            <button onClick={() => onNavigate('playground')} className="vq-hero-btn-primary">
              Try It Yourself
            </button>
            <button onClick={() => onNavigate('docs')} className="vq-hero-btn-secondary">
              Read the Docs
            </button>
          </div>
        </div>
      </section>

      <section className="vq-features">
        <div className="vq-features-grid">
          <div className="vq-feature-card">
            <Zap className="vq-feature-icon" style={{ color: '#facc15' }} />
            <h3>Timestamp Triggers</h3>
            <p>Set exact moments for your questions to appear, interrupting the flow naturally.</p>
          </div>
          <div className="vq-feature-card">
            <Layout className="vq-feature-icon" style={{ color: '#34d399' }} />
            <h3>Multiple Formats</h3>
            <p>Support for MCQs, True/False, and free-text inputs to test any type of knowledge.</p>
          </div>
          <div className="vq-feature-card">
            <Save className="vq-feature-icon" style={{ color: '#818cf8' }} />
            <h3>Cloud Progress</h3>
            <p>Scores and answers are securely stored, creating detailed student analytics.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
