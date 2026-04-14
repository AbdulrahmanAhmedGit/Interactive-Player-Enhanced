# Contributing to VidQuiz

Thank you for your interest in contributing to VidQuiz! We welcome all PRs, bug reports, and feature requests.

## Development Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/vidquiz.git
   cd vidquiz
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   This will start the Vite server providing a full demo environment containing the Landing Page, Admin Dashboard, and the Player. The source code resides in `src/`.

4. **Testing library exports**
   If you make changes to how the library is bundled, you can verify it builds correctly:
   ```bash
   npm run build
   ```
   Check the `dist/` folder to ensure `vidquiz.js` and `style.css` are generated properly.

## Architecture Guidelines

- **Vanilla CSS**: We intentionally avoid Tailwind for the library classes (`vq-*`) to ensure users don't face specificity or clash issues when consuming the component.
- **Custom Hooks over HOCs**: Keep business logic inside `src/hooks`. 
- **Optional Firebase**: Firebase logic in `services/firebase.ts` should never crash the app if credentials are empty. VidQuiz must always remain usable in offline/props-only mode.

## Pull Request Process

1. Create a descriptive branch name `git checkout -b feature/awesome-new-thing`
2. Ensure you run `npm run lint` and resolving any TypeScript/ESLint warnings.
3. Open a PR against the `main` branch with detailed descriptions of the changes provided.
