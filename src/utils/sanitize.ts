import { marked } from 'marked';

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: false,
  mangle: false
});

// Custom renderer to add classes and attributes
const renderer = new marked.Renderer();

renderer.link = (href, title, text) => {
  if (!href) return text;
  return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-[#1d9bf0] hover:underline">${text}</a>`;
};

renderer.hr = () => {
  return '<hr class="my-4 border-[#2f3336]" />';
};

marked.use({ renderer });

// Sanitize markdown before parsing
export const sanitizeMarkdown = (markdown: string): string => {
  return markdown
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/^(#{1,6})\s*/gm, '$1 ') // Ensure space after headings
    .trim();
};