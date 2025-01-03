import { GoogleGenerativeAI } from '@google/generative-ai';
import { marked } from 'marked';
import { sanitizeMarkdown } from './sanitize';
import { useAIStore } from '../store/aiStore';

let genAI: GoogleGenerativeAI | null = null;

export const initGemini = () => {
  const { customApiKey } = useAIStore.getState();
  const apiKey = customApiKey || import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('Gemini API key not found. AI features will be disabled.');
    return false;
  }

  try {
    genAI = new GoogleGenerativeAI(apiKey);
    return true;
  } catch (error) {
    console.error('Failed to initialize Gemini:', error);
    return false;
  }
};

export const summarizeTweet = async (text: string): Promise<string> => {
  if (!genAI) {
    throw new Error('Gemini AI not initialized');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const prompt = `Summarize this tweet in a concise way: "${text}"`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Failed to generate summary:', error);
    throw new Error('Failed to generate summary');
  }
};

export const askAboutBookmarks = async (
  question: string,
  bookmarks: any[],
  onStream: (chunk: string) => void
): Promise<void> => {
  const { queryCount, incrementQueryCount, customApiKey } = useAIStore.getState();
  
  // Check query limit only if using default API key
  if (!customApiKey && queryCount >= 2) {
    throw new Error('You have reached the free query limit. Please add your own API key to continue using AI features.');
  }

  if (!genAI) {
    throw new Error('Gemini AI not initialized');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  // Create a context string from the bookmarks
  const context = bookmarks
    .map((b, i) => `[${i + 1}] Post by @${b.username}: "${b.text}"`)
    .join('\n\n');

  const prompt = `Analyze these bookmarked posts and answer the following question:

${context}

Question: ${question}

Please provide a concise response:
1. Keep it under 3-4 paragraphs
2. Focus on the most relevant posts
3. Use [n] to reference posts
4. Highlight key points with **bold**
5. Include brief quotes when relevant`;

  try {
    const result = await model.generateContentStream(prompt);
    let accumulatedText = '';
    
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      accumulatedText += chunkText;
      const formattedChunk = formatAIResponse(accumulatedText, bookmarks);
      onStream(formattedChunk);
    }
    
    // Increment query count only if using default API key
    if (!customApiKey) {
      incrementQueryCount();
    }
  } catch (error) {
    console.error('Failed to generate answer:', error);
    throw new Error('Failed to generate answer');
  }
};

const formatAIResponse = (text: string, bookmarks: any[]): string => {
  // Replace [n] references with links
  let formattedText = text.replace(/\[(\d+)\](?!\()/g, (_, num) => {
    const index = parseInt(num) - 1;
    if (bookmarks[index]) {
      const username = bookmarks[index].username;
      const id = bookmarks[index].id;
      return `[${num}](https://x.com/${username}/status/${id})`;
    }
    return `[${num}]`;
  });

  // Add target="_blank" to all links
  marked.use({
    renderer: {
      link(href, title, text) {
        return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-[#1d9bf0] hover:underline">${text}</a>`;
      }
    }
  });

  // Sanitize and convert markdown to HTML
  const sanitized = sanitizeMarkdown(formattedText);
  return marked(sanitized);
};