import { NextRequest, NextResponse } from 'next/server';
import { getBlogPosts, createBlogPost } from '@/backend/lib/database';
import { buildQueryString } from '@/shared/utils/api';
import { slugify } from '@/shared/utils/format';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published') !== 'false';
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    const tag = searchParams.get('tag');

    const posts = await getBlogPosts(published);
    
    // Apply filters
    let filteredPosts = posts;
    
    if (tag) {
      filteredPosts = posts.filter(post => 
        post.tags && post.tags.includes(tag)
      );
    }
    
    // Apply pagination
    if (limit) {
      const limitNum = parseInt(limit, 10);
      const offsetNum = offset ? parseInt(offset, 10) : 0;
      filteredPosts = filteredPosts.slice(offsetNum, offsetNum + limitNum);
    }

    return NextResponse.json({
      success: true,
      data: filteredPosts,
      total: posts.length,
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch blog posts' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, excerpt, tags, published, featured_image } = body;

    // For now, we'll use a fixed author ID
    // In production, this would come from the authenticated user
    const author_id = '550e8400-e29b-41d4-a716-446655440000';

    const post = await createBlogPost({
      title,
      slug: slugify(title),
      content,
      excerpt,
      author_id,
      published: published ?? false,
      tags: tags || [],
      featured_image,
    });

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create blog post' 
      },
      { status: 500 }
    );
  }
} 