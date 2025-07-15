// Shared constants
export const SITE_CONFIG = {
  name: 'Steven Guan',
  title: 'Steven Guan - Full Stack Developer',
  description: 'Personal blog and portfolio of Steven Guan',
  url: 'https://stevenguan.com',
  ogImage: '/images/og-image.jpg',
  links: {
    github: 'https://github.com/stevenguan',
    linkedin: 'https://linkedin.com/in/stevenguan',
    twitter: 'https://twitter.com/stevenguan',
    email: 'hello@stevenguan.com'
  }
};

export const ROUTES = {
  HOME: '/',
  PROJECTS: '/projects',
  ABOUT: '/about',
  BLOG: '/blog',
  AUTH: {
    SIGNIN: '/auth/signin',
    SIGNOUT: '/auth/signout',
    ERROR: '/auth/error'
  }
};

export const API_ROUTES = {
  AUTH: '/api/auth',
  BLOG: '/api/blog',
  PROJECTS: '/api/projects',
  COMMENTS: '/api/comments',
  REACTIONS: '/api/reactions'
};

export const REACTION_TYPES = {
  LIKE: 'like',
  LOVE: 'love',
  LAUGH: 'laugh',
  WOW: 'wow',
  SAD: 'sad',
  ANGRY: 'angry'
} as const;
