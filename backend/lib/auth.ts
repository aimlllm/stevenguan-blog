import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { syncUserToSupabase, getUserByEmail } from '@/lib/supabase';

// Environment variables with proper fallbacks and validation
const googleClientId = process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_SECRET;
const githubClientId = process.env.GITHUB_CLIENT_ID || process.env.GITHUB_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET || process.env.GITHUB_SECRET;

if (!googleClientId || !googleClientSecret) {
  console.warn('Google OAuth credentials not found. Google sign-in will be disabled.');
}

if (!githubClientId || !githubClientSecret) {
  console.warn('GitHub OAuth credentials not found. GitHub sign-in will be disabled.');
}

const nextAuth = NextAuth({
  providers: [
    ...(googleClientId && googleClientSecret ? [
      GoogleProvider({
        clientId: googleClientId,
        clientSecret: googleClientSecret,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code"
          }
        }
      })
    ] : []),
    ...(githubClientId && githubClientSecret ? [
      GitHubProvider({
        clientId: githubClientId,
        clientSecret: githubClientSecret,
      })
    ] : []),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Basic validation
      if (!user.email || !account) {
        console.error('Missing user email or account information');
        return false;
      }
      
      try {
        // Sync user to Supabase database
        await syncUserToSupabase(user, account);
        return true;
      } catch (error) {
        console.error('Error during sign in callback:', error);
        // Return false to trigger error page
        return false;
      }
    },
    async session({ session, token }) {
      if (session.user?.email) {
        try {
          const dbUser = await getUserByEmail(session.user.email);
          if (dbUser) {
            // Add database user ID to session
            (session.user as any).id = dbUser.id;
          }
        } catch (error) {
          console.error('Error fetching user in session callback:', error);
          // Continue with session even if DB fetch fails
        }
      }
      return session;
    },
    async jwt({ token, user, account }) {
      // Include user ID in JWT token
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
});

export const { handlers, auth, signIn, signOut } = nextAuth; 