import { NextRequest, NextResponse } from 'next/server';
import { getBlogPostBySlug } from '@/backend/lib/database';
import { processMediaContent } from '@/shared/utils/content';
import { BlogPost } from '@/shared/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug is required' },
        { status: 400 }
      );
    }

    let post: BlogPost | null = null;
    
    try {
      post = await getBlogPostBySlug(slug) as unknown as BlogPost;
    } catch (error) {
      // Post not found or other database error
    }
    
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Process the content for multimedia (YouTube videos, etc.)
    const processedContent = processMediaContent(post.content);
    
    return NextResponse.json({
      success: true,
      data: {
        ...post,
        content: processedContent,
      },
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch blog post' 
      },
      { status: 500 }
    );
  }
} 