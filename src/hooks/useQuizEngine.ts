import { useState, useCallback, useMemo } from 'react';
import { Question, AnswerEvent } from '../types';

export const useQuizEngine = (questions: Question[]) => {
  // Sort questions by time to allow index tracking instead of .find() iteration
  const sortedQuestions = useMemo(() => {
    return [...questions].sort((a, b) => a.time - b.time);
  }, [questions]);

  const [askedQuestionIds, setAskedQuestionIds] = useState<Set<string>>(new Set());
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [score, setScore] = useState(0);

  // Return true if a question should be triggered
  const checkTriggers = useCallback((currentTime: number) => {
    if (showOverlay) return false;

    // Use binary search or linear sweep since it's sorted
    // Assuming small n, linear is fine, but it avoids searching ALL every frame
    for (const q of sortedQuestions) {
      if (currentTime >= q.time) {
        const qId = q.id || String(q.time);
        if (!askedQuestionIds.has(qId)) {
          // Found a trigger!
          setCurrentQuestion(q);
          setShowOverlay(true);
          setAskedQuestionIds(prev => {
            const newSet = new Set(prev);
            newSet.add(qId);
            return newSet;
          });
          return true; // We triggered one
        }
      } else {
        // Since array is sorted, if currentTime < q.time, we can early exit
        break; 
      }
    }
    return false;
  }, [sortedQuestions, askedQuestionIds, showOverlay]);

  const validateAnswer = (question: Question, userAnswer: string): boolean => {
    if (!userAnswer) return false;
    
    if (question.type === 'input') {
      const answers = Array.isArray(question.answer) ? question.answer : [question.answer];
      return answers.some(ans => ans.toLowerCase().trim() === userAnswer.toLowerCase().trim());
    } else {
      return userAnswer === question.answer;
    }
  };

  const handleAnswer = (userAnswer: string): Omit<AnswerEvent, 'timestamp'> => {
    if (!currentQuestion) throw new Error("No active question");
    
    const isCorrect = validateAnswer(currentQuestion, userAnswer);
    if (isCorrect) {
      setScore(s => s + 1);
    }
    
    return {
      questionId: currentQuestion.id || currentQuestion.time,
      questionText: currentQuestion.question,
      userAnswer,
      isCorrect
    };
  };

  const resume = () => {
    setShowOverlay(false);
    setCurrentQuestion(null);
  };

  const reset = () => {
    setAskedQuestionIds(new Set());
    setScore(0);
    setShowOverlay(false);
    setCurrentQuestion(null);
  };

  return {
    askedQuestions: Array.from(askedQuestionIds),
    currentQuestion,
    showOverlay,
    score,
    totalQuestions: questions.length,
    
    checkTriggers,
    handleAnswer,
    resume,
    reset
  };
};
