/**
 * Centralized configuration management
 * All environment variables are accessed through this file
 */

// Validation helper
function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value;
}

function getOptionalEnvVar(key: string, defaultValue?: string): string | undefined {
  return process.env[key] || defaultValue;
}

// NextAuth Configuration
export const auth = {
  nextAuthUrl: getEnvVar('NEXTAUTH_URL', 'http://localhost:3000'),
  nextAuthSecret: getEnvVar('NEXTAUTH_SECRET'),
  
  // Social providers
  google: {
    clientId: getEnvVar('GOOGLE_CLIENT_ID'),
    clientSecret: getEnvVar('GOOGLE_CLIENT_SECRET'),
  },
  github: {
    clientId: getEnvVar('GITHUB_ID'),
    clientSecret: getEnvVar('GITHUB_SECRET'),
  },
  linkedin: {
    clientId: getOptionalEnvVar('LINKEDIN_CLIENT_ID'),
    clientSecret: getOptionalEnvVar('LINKEDIN_CLIENT_SECRET'),
  },
  facebook: {
    clientId: getOptionalEnvVar('FACEBOOK_CLIENT_ID'),
    clientSecret: getOptionalEnvVar('FACEBOOK_CLIENT_SECRET'),
  },
};

// Database Configuration
export const database = {
  supabaseUrl: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
  supabaseAnonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  supabaseServiceRoleKey: getEnvVar('SUPABASE_SERVICE_ROLE_KEY'),
};

// Email Configuration (Optional - not currently used)
export const email = {
  smtp: {
    host: getOptionalEnvVar('SMTP_HOST', 'smtp.gmail.com'),
    port: parseInt(getOptionalEnvVar('SMTP_PORT', '587') || '587'),
    secure: getOptionalEnvVar('SMTP_SECURE', 'false') === 'true',
    user: getOptionalEnvVar('SMTP_USER'),
    password: getOptionalEnvVar('SMTP_PASSWORD'),
  },
  addresses: {
    admin: getOptionalEnvVar('ADMIN_EMAIL'),
    from: getOptionalEnvVar('FROM_EMAIL'),
  },
};

// Site Configuration
export const site = {
  name: getEnvVar('SITE_NAME', 'Technical Blog'),
  url: getEnvVar('SITE_URL', 'http://localhost:3000'),
  description: getEnvVar('SITE_DESCRIPTION', 'AI industry insights and technical learning'),
  author: {
    name: getEnvVar('AUTHOR_NAME'),
    email: getEnvVar('AUTHOR_EMAIL'),
  },
};

// Security & Analytics
export const security = {
  upstash: {
    url: getOptionalEnvVar('UPSTASH_REDIS_REST_URL'),
    token: getOptionalEnvVar('UPSTASH_REDIS_REST_TOKEN'),
  },
};

export const analytics = {
  googleAnalyticsId: getOptionalEnvVar('GOOGLE_ANALYTICS_ID'),
  vercelAnalyticsId: getOptionalEnvVar('VERCEL_ANALYTICS_ID'),
};

// Development helpers
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// Export all configs
export const config = {
  auth,
  database,
  email,
  site,
  security,
  analytics,
  isDevelopment,
  isProduction,
};

export default config; 