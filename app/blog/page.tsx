import { getAllPosts, getAllCategories, getAllTags } from '@/shared/utils/mdx';
import { formatDate } from '@/shared/utils/format';
import { Calendar, Clock, Tag, Search } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Technical articles about AI, machine learning, and software development',
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const tags = getAllTags();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Technical insights, AI research, and software development articles
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Categories:</span>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/blog/category/${category.toLowerCase()}`}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Tags:</span>
            {tags.slice(0, 10).map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${tag.toLowerCase()}`}
                className="px-2 py-1 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 rounded text-sm hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Posts */}
        {posts.filter(post => post.featured).length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured Posts</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {posts.filter(post => post.featured).map((post) => (
                <div key={post.slug} className="card p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{post.readingTime} min read</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Posts */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">All Posts</h2>
          <div className="grid gap-6">
            {posts.map((post) => (
              <article key={post.slug} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {post.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{post.readingTime} min read</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Tag size={14} />
                        <span>{post.categories.join(', ')}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/blog/tag/${tag.toLowerCase()}`}
                          className="px-2 py-1 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 rounded text-sm hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="lg:w-48 flex-shrink-0">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="btn-primary w-full text-center"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* No Posts */}
        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No blog posts available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
} 