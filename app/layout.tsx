import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import './globals.css';
import { site } from '@/shared/utils/config';
import { cn } from '@/shared/utils/utils';
import AuthSessionProvider from '@/components/auth/SessionProvider';
import AuthButton from '@/components/auth/AuthButton';
import ThemeToggle from '@/components/ui/ThemeToggle';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: ['blog', 'AI', 'artificial intelligence', 'machine learning', 'technical', 'programming'],
  authors: [{ name: site.author.name, url: site.url }],
  creator: site.author.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: site.url,
    title: site.name,
    description: site.description,
    siteName: site.name,
    images: [
      {
        url: `${site.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: site.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: site.name,
    description: site.description,
    images: [`${site.url}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, 'antialiased')}>
        <AuthSessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <div className="flex min-h-screen flex-col">
            <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold gradient-text">
                      {site.name}
                    </h1>
                  </div>
                  <nav className="flex items-center space-x-6">
                    <a
                      href="/"
                      className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      Home
                    </a>
                    <a
                      href="/blog"
                      className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      Blog
                    </a>
                    <a
                      href="/about"
                      className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      About
                    </a>
                    <div className="flex items-center space-x-4">
                      <ThemeToggle />
                      <AuthButton />
                    </div>
                  </nav>
                </div>
              </div>
            </header>
            
            <main className="flex-1">
              {children}
            </main>
            
            <footer className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <div className="container mx-auto px-4 py-8">
                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="font-semibold mb-4">{site.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {site.description}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Links</h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                          Blog
                        </a>
                      </li>
                      <li>
                        <a href="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                          About
                        </a>
                      </li>
                      <li>
                        <a href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                          Privacy
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Contact</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {site.author.email}
                    </p>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
                    © {new Date().getFullYear()} {site.author.name}. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
} 