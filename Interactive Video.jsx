import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, Pause, Maximize, Volume2, VolumeX, CheckCircle2, 
  XCircle, ChevronRight, PlayCircle, Zap, Shield, Layout,
  RotateCcw, Sparkles, Settings, Plus, Trash2,
  Save, LayoutDashboard, Video, ChevronLeft
} from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';

// --- INITIALIZE FIREBASE SAFELY ---
let app = null;
let auth = null;
let db = null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};

try {
  if (Object.keys(firebaseConfig).length > 0) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } else {
    console.warn("Firebase config is empty. App will run in offline/fallback mode.");
  }
} catch (error) {
  console.error("Global Firebase initialization failed:", error);
}

// --- CONSTANTS ---
const VIDEO_URL = "https://www.w3schools.com/html/mov_bbb.mp4";

// Fallback data if Firestore is empty
const DEFAULT_QUIZ_DATA = [
  { time: 3, type: "input", question: "What animal is shown in the beginning?", answer: "bunny" },
  { time: 7, type: "mcq", question: "What environment is the bunny in?", options: ["Desert", "Forest", "Ocean", "Space"], answer: "Forest" }
];

// --- COMPONENTS ---

// 1. Interactive Video Player Component
const InteractiveVideoPlayer = ({ questions, user, onSaveAnswer }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const [showOverlay, setShowOverlay] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [askedQuestions, setAskedQuestions] = useState([]);
  const [score, setScore] = useState(0);

  // Play/Pause
  const togglePlay = () => {
    if (showOverlay) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(e => console.error("Play error:", e));
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Time Update & Trigger
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    setCurrentTime(current);
    setProgress((current / videoRef.current.duration) * 100);

    const upcomingQuestion = questions.find(q => 
      current >= q.time && !askedQuestions.includes(q.id || q.time)
    );

    if (upcomingQuestion && !showOverlay) {
      videoRef.current.pause();
      setIsPlaying(false);
      setCurrentQuestion(upcomingQuestion);
      setShowOverlay(true);
      setAskedQuestions(prev => [...prev, upcomingQuestion.id || upcomingQuestion.time]);
    }
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const m = Math.floor(timeInSeconds / 60);
    const s = Math.floor(timeInSeconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e) => {
    if (!videoRef.current || showOverlay || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * videoRef.current.duration;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const submitAnswer = (answer) => {
    if (!answer) return;
    setUserAnswer(answer);
    
    // Validation
    let isCorrect = false;
    if (currentQuestion.type === 'input') {
      isCorrect = answer.toLowerCase().trim() === currentQuestion.answer.toLowerCase().trim() || 
                  (currentQuestion.answer.toLowerCase() === "bunny" && answer.toLowerCase().trim() === "rabbit");
    } else {
      isCorrect = answer === currentQuestion.answer;
    }

    if (isCorrect) {
      setFeedback('correct');
      setScore(s => s + 1);
    } else {
      setFeedback('incorrect');
    }

    // Save to Firestore
    if (user && onSaveAnswer) {
      onSaveAnswer({
        questionId: currentQuestion.id || currentQuestion.time,
        questionText: currentQuestion.question,
        userAnswer: answer,
        isCorrect,
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleSubmitInput = (e) => {
    e.preventDefault();
    submitAnswer(userAnswer);
  };

  const handleResume = () => {
    setShowOverlay(false);
    setCurrentQuestion(null);
    setUserAnswer("");
    setFeedback(null);
    videoRef.current.play().catch(e => console.error("Resume error:", e));
    setIsPlaying(true);
  };

  const handleRetry = () => {
    setUserAnswer("");
    setFeedback(null);
  };

  return (
    <div className="space-y-4">
      {/* Score Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 rounded-xl border border-white/5">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          <span className="font-semibold text-white">Interactive Session</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-400">
            Progress: <span className="text-white font-medium">{askedQuestions.length}/{questions.length}</span>
          </div>
          <div className="h-4 w-px bg-white/10"></div>
          <div className="text-sm text-slate-400">
            Score: <span className="text-emerald-400 font-bold">{score}</span>
          </div>
        </div>
      </div>

      <div 
        ref={containerRef} 
        className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-slate-900 ring-1 ring-white/10 group flex items-center justify-center min-h-[300px] md:min-h-[500px]"
      >
        {/* Video Element */}
        {!videoError ? (
          <video
            ref={videoRef}
            className="w-full h-full object-contain cursor-pointer"
            onClick={togglePlay}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={(e) => setDuration(e.target.duration)}
            onEnded={() => setIsPlaying(false)}
            onError={(e) => setVideoError(true)}
            muted={isMuted}
            playsInline
          >
            <source src={VIDEO_URL} type="video/mp4" />
          </video>
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400">
            <XCircle className="w-12 h-12 text-rose-500 mb-4" />
            <p>Video unavailable.</p>
          </div>
        )}

        {/* Quiz Overlay */}
        {showOverlay && currentQuestion && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm transition-all duration-300 animate-in fade-in">
            <div className="bg-slate-900 border border-slate-700/50 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-pink-500"></div>
              
              <h3 className="text-xl font-bold text-white mb-6 text-center leading-relaxed">
                {currentQuestion.question}
              </h3>

              {!feedback ? (
                <React.Fragment>
                  <div className="space-y-4">
                    {currentQuestion.type === 'input' && (
                      <form onSubmit={handleSubmitInput} className="space-y-4">
                        <input
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Type answer..."
                        className="w-full bg-slate-950/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500"
                        autoFocus
                      />
                      <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl px-4 py-3">Submit</button>
                    </form>
                  )}

                  {currentQuestion.type === 'mcq' && (
                    <div className="grid grid-cols-1 gap-3">
                      {currentQuestion.options?.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => submitAnswer(opt)}
                          className="w-full text-left bg-slate-800 hover:bg-indigo-600/20 border border-slate-700 hover:border-indigo-500 text-white rounded-xl px-4 py-3 transition-colors"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {currentQuestion.type === 'boolean' && (
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => submitAnswer("True")} className="bg-slate-800 hover:bg-emerald-600/20 border border-slate-700 hover:border-emerald-500 text-white rounded-xl px-4 py-3 transition-colors">True</button>
                      <button onClick={() => submitAnswer("False")} className="bg-slate-800 hover:bg-rose-600/20 border border-slate-700 hover:border-rose-500 text-white rounded-xl px-4 py-3 transition-colors">False</button>
                    </div>
                  )}
                </div>
              </React.Fragment>
            ) : feedback === 'correct' ? (
              <div className="text-center space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                  <h4 className="text-xl font-bold text-emerald-400">Correct!</h4>
                  <button onClick={handleResume} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-3">Continue</button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <XCircle className="w-16 h-16 text-rose-500 mx-auto" />
                  <h4 className="text-xl font-bold text-rose-400">Incorrect</h4>
                  <div className="flex gap-3">
                    <button onClick={handleRetry} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-4 py-3">Retry</button>
                    <button onClick={handleResume} className="flex-1 bg-slate-800 text-slate-300 rounded-xl px-4 py-3">Skip</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Controls */}
        {!videoError && (
          <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent transition-opacity ${showOverlay ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
            <div className="w-full h-1.5 bg-white/20 rounded-full mb-4 cursor-pointer relative" onClick={handleProgressClick}>
              <div className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full" style={{ width: `${progress}%` }}></div>
              {duration > 0 && questions.map((q, i) => (
                <div key={i} className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full z-10 ${askedQuestions.includes(q.id || q.time) ? 'bg-emerald-400' : 'bg-yellow-400'}`} style={{ left: `${(q.time / duration) * 100}%` }}/>
              ))}
            </div>
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <button onClick={togglePlay}>{isPlaying ? <Pause size={20} /> : <Play size={20} />}</button>
                <button onClick={() => setIsMuted(!isMuted)}>{isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
                <span className="text-xs">{formatTime(currentTime)} / {formatTime(duration)}</span>
              </div>
              <button onClick={toggleFullscreen}><Maximize size={18} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// 2. Admin Panel Component
const AdminPanel = ({ questions, db, appId }) => {
  const [newQ, setNewQ] = useState({ time: 0, type: 'input', question: '', answer: '', options: '' });

  const addQuestion = async (e) => {
    e.preventDefault();
    if (!newQ.question || !newQ.answer) return;
    
    const formattedQ = {
      time: Number(newQ.time),
      type: newQ.type,
      question: newQ.question,
      answer: newQ.answer,
      ...(newQ.type === 'mcq' && { options: newQ.options.split(',').map(s => s.trim()) })
    };

    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'questions'), formattedQ);
      setNewQ({ time: 0, type: 'input', question: '', answer: '', options: '' });
    } catch (err) {
      console.error("Error adding doc:", err);
    }
  };

  const deleteQuestion = async (id) => {
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'questions', id));
    } catch (err) {
      console.error("Error deleting doc:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in">
      <div className="flex items-center gap-3 mb-8">
        <LayoutDashboard className="w-8 h-8 text-indigo-500" />
        <h2 className="text-3xl font-bold text-white">Creator Dashboard</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Col: Add & Generate */}
        <div className="space-y-6">
          {/* Manual Add Box */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" /> Manual Entry
            </h3>
            <form onSubmit={addQuestion} className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs text-slate-400 font-medium">Time (seconds)</label>
                  <input type="number" value={newQ.time} onChange={e=>setNewQ({...newQ, time: e.target.value})} className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2" required />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-slate-400 font-medium">Type</label>
                  <select value={newQ.type} onChange={e=>setNewQ({...newQ, type: e.target.value})} className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2">
                    <option value="input">Text Input</option>
                    <option value="mcq">Multiple Choice</option>
                    <option value="boolean">True / False</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium">Question</label>
                <input type="text" value={newQ.question} onChange={e=>setNewQ({...newQ, question: e.target.value})} className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2" required />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium">Correct Answer</label>
                <input type="text" value={newQ.answer} onChange={e=>setNewQ({...newQ, answer: e.target.value})} className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2" required />
              </div>
              {newQ.type === 'mcq' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-slate-400 font-medium">Options (comma separated)</label>
                  </div>
                  <input type="text" value={newQ.options} onChange={e=>setNewQ({...newQ, options: e.target.value})} placeholder="Opt 1, Opt 2, Opt 3" className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2" required />
                </div>
              )}
              <button type="submit" className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl py-3 mt-2 transition-colors">Add Question</button>
            </form>
          </div>
        </div>

        {/* Right Col: Question List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[600px]">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-xl font-bold text-white">Existing Questions ({questions.length})</h3>
          </div>
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {questions.length === 0 ? (
              <div className="text-center text-slate-500 py-10">No questions added yet.</div>
            ) : (
              questions.map((q, index) => (
                <div key={q.id || `question-${index}-${q.time}`} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex justify-between items-start group">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-indigo-500/20 text-indigo-400 text-xs px-2 py-1 rounded font-mono">{q.time}s</span>
                      <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded uppercase tracking-wider">{q.type}</span>
                    </div>
                    <p className="text-white font-medium mb-1">{q.question}</p>
                    <p className="text-emerald-400 text-sm">✓ {q.answer}</p>
                  </div>
                  <button onClick={() => deleteQuestion(q.id)} className="text-slate-500 hover:text-rose-500 p-2 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


// 3. Main Application Entry
export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('landing'); // 'landing' | 'player' | 'admin'
  const [questions, setQuestions] = useState([]);
  
  // Loading and Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Setup Firebase Auth & Data Listeners
  useEffect(() => {
    let unsubscribeAuth;
    let unsubscribeQuestions;

    const initFirebaseData = async () => {
      try {
        // Safe check if Firebase failed to initialize globally
        if (!auth || !db) {
          console.warn("Firebase is not initialized. Falling back to local data.");
          setQuestions(DEFAULT_QUIZ_DATA);
          setUser({ uid: 'mock-local-user' });
          setLoading(false);
          return;
        }

        // 1. Auth First (Mandatory)
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }

        unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
          if (currentUser) {
            setUser(currentUser);
            // 2. Fetch Public Questions when user is known
            const qRef = collection(db, 'artifacts', appId, 'public', 'data', 'questions');
            unsubscribeQuestions = onSnapshot(qRef, (snapshot) => {
              const fetchedQ = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
              // Sort by time
              fetchedQ.sort((a, b) => a.time - b.time);
              setQuestions(fetchedQ.length > 0 ? fetchedQ : DEFAULT_QUIZ_DATA);
              setLoading(false);
            }, (err) => {
              console.error("Firestore read error:", err);
              setError("Failed to fetch questions. Using defaults.");
              setQuestions(DEFAULT_QUIZ_DATA); // Fallback
              setLoading(false);
            });
          } else {
            console.warn("User auth returned null. Falling back to local settings.");
            setUser({ uid: 'mock-local-user' });
            setQuestions(DEFAULT_QUIZ_DATA);
            setLoading(false);
          }
        });
      } catch (err) {
        console.error("Firebase auth/init execution failed:", err);
        setError("Could not connect to online server.");
        setUser({ uid: 'mock-local-user' });
        setQuestions(DEFAULT_QUIZ_DATA);
        setLoading(false);
      }
    };

    initFirebaseData();

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeQuestions) unsubscribeQuestions();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F1C] flex flex-col items-center justify-center text-slate-200 font-sans">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
        <p className="text-xl font-medium animate-pulse text-indigo-100">Initializing Experience...</p>
      </div>
    );
  }

  const handleSaveAnswer = async (answerData) => {
    if (!user) return;
    try {
      const answersRef = collection(db, 'artifacts', appId, 'users', user.uid, 'answers');
      await addDoc(answersRef, answerData);
    } catch (err) {
      console.error("Error saving answer to Firestore:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* Universal Navigation */}
      <nav className="border-b border-white/5 bg-[#0A0F1C]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setView('landing')}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <PlayCircle className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">VidQuiz<span className="text-indigo-500">.</span></span>
          </div>
          
          <div className="flex items-center gap-4">
            {view !== 'admin' && (
              <button 
                onClick={() => setView('admin')}
                className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors px-4 py-2"
              >
                <Settings className="w-4 h-4" /> Creator Mode
              </button>
            )}
            {view !== 'player' && view !== 'landing' && (
              <button 
                onClick={() => setView('player')}
                className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors px-4 py-2"
              >
                <Video className="w-4 h-4" /> Watch Video
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Dynamic View Routing */}
      <main className="pb-20">
        {view === 'admin' && (
          <div className="pt-8">
            <AdminPanel questions={questions} db={db} appId={appId} />
          </div>
        )}

        {view === 'player' && (
          <div className="pt-12 px-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Live Lesson: The Big Buck Bunny</h2>
              <button onClick={()=>setView('landing')} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm"><ChevronLeft className="w-4 h-4"/> Back</button>
            </div>
            <InteractiveVideoPlayer 
              questions={questions} 
              user={user} 
              onSaveAnswer={handleSaveAnswer} 
            />
          </div>
        )}

        {view === 'landing' && (
          <div className="animate-in fade-in">
            {/* Hero Section */}
            <section className="relative pt-24 pb-20 px-6 overflow-hidden">
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none"></div>
              <div className="max-w-4xl mx-auto text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8">
                  <Sparkles className="w-4 h-4" />
                  <span>Now in Public Beta 2.0</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-[1.1]">
                  Transform passive viewing into <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">active learning.</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                  Embed MCQs, True/False, and text quizzes directly into your videos to test knowledge instantly.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button onClick={() => setView('player')} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-medium px-8 py-4 rounded-full transition-all shadow-xl shadow-indigo-600/20">
                    Try the Player
                  </button>
                  <button onClick={() => setView('admin')} className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white text-lg font-medium px-8 py-4 rounded-full transition-all border border-slate-700">
                    Open Admin Dashboard
                  </button>
                </div>
              </div>
            </section>

            {/* Features Preview */}
            <section className="py-20 px-6 border-t border-white/5 bg-[#0D1326]">
              <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
                <div className="bg-slate-800/50 border border-white/5 p-8 rounded-3xl">
                  <Zap className="w-10 h-10 text-yellow-400 mb-6" />
                  <h3 className="text-xl font-bold text-white mb-3">Timestamp Triggers</h3>
                  <p className="text-slate-400">Set exact moments for your questions to appear, interrupting the flow naturally.</p>
                </div>
                <div className="bg-slate-800/50 border border-white/5 p-8 rounded-3xl">
                  <Layout className="w-10 h-10 text-emerald-400 mb-6" />
                  <h3 className="text-xl font-bold text-white mb-3">Multiple Formats</h3>
                  <p className="text-slate-400">Support for MCQs, True/False, and free-text inputs to test any type of knowledge.</p>
                </div>
                <div className="bg-slate-800/50 border border-white/5 p-8 rounded-3xl">
                  <Save className="w-10 h-10 text-indigo-400 mb-6" />
                  <h3 className="text-xl font-bold text-white mb-3">Cloud Progress</h3>
                  <p className="text-slate-400">Scores and answers are securely stored in Firestore, creating detailed analytics.</p>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}