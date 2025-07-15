// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

export function validateBlogPost(post: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!post.title || post.title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (!post.content || post.content.trim().length === 0) {
    errors.push('Content is required');
  }
  
  if (!post.slug || !isValidSlug(post.slug)) {
    errors.push('Valid slug is required');
  }
  
  return { valid: errors.length === 0, errors };
}

export function validateComment(comment: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!comment.content || comment.content.trim().length === 0) {
    errors.push('Comment content is required');
  }
  
  if (comment.content && comment.content.length > 1000) {
    errors.push('Comment must be less than 1000 characters');
  }
  
  return { valid: errors.length === 0, errors };
}

export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - in production, use a proper library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
} 