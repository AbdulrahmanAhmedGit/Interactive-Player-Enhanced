import { Question, AnswerEvent } from '../types';

const STORAGE_PREFIX = 'vidquiz_';

export const storageService = {
  saveLocalAnswer: (answer: AnswerEvent) => {
    const existing = storageService.getLocalAnswers();
    existing.push(answer);
    localStorage.setItem(`${STORAGE_PREFIX}answers`, JSON.stringify(existing));
  },

  getLocalAnswers: (): AnswerEvent[] => {
    const data = localStorage.getItem(`${STORAGE_PREFIX}answers`);
    return data ? JSON.parse(data) : [];
  },

  saveLocalQuestions: (questions: Question[]) => {
    localStorage.setItem(`${STORAGE_PREFIX}questions`, JSON.stringify(questions));
  },

  getLocalQuestions: (): Question[] => {
    const data = localStorage.getItem(`${STORAGE_PREFIX}questions`);
    return data ? JSON.parse(data) : [];
  },

  clearData: () => {
    localStorage.removeItem(`${STORAGE_PREFIX}answers`);
    localStorage.removeItem(`${STORAGE_PREFIX}questions`);
  }
};
