export interface Tool {
  name: string;
  slug: string;
  description: string;
  icon: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const categories: Category[] = [
  { id: 'organize', name: 'Organize', icon: '📄' },
  { id: 'convert', name: 'Convert', icon: '🔄' },
  { id: 'edit', name: 'Edit', icon: '✏️' },
  { id: 'security', name: 'Security', icon: '🔒' },
];

export const tools: Tool[] = [
  { name: 'Merge PDF', slug: 'merge-pdf', description: 'Combine multiple PDF files into one document.', icon: '📎', category: 'organize' },
  { name: 'Split PDF', slug: 'split-pdf', description: 'Extract specific pages or split a PDF into separate files.', icon: '✂️', category: 'organize' },
  { name: 'Rotate Pages', slug: 'rotate-pdf', description: 'Rotate PDF pages 90, 180, or 270 degrees.', icon: '🔄', category: 'organize' },
  { name: 'Reorder Pages', slug: 'reorder-pdf', description: 'Drag and drop to rearrange PDF pages.', icon: '🔀', category: 'organize' },
  { name: 'Images to PDF', slug: 'images-to-pdf', description: 'Convert JPG, PNG, or WebP images into a PDF document.', icon: '🖼️', category: 'convert' },
  { name: 'HTML to PDF', slug: 'html-to-pdf', description: 'Convert HTML content or a webpage screenshot to PDF.', icon: '🌐', category: 'convert' },
  { name: 'PDF Page Size', slug: 'page-size', description: 'Resize PDF pages to A4, Letter, or custom dimensions.', icon: '📐', category: 'convert' },
  { name: 'Add Watermark', slug: 'watermark-pdf', description: 'Add text or diagonal watermarks to your PDF pages.', icon: '💧', category: 'edit' },
  { name: 'Add Page Numbers', slug: 'page-numbers', description: 'Add page numbers to the header or footer of your PDF.', icon: '🔢', category: 'edit' },
  { name: 'Edit Metadata', slug: 'pdf-metadata', description: 'View and edit PDF title, author, subject, and keywords.', icon: '📝', category: 'edit' },
  { name: 'Protect PDF', slug: 'protect-pdf', description: 'Add password protection to your PDF document.', icon: '🔐', category: 'security' },
  { name: 'PDF Info', slug: 'pdf-info', description: 'View detailed information about a PDF file: pages, size, metadata.', icon: '📊', category: 'security' },
];

export function getToolsByCategory(categoryId: string): Tool[] {
  return tools.filter(t => t.category === categoryId);
}
