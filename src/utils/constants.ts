import { Question } from '../types';

export const VIDEO_URL = "https://www.w3schools.com/html/mov_bbb.mp4";

export const DEFAULT_QUIZ_DATA: Question[] = [
  { id: 'q1', time: 3, type: "input", question: "What animal is shown in the beginning?", answer: ["bunny", "rabbit", "big buck bunny"] },
  { id: 'q2', time: 7, type: "mcq", question: "What environment is the bunny in?", options: ["Desert", "Forest", "Ocean", "Space"], answer: "Forest" }
];
