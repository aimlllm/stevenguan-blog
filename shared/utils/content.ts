// Content management utilities
import { slugify } from './format';

export interface FrontMatter {
  title: string;
  description?: string;
  date: string;
  tags?: string[];
  published?: boolean;
  featured_image?: string;
  author?: string;
}

export interface ParsedContent {
  frontMatter: FrontMatter;
  content: string;
  slug: string;
}

export function parseFrontMatter(content: string): ParsedContent {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);
  
  if (!match) {
    throw new Error('Invalid front matter format');
  }
  
  const [, frontMatterStr, bodyContent] = match;
  const frontMatter = parseFrontMatterString(frontMatterStr);
  const slug = slugify(frontMatter.title);
  
  return {
    frontMatter,
    content: bodyContent.trim(),
    slug,
  };
}

function parseFrontMatterString(frontMatterStr: string): FrontMatter {
  const lines = frontMatterStr.split('\n');
  const frontMatter: any = {};
  
  for (const line of lines) {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim();
      
      // Handle arrays (tags)
      if (key.trim() === 'tags' && value.startsWith('[') && value.endsWith(']')) {
        frontMatter[key.trim()] = value
          .slice(1, -1)
          .split(',')
          .map(tag => tag.trim().replace(/['"]/g, ''));
      }
      // Handle booleans
      else if (value === 'true' || value === 'false') {
        frontMatter[key.trim()] = value === 'true';
      }
      // Handle strings
      else {
        frontMatter[key.trim()] = value.replace(/['"]/g, '');
      }
    }
  }
  
  return frontMatter as FrontMatter;
}

export function createBlogPost(
  title: string,
  content: string,
  options: Partial<FrontMatter> = {}
): string {
  const frontMatter: FrontMatter = {
    title,
    date: new Date().toISOString(),
    published: true,
    ...options,
  };
  
  const frontMatterStr = Object.entries(frontMatter)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}: [${value.map(v => `"${v}"`).join(', ')}]`;
      }
      return `${key}: "${value}"`;
    })
    .join('\n');
  
  return `---\n${frontMatterStr}\n---\n\n${content}`;
}

export function extractExcerpt(content: string, maxLength: number = 200): string {
  // Remove markdown syntax and HTML tags
  const cleanContent = content
    .replace(/#+\s/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();
  
  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }
  
  return cleanContent.substring(0, maxLength).trim() + '...';
}

export function processMarkdown(content: string): string {
  // Basic markdown processing - in production, use a proper library like marked or remark
  return content
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}

export function extractYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export function createYouTubeEmbed(videoId: string): string {
  return `<div class="youtube-embed">
    <iframe 
      width="560" 
      height="315" 
      src="https://www.youtube.com/embed/${videoId}" 
      frameborder="0" 
      allowfullscreen>
    </iframe>
  </div>`;
}

export function processMediaContent(content: string): string {
  // Process YouTube links
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/g;
  
  return content.replace(youtubeRegex, (match, videoId) => {
    return createYouTubeEmbed(videoId);
  });
} 