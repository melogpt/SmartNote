export interface AIResponse {
  summary?: string;
  quiz?: QuizQuestion[];
  flashcards?: Flashcard[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Flashcard {
  front: string;
  back: string;
}

export type TabType = 'summary' | 'quiz' | 'flashcards';
