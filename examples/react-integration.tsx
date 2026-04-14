import React, { useState } from 'react';
// Assuming vidquiz is installed via npm
import { InteractiveVideoPlayer, QuizProvider, Question } from '../../src/index';

const mockQuestions: Question[] = [
  { id: '1', time: 5, type: 'boolean', question: 'React runs on the server by default (in raw React)', answer: 'False' },
  { id: '2', time: 12, type: 'mcq', question: 'What does CSS stand for?', options: ['Cascading Style Sheets', 'Computer Style System'], answer: 'Cascading Style Sheets' }
];

export default function VidQuizIntegrationExample() {
  const [complete, setComplete] = useState(false);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h1>My Next.js Course Module</h1>
      
      {complete && (
        <div style={{ padding: 10, background: '#10b981', color: 'white', marginBottom: 20 }}>
          Module Complete! Proceed to next lesson.
        </div>
      )}

      <QuizProvider
        initialQuestions={mockQuestions}
        config={{
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          theme: 'light',
          allowSkip: true
        }}
        callbacks={{
          onComplete: (res) => {
            console.log("Saving to DB...", res);
            setComplete(true);
          },
          onAnswer: (ans) => {
            console.log("Tracking analytics...", ans);
          }
        }}
      >
        {/* The player will automatically hook into the context above */}
        <InteractiveVideoPlayer />
      </QuizProvider>
    </div>
  );
}
