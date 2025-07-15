import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';
import Link from 'next/link';
import { site } from '@/shared/utils/config';

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950 dark:to-gray-900 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
              {site.name}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              {site.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/blog" className="btn-primary inline-flex items-center gap-2">
                Read Latest Posts
                <ArrowRight size={20} />
              </Link>
              <Link href="/about" className="btn-secondary">
                About Me
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Recent Posts</h2>
            <Link 
              href="/blog" 
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium inline-flex items-center gap-2"
            >
              View All Posts
              <ArrowRight size={16} />
            </Link>
          </div>
          
          {/* Posts Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Featured Post */}
            <div className="lg:col-span-2">
              <div className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    Latest Post
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-4 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  <Link href="/blog/welcome-to-my-blog">
                    Welcome to My Technical Blog
                  </Link>
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Starting this journey to share insights about AI, machine learning, and software development. 
                  Here's what you can expect from this blog and my vision for the future.
                </p>
                <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>Dec 15, 2024</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>5 min read</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag size={16} />
                    <span>AI, Blog, Welcome</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Regular Posts */}
            <div className="card p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-3 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <Link href="/blog/understanding-llms">
                  Understanding Large Language Models
                </Link>
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                A deep dive into how LLMs work, their capabilities, and limitations in today's AI landscape.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>Dec 10, 2024</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>8 min read</span>
                </div>
              </div>
            </div>

            <div className="card p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-3 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <Link href="/blog/ai-prototyping-best-practices">
                  AI Prototyping Best Practices
                </Link>
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Learn how to effectively prototype AI solutions and avoid common pitfalls in the development process.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>Dec 8, 2024</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>12 min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Get notified when I publish new articles about AI, technology, and software development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="input-primary"
              />
              <button className="btn-primary">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              No spam, unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
} 