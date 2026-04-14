# VidQuiz ✨

**Production-ready open-source interactive video quiz player for React.**

Transform passive viewing into active learning. VidQuiz allows you to seamlessly embed Multi-Choice Questions, True/False, and Free Text prompts directly inside your videos.

[![NPM Version](https://img.shields.io/npm/v/vidquiz.svg)](https://npmjs.com/package/vidquiz)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 🌟 Features

- **Timestamp Triggers**: Pause the video automatically at exact timestamps to ask questions.
- **Multiple Formats**: Support for MCQs, True/False, and free-text inputs.
- **Standalone or Cloud**: Use it entirely locally via Props and LocalStorage, or connect it to Firebase for cloud progress sync.
- **Creator Dashboard**: Built-in Admin Panel to visually manage questions (Add, Delete, Set Time).
- **Beautiful UI**: Modern glassmorphic design, fully responsive, and highly customizable.
- **TypeScript**: First-class TS support with strict typing.
- **Framework Agnostic Styles**: The core player uses pure Vanilla CSS (`vq-` prefixed) to prevent class collisions. No Tailwind dependency required.

## 🚀 Installation

```bash
npm install vidquiz lucide-react
```

## 💻 Quick Start

```tsx
import { InteractiveVideoPlayer, QuizProvider, PlayerConfig, Question } from 'vidquiz';
import 'vidquiz/style.css'; // Import the default styling

const myQuestions: Question[] = [
  { id: '1', time: 5, type: 'mcq', question: 'What is Next.js?', options: ['Framework', 'Library'], answer: 'Framework' }
];

const config: PlayerConfig = {
  videoUrl: 'https://example.com/video.mp4',
  theme: 'dark'
};

export default function MyQuizApp() {
  return (
    <QuizProvider 
      initialQuestions={myQuestions} 
      config={config}
      callbacks={{
        onComplete: (result) => console.log('Final Score:', result.score),
        onAnswer: (event) => console.log('User answered:', event.userAnswer)
      }}
    >
       <InteractiveVideoPlayer />
    </QuizProvider>
  );
}
```

## 📖 Documentation

- [API Reference](docs/API.md) - Full definition of all props, hooks, and types.
- [SaaS Scaling Guide](docs/SCALING.md) - How to scale VidQuiz into a multi-tenant platform.
- [Contributing](CONTRIBUTING.md) - Guidelines for contributing to the project.

## 🛠️ Built With

- React (Vite)
- TypeScript
- Lucide React (Icons)
- Firebase (Optional, included in services layer)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
