import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Question, PlayerConfig, QuizCallbacks, AnswerEvent, QuizProgress, QuizResult } from '../types';
import { useQuizEngine } from '../hooks/useQuizEngine';
import { storageService } from '../services/storageService';

interface QuizContextType {
  // Data State
  questions: Question[];
  config: PlayerConfig;
  setQuestions: (q: Question[]) => void;
  
  // Progress/Score State
  progress: QuizProgress;
  
  // Engine State
  engine: ReturnType<typeof useQuizEngine>;
  
  // Callbacks
  handleAnswerSubmit: (answer: string) => boolean; // Returns true if correct
  completeQuiz: (timeSpent: number) => void;
}

const QuizContext = createContext<QuizContextType | null>(null);

export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (!context) throw new Error('useQuizContext must be used within a QuizProvider');
  return context;
};

interface QuizProviderProps {
  children: ReactNode;
  initialQuestions?: Question[];
  config?: PlayerConfig;
  callbacks?: QuizCallbacks;
}

export const QuizProvider = ({ 
  children, 
  initialQuestions = [], 
  config = { videoUrl: '' }, 
  callbacks 
}: QuizProviderProps) => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const engine = useQuizEngine(questions);
  
  // Update progress
  const progress: QuizProgress = {
    answeredCount: engine.askedQuestions.length,
    totalQuestions: questions.length,
    score: engine.score,
    percentage: questions.length > 0 ? (engine.askedQuestions.length / questions.length) * 100 : 0
  };

  // Sync with callbacks
  useEffect(() => {
    if (callbacks?.onProgress) callbacks.onProgress(progress);
  }, [progress.answeredCount, progress.score]);

  useEffect(() => {
    if (engine.showOverlay && engine.currentQuestion && callbacks?.onQuestionShow) {
      callbacks.onQuestionShow(engine.currentQuestion);
    }
  }, [engine.showOverlay, engine.currentQuestion]);

  const handleAnswerSubmit = useCallback((userAnswer: string): boolean => {
    const result = engine.handleAnswer(userAnswer);
    const fullAnswer: AnswerEvent = { ...result, timestamp: new Date().toISOString() };
    
    // Save locally
    storageService.saveLocalAnswer(fullAnswer);
    
    // Fire callback
    if (callbacks?.onAnswer) callbacks.onAnswer(fullAnswer);
    
    return result.isCorrect;
  }, [engine, callbacks]);

  const completeQuiz = useCallback((timeSpent: number) => {
    const result: QuizResult = {
      ...progress,
      answers: storageService.getLocalAnswers(),
      timeSpent
    };
    if (callbacks?.onComplete) callbacks.onComplete(result);
  }, [progress, callbacks]);

  return (
    <QuizContext.Provider value={{
      questions,
      config,
      setQuestions,
      progress,
      engine,
      handleAnswerSubmit,
      completeQuiz
    }}>
      {children}
    </QuizContext.Provider>
  );
};
