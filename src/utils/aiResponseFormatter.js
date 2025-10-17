// Format AI response text to replace asterisks with proper formatting
export const formatAIResponse = (text) => {
  if (!text) return text;
  
  return text
    // First, normalize line breaks and clean up
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    
    // Format main sections (a), (b), (c)
    .replace(/\(([abc])\)\s*([^:]+):/g, '<div class="mt-4 mb-2"><strong class="text-[#1B5E20] text-lg">($1) $2:</strong></div>')
    
    // Format subsections with asterisks
    .replace(/\*\s*([^:*]+):/g, '<div class="mt-3 mb-1"><strong class="text-[#FFB300] font-semibold">• $1:</strong></div>')
    
    // Format bold text **text**
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#1B5E20] font-semibold">$1</strong>')
    
    // Format single asterisk items as bullet points
    .replace(/^\*\s+(.+)$/gm, '<div class="ml-4 mb-2"><span class="text-[#FFB300]">• </span>$1</div>')
    
    // Format numbered lists
    .replace(/^(\d+)\.\s+(.+)$/gm, '<div class="ml-4 mb-2"><span class="text-[#FFB300] font-semibold">$1.</span> $2</div>')
    
    // Add line breaks before main sections
    .replace(/<div class="mt-4 mb-2">/g, '<br><div class="mt-4 mb-2">')
    
    // Clean up multiple spaces
    .replace(/\s+/g, ' ')
    
    // Add proper spacing between paragraphs
    .replace(/\.\s+([A-Z])/g, '.</div><div class="mb-2">$1')
    
    // Wrap remaining text in divs for proper spacing
    .split('\n')
    .map(line => {
      line = line.trim();
      if (!line) return '';
      if (line.includes('<div') || line.includes('<br>')) return line;
      return `<div class="mb-2">${line}</div>`;
    })
    .join('')
    
    // Clean up empty divs and extra breaks
    .replace(/<div class="mb-2"><\/div>/g, '')
    .replace(/<br><br>/g, '<br>')
    .trim();
};

// CSS styles for AI response formatting
export const aiResponseStyles = `
  .ai-response-content div {
    margin-bottom: 0.5rem;
  }
  .ai-response-content .mt-4 {
    margin-top: 1rem;
    padding-top: 0.5rem;
    border-top: 1px solid #e5e7eb;
  }
  .ai-response-content .ml-4 {
    margin-left: 1rem;
    padding-left: 0.5rem;
    border-left: 2px solid #FFB300;
  }
`;