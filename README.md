# AI Fit & Try

A Virtual Try-On & Size Recommendation Web App built with React, Vite, TypeScript, and Tailwind CSS.

## Features

- **Virtual Try-On**: Upload your photo and an outfit to see how it looks.
- **Size Recommendation**: Get AI-powered size suggestions based on your measurements.
- **Camera Integration**: Capture photos directly from your device.
- **Modern UI**: Clean, minimal, and responsive design.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1.  Clone the repository (if not already done).
2.  Install dependencies:

    ```bash
    npm install
    ```

    _Note: You may need to clear some disk space if you encounter `ENOSPC` errors._

3.  Start the development server:

    ```bash
    npm run dev
    ```

4.  Open your browser and navigate to `http://localhost:5173`.

## Project Structure

- `src/components`: Reusable UI components.
- `src/pages`: Application pages (Home, Upload, Result).
- `src/lib`: Utility functions.
- `src/App.tsx`: Main application component and routing.

## Tech Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- Lucide React (Icons)
- React Router DOM

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
