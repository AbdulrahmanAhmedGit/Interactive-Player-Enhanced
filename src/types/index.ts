export type QuestionType = 'input' | 'mcq' | 'boolean';

export interface BaseQuestion {
  id?: string;
  time: number;
  type: QuestionType;
  question: string;
  answer: string | string[];
}

export interface InputQuestion extends BaseQuestion {
  type: 'input';
  answer: string | string[]; // Can be array of accepted answers
}

export interface MCQQuestion extends BaseQuestion {
  type: 'mcq';
  options: string[];
  answer: string;
}

export interface BooleanQuestion extends BaseQuestion {
  type: 'boolean';
  answer: 'True' | 'False';
}

export type Question = InputQuestion | MCQQuestion | BooleanQuestion;

export interface AnswerEvent {
  questionId: string | number;
  questionText: string;
  userAnswer: string;
  isCorrect: boolean;
  timestamp: string;
}

export interface QuizProgress {
  answeredCount: number;
  totalQuestions: number;
  score: number;
  percentage: number;
}

export interface QuizResult extends QuizProgress {
  answers: AnswerEvent[];
  timeSpent: number;
}

export interface PlayerConfig {
  videoUrl: string;
  theme?: 'light' | 'dark';
  allowSkip?: boolean;
  showFeedback?: boolean;
}

export interface QuizCallbacks {
  onAnswer?: (answer: AnswerEvent) => void;
  onComplete?: (result: QuizResult) => void;
  onProgress?: (progress: QuizProgress) => void;
  onQuestionShow?: (question: Question) => void;
}
