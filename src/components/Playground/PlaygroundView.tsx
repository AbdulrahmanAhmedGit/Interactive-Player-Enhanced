import React, { useState } from 'react';
import { InteractiveVideoPlayer } from '../Player/InteractiveVideoPlayer';
import { useQuizContext } from '../../context/QuizContext';
import { Video, HelpCircle, PlusCircle, Link, Upload as UploadIcon } from 'lucide-react';
import { QuestionForm } from '../Admin/QuestionForm';

export const PlaygroundView: React.FC = () => {
  const { questions, setQuestions, config } = useQuizContext();
  const [videoSource, setVideoSource] = useState<'url' | 'upload'>('url');
  const [videoUrlInput, setVideoUrlInput] = useState(config.videoUrl);
  const [activeUrl, setActiveUrl] = useState(config.videoUrl);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (videoUrlInput) setActiveUrl(videoUrlInput);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setActiveUrl(url);
    }
  };

  const handleDelete = (id: string) => {
    setQuestions(questions.filter(q => (q.id || String(q.time)) !== id));
  };

  return (
    <div className="vq-container vq-animate-in">
      <div className="vq-score-header" style={{ marginBottom: '2rem' }}>
        <div>
          <Video style={{ color: '#8B5CF6' }} />
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Try It Yourself</h2>
            <p style={{ color: 'var(--vq-text-secondary)', fontSize: '0.875rem' }}>
              Upload a video or paste a URL to generate an interactive experience.
            </p>
          </div>
        </div>
      </div>

      <div className="vq-admin-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="vq-card">
            <div className="vq-card-header">
              <h3 className="vq-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Video size={18} /> Video Source
              </h3>
            </div>
            <div className="vq-card-content">
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <button
                  className={`vq-btn ${videoSource === 'url' ? 'vq-btn-primary' : 'vq-btn-secondary'}`}
                  onClick={() => setVideoSource('url')}
                  style={{ flex: 1 }}
                >
                  <Link size={16} /> Paste URL
                </button>
                <button
                  className={`vq-btn ${videoSource === 'upload' ? 'vq-btn-primary' : 'vq-btn-secondary'}`}
                  onClick={() => setVideoSource('upload')}
                  style={{ flex: 1 }}
                >
                  <UploadIcon size={16} /> Upload File
                </button>
              </div>

              {videoSource === 'url' ? (
                <form onSubmit={handleUrlSubmit} className="vq-input-wrapper">
                  <label className="vq-label">Video URL (MP4)</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="url"
                      className="vq-input"
                      value={videoUrlInput}
                      onChange={(e) => setVideoUrlInput(e.target.value)}
                      placeholder="https://example.com/video.mp4"
                    />
                    <button type="submit" className="vq-btn vq-btn-primary">Load</button>
                  </div>
                </form>
              ) : (
                <div className="vq-input-wrapper">
                  <label className="vq-label">Local Video File</label>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/ogg"
                    onChange={handleFileUpload}
                    className="vq-input"
                  />
                  <p style={{ fontSize: '0.75rem', color: 'var(--vq-text-muted)', marginTop: '0.5rem' }}>
                    Note: Local files are kept on your computer and never uploaded to our servers.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="vq-card">
            <div className="vq-card-header">
              <h3 className="vq-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HelpCircle size={18} /> Questions Added ({questions.length})
              </h3>
            </div>
            <div className="vq-card-content" style={{ maxHeight: '350px', overflowY: 'auto' }}>
              {questions.length === 0 ? (
                <div className="vq-empty-state" style={{ padding: '2rem 1rem' }}>
                  <HelpCircle className="vq-empty-state-icon" size={32} />
                  <p>No questions added yet.</p>
                  <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Pause the video and click the + button to add one.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {questions.sort((a, b) => a.time - b.time).map((q, idx) => (
                    <div key={q.id || idx} style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: 'var(--vq-radius-md)', border: '1px solid var(--vq-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <span className="vq-badge vq-badge-primary">
                          {Math.floor(q.time / 60)}:{(q.time % 60).toString().padStart(2, '0')}
                        </span>
                        <button
                          onClick={() => handleDelete(q.id || String(q.time))}
                          className="vq-btn vq-btn-ghost vq-btn-sm"
                          style={{ color: 'var(--vq-danger)' }}
                        >
                          Remove
                        </button>
                      </div>
                      <p style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{q.question}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--vq-text-muted)', marginTop: '0.25rem' }}>Type: {q.type.toUpperCase()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="vq-card" style={{ padding: '0.5rem', background: '#000' }}>
            {/* The interactive video player itself */}
            <InteractiveVideoPlayer customVideoUrl={activeUrl} isCreatorMode={true} />
          </div>
          
          <div className="vq-card" style={{ padding: '1.5rem', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#818cf8', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PlusCircle size={16} /> How to add a question
            </h3>
            <ol style={{ paddingLeft: '1.25rem', color: 'var(--vq-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Play the video until you reach the desired moment.</li>
              <li>Pause the video.</li>
              <li>A floating "Add Question At This Moment" button will appear above the video timeline.</li>
              <li>Click it to open a quick form, and fill in your question!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
