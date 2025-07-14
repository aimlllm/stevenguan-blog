import { getPostBySlug, getAllPosts, getRelatedPosts, serializeMDX } from '@/lib/mdx';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { Calendar, Clock, Tag, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PostReactions from '@/components/blog/PostReactions';
import dynamic from 'next/dynamic';

// Dynamically import MDX content to avoid SSR issues
const MDXContent = dynamic(() => import('@/components/blog/MDXContent'), {
  ssr: false,
  loading: () => (
    <article className="prose prose-lg dark:prose-dark max-w-none">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/2"></div>
      </div>
    </article>
  ),
});

type Props = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }

  const mdxSource = await serializeMDX(post.content);
  const relatedPosts = getRelatedPosts(post, 3);
  
  // Get all posts to find prev/next
  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex(p => p.slug === post.slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back to Blog */}
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-8"
        >
          <ArrowLeft size={16} />
          Back to Blog
        </Link>

        {/* Post Header */}
        <header className="mb-12">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.map((category) => (
              <span
                key={category}
                className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm font-medium"
              >
                {category}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {post.title}
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            {post.description}
          </p>
          
          <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{post.readingTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag size={16} />
              <span>By {post.author}</span>
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-6">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${tag.toLowerCase()}`}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </header>

        {/* Post Content */}
        <MDXContent mdxSource={mdxSource} />

        {/* Post Reactions */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Was this helpful?</h3>
            <PostReactions postSlug={post.slug} />
          </div>
        </div>

        {/* Post Navigation */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="grid md:grid-cols-2 gap-8">
            {prevPost && (
              <Link 
                href={`/blog/${prevPost.slug}`}
                className="group p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 mb-2">
                  <ArrowLeft size={16} />
                  <span className="text-sm font-medium">Previous</span>
                </div>
                <h3 className="font-semibold group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {prevPost.title}
                </h3>
              </Link>
            )}
            
            {nextPost && (
              <Link 
                href={`/blog/${nextPost.slug}`}
                className="group p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow md:ml-auto"
              >
                <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 mb-2 md:justify-end">
                  <span className="text-sm font-medium">Next</span>
                  <ArrowRight size={16} />
                </div>
                <h3 className="font-semibold group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors md:text-right">
                  {nextPost.title}
                </h3>
              </Link>
            )}
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-8">Related Posts</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <div key={relatedPost.slug} className="card p-6 hover:shadow-lg transition-shadow">
                  <h3 className="font-semibold mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    <Link href={`/blog/${relatedPost.slug}`}>
                      {relatedPost.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {relatedPost.description.slice(0, 100)}...
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>{formatDate(relatedPost.publishedAt)}</span>
                    <span>{relatedPost.readingTime} min read</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-8">Comments</h2>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Comments functionality will be available after deployment.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Authentication and real-time comments coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 