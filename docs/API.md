# VidQuiz API Reference

## Components

### `InteractiveVideoPlayer`
The core video player component. Requires no props directly, as it consumes state from the `QuizProvider`.

### `QuizProvider`
Context provider that holds state, config, and callbacks. Must wrap the player.

**Props:**
- `initialQuestions` (`Question[]`): Array of questions to load initially.
- `config` (`PlayerConfig`): Configuration for the player.
- `callbacks` (`QuizCallbacks`): Event listeners.

---

## Types

### `PlayerConfig`
```typescript
interface PlayerConfig {
  videoUrl: string;             // URL to the .mp4 or stream
  theme?: 'light' | 'dark';     // UI Theme (default: dark)
  allowSkip?: boolean;          // Allow skipping questions (default: false)
  showFeedback?: boolean;       // Show correct/incorrect screen (default: true)
}
```

### `Question`
A union type of 3 possible question variants:

```typescript
export interface InputQuestion {
  id?: string;
  time: number;             // Seconds into the video
  type: 'input';
  question: string;
  answer: string | string[]; // Array allows multiple valid text answers
}

export interface MCQQuestion {
  id?: string;
  time: number;
  type: 'mcq';
  question: string;
  options: string[];        // 2-4 options
  answer: string;           // Must match one option exactly
}

export interface BooleanQuestion {
  id?: string;
  time: number;
  type: 'boolean';
  question: string;
  answer: 'True' | 'False';
}
```

### `QuizCallbacks`
```typescript
interface QuizCallbacks {
  // Fired when user submits an answer
  onAnswer?: (answer: AnswerEvent) => void;
  // Fired when the video ends naturally
  onComplete?: (result: QuizResult) => void;
  // Fired whenever score or answered count changes
  onProgress?: (progress: QuizProgress) => void;
  // Fired exactly when a question pops up on screen
  onQuestionShow?: (question: Question) => void;
}
```
