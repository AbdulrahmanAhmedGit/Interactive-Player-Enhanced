import React, { useState } from 'react';
import { BookOpen, Code, PlayCircle, Layers, HelpCircle, Search, Menu, X } from 'lucide-react';

type DocSection = 'intro' | 'getting-started' | 'usage' | 'api' | 'faq';

export const DocsPage: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
  const [activeSection, setActiveSection] = useState<DocSection>('intro');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'intro', label: 'What is VidQuiz?', icon: BookOpen },
    { id: 'getting-started', label: 'Getting Started', icon: PlayCircle },
    { id: 'usage', label: 'Usage Guide', icon: Layers },
    { id: 'api', label: 'API Reference', icon: Code },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
  ];

  return (
    <div className="vq-container vq-animate-in" style={{ maxWidth: '1000px', display: 'flex', gap: '2rem', padding: '2rem 1.5rem', minHeight: '80vh' }}>
      
      {/* Mobile Menu Toggle */}
      <div className="vq-docs-mobile-nav" style={{ display: 'none' }}>
        <button className="vq-btn vq-btn-ghost" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />} Menu
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        className="vq-docs-sidebar" 
        style={{ 
          width: '250px', 
          flexShrink: 0, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem',
          borderRight: '1px solid var(--vq-border)',
          paddingRight: '1rem'
        }}
      >
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--vq-text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search docs..." 
            className="vq-input" 
            style={{ paddingLeft: '2.5rem', borderRadius: 'var(--vq-radius-full)' }} 
          />
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--vq-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
            Documentation
          </span>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as DocSection)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--vq-radius-md)',
                  border: 'none',
                  background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  color: isActive ? 'var(--vq-primary)' : 'var(--vq-text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'var(--vq-transition)',
                }}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <button onClick={() => onNavigate('playground')} className="vq-btn vq-btn-primary vq-w-full">
            <PlayCircle size={16}/> Try Playground
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <main style={{ flex: 1, padding: '0 1rem', paddingBottom: '4rem' }}>
        {activeSection === 'intro' && (
          <div className="vq-docs-content">
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: 'white' }}>Welcome to VidQuiz</h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--vq-text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
              VidQuiz is a developer-friendly library to seamlessly embed interactive questions, multiple-choice quizzes, and dynamic checkpoints into HTML5 videos.
            </p>
            <div className="vq-card" style={{ padding: '1.5rem', marginBottom: '2rem', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'var(--vq-primary-glow)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.125rem', color: '#818cf8', marginBottom: '0.75rem' }}>
                <HelpCircle size={18}/> Who is this for?
              </h3>
              <p style={{ color: 'var(--vq-text-primary)' }}>
                <strong>For Teachers & Creators:</strong> Use the Try it Yourself mode to quickly drag-and-drop questions over a video without any coding.<br/><br/>
                <strong>For Developers:</strong> Easily integrate our pure React component into your Next.js or Vite codebase.
              </p>
            </div>
          </div>
        )}

        {activeSection === 'getting-started' && (
          <div className="vq-docs-content">
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: 'white' }}>Getting Started</h1>
            <p style={{ color: 'var(--vq-text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Installation is quick and straightforward. You can use VidQuiz with any standard React based project.
            </p>
            
            <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '0.5rem' }}>1. Install via NPM</h3>
            <pre style={{ background: '#000', padding: '1rem', borderRadius: 'var(--vq-radius-md)', border: '1px solid var(--vq-border)', marginBottom: '2rem', color: '#a78bfa', fontFamily: 'monospace' }}>
              npm install vidquiz --save
            </pre>

            <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '0.5rem' }}>2. Import the Styles</h3>
            <pre style={{ background: '#000', padding: '1rem', borderRadius: 'var(--vq-radius-md)', border: '1px solid var(--vq-border)', marginBottom: '1.5rem', color: '#a78bfa', fontFamily: 'monospace' }}>
              import 'vidquiz/dist/style.css';
            </pre>
          </div>
        )}

        {activeSection === 'usage' && (
          <div className="vq-docs-content">
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: 'white' }}>Usage Guide</h1>
            <p style={{ color: 'var(--vq-text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Wrap the player in a QuizProvider to handle the state.
            </p>
            <pre style={{ background: '#000', padding: '1rem', borderRadius: 'var(--vq-radius-md)', border: '1px solid var(--vq-border)', marginBottom: '1.5rem', color: '#a78bfa', fontFamily: 'monospace', overflowX: 'auto' }}>
{`import { QuizProvider, InteractiveVideoPlayer } from 'vidquiz';

const App = () => (
  <QuizProvider initialQuestions={[...]}>
    <InteractiveVideoPlayer />
  </QuizProvider>
);`}
            </pre>
          </div>
        )}

        {activeSection === 'api' && (
          <div className="vq-docs-content">
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: 'white' }}>API Reference</h1>
            
            <div className="vq-card" style={{ marginBottom: '2rem' }}>
              <div className="vq-card-header"><h3 className="vq-card-title">QuizProvider Props</h3></div>
              <div className="vq-card-content">
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--vq-border)', color: 'var(--vq-text-muted)' }}>
                      <th style={{ padding: '0.5rem 0' }}>Prop</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem 0', color: 'var(--vq-primary)' }}>initialQuestions</td>
                      <td style={{ color: 'var(--vq-text-secondary)' }}>QuizQuestion[]</td>
                      <td style={{ color: 'var(--vq-text-secondary)' }}>Array of questions to load initially</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '1rem 0', color: 'var(--vq-primary)' }}>config</td>
                      <td style={{ color: 'var(--vq-text-secondary)' }}>PlayerConfig</td>
                      <td style={{ color: 'var(--vq-text-secondary)' }}>Custom configuration (theme, url, options)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'faq' && (
          <div className="vq-docs-content">
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: 'white' }}>FAQ</h1>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', color: 'white', marginBottom: '0.5rem' }}>Does this require Firebase?</h3>
              <p style={{ color: 'var(--vq-text-secondary)' }}>No. By default, VidQuiz operates entirely client-side using React context. You can optionally hook it up to your backend or Firebase.</p>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', color: 'white', marginBottom: '0.5rem' }}>Can I use YouTube videos?</h3>
              <p style={{ color: 'var(--vq-text-secondary)' }}>Currently, VidQuiz requires direct MP4/WebM video links or local file uploads to ensure precise HTML5 timeline control.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
