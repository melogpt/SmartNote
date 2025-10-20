import { QuizQuestion, Flashcard } from '../types';

const GEMINI_API_KEY = 'GEMINIAPIKEY';

// Test function to list available models
export const listAvailableModels = async () => {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-goog-api-key': GEMINI_API_KEY,
    },
  });

  const data = await response.json();
  console.log('Available models:', data);
  return data;
};

export const generateSummary = async (text: string): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not found.');
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-goog-api-key': GEMINI_API_KEY,
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

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-goog-api-key': GEMINI_API_KEY,
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `You are a helpful study assistant. Create 5 multiple choice quiz questions from the given text. Return ONLY a valid JSON array. Do not include any other text, explanations, or markdown formatting. The JSON should have this exact structure:

[{"question": "Question text here", "options": ["Option A", "Option B", "Option C", "Option D"], "correctAnswer": 0}]

Text: ${text}`
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
    console.log('Raw quiz response:', responseText); // Debug için
    
    // JSON içeriğini temizle (markdown ```json``` wrapper'ları çıkar)
    let cleanText = responseText.trim();
    
    // Markdown code blocks'ları temizle
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    // Başlangıç ve bitiş boşlukları/satır sonları temizle
    cleanText = cleanText.trim();
    
    const quizData = JSON.parse(cleanText);
    return Array.isArray(quizData) ? quizData : [];
  } catch (error) {
    console.error('Failed to parse quiz response:', error);
    console.error('Response text was:', candidate.content.parts[0].text);
    return [];
  }
};

export const generateFlashcards = async (text: string): Promise<Flashcard[]> => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not found.');
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-goog-api-key': GEMINI_API_KEY,
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `You are a helpful study assistant. Generate 5 flashcards from the given text. Return ONLY a valid JSON array. Do not include any other text, explanations, or markdown formatting. The JSON should have this exact structure:

[{"front": "Question or term here", "back": "Answer or definition here"}]

Text: ${text}`
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
    console.log('Raw flashcard response:', responseText); // Debug için
    
    // JSON içeriğini temizle (markdown ```json``` wrapper'ları çıkar)
    let cleanText = responseText.trim();
    
    // Markdown code blocks'ları temizle
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    // Başlangıç ve bitiş boşlukları/satır sonları temizle
    cleanText = cleanText.trim();
    
    const flashcardData = JSON.parse(cleanText);
    return Array.isArray(flashcardData) ? flashcardData : [];
  } catch (error) {
    console.error('Failed to parse flashcard response:', error);
    console.error('Response text was:', candidate.content.parts[0].text);
    return [];
  }
};
