import { QuizQuestion, Flashcard } from '../types';

const GEMINI_API_KEY = 'AIzaSyCnY3zUH-r2KVTT4Ov4ttaV78CnpLSnLJc';

export const generateSummary = async (text: string): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not found.');
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `You are a helpful study assistant. Summarize the following text in a clear, educational way that helps students understand the key concepts:\n\n${text}`
        }]
      }],
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      }
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to generate summary');
  }

  if (!data.candidates || data.candidates.length === 0) {
    throw new Error('No response from Gemini API');
  }

  const candidate = data.candidates[0];
  if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
    throw new Error('Invalid response structure from Gemini API');
  }

  return candidate.content.parts[0].text;
};

export const generateQuiz = async (text: string): Promise<QuizQuestion[]> => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not found.');
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `You are a helpful study assistant. Create 5 multiple choice quiz questions from the given text. Return only a valid JSON array with objects containing "question", "options" (array of 4 options), and "correctAnswer" (index 0-3).\n\nText: ${text}`
        }]
      }],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      }
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to generate quiz');
  }

  if (!data.candidates || data.candidates.length === 0) {
    throw new Error('No response from Gemini API');
  }

  const candidate = data.candidates[0];
  if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
    throw new Error('Invalid response structure from Gemini API');
  }

  try {
    const responseText = candidate.content.parts[0].text;
    const quizData = JSON.parse(responseText);
    return Array.isArray(quizData) ? quizData : [];
  } catch (error) {
    console.error('Failed to parse quiz response:', error);
    return [];
  }
};

export const generateFlashcards = async (text: string): Promise<Flashcard[]> => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not found.');
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `You are a helpful study assistant. Generate 5 flashcards from the given text. Return only a valid JSON array with objects containing "front" (question) and "back" (answer) properties.\n\nText: ${text}`
        }]
      }],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      }
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to generate flashcards');
  }

  if (!data.candidates || data.candidates.length === 0) {
    throw new Error('No response from Gemini API');
  }

  const candidate = data.candidates[0];
  if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
    throw new Error('Invalid response structure from Gemini API');
  }

  try {
    const responseText = candidate.content.parts[0].text;
    const flashcardData = JSON.parse(responseText);
    return Array.isArray(flashcardData) ? flashcardData : [];
  } catch (error) {
    console.error('Failed to parse flashcard response:', error);
    return [];
  }
};
