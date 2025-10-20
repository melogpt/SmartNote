# SmartStudy - AI Study Assistant

A modern, minimalist study app that uses AI to transform your notes into summaries, quizzes, and flashcards.

## Features

- 📝 **Smart Summarization**: Convert lengthy notes into concise summaries
- 🎯 **Interactive Quizzes**: Generate multiple-choice questions from your content
- 🃏 **Flashcards**: Create study cards with flip animations
- 🎨 **Modern UI**: Clean, minimal design with smooth animations
- 📱 **Responsive**: Works perfectly on desktop and mobile

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **AI**: Google Gemini 1.5 Flash

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **API Key**: The Gemini API key is already configured in the code.

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## How to Use

1. Paste your study notes in the text area
2. Click one of the three action buttons:
   - **Summarize**: Get a concise summary of your notes
   - **Create Quiz**: Generate multiple-choice questions
   - **Generate Flashcards**: Create interactive study cards
3. View results in the tabbed interface below
4. For flashcards, click any card to flip and reveal the answer

## Project Structure

```
src/
├── components/          # React components
│   ├── Navbar.tsx      # Navigation header
│   ├── InputArea.tsx   # Text input and action buttons
│   ├── ResultsSection.tsx # Tabbed results display
│   └── Footer.tsx      # Footer component
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
│   └── gemini.ts      # Gemini API integration
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## Color Palette

- **Primary**: #4F46E5 (Indigo 600)
- **Secondary**: #A78BFA (Purple 400)
- **Background**: #F9FAFB (Light gray)
- **Text**: #111827 (Dark gray)

## Made with ❤️ and Cursor
