import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { 
  getCommentsByPost, 
  createComment, 
  toggleCommentVisibility 
} from '@/lib/supabase';
import { hashString } from '@/lib/utils';

// GET /api/comments - Get comments for a post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postSlug = searchParams.get('postSlug');

    if (!postSlug) {
      return NextResponse.json(
        { error: 'Post slug is required' },
        { status: 400 }
      );
    }

    const comments = await getCommentsByPost(postSlug);
    return NextResponse.json({ data: comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST /api/comments - Create a new comment
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { postSlug, content, parentId } = body;

    if (!postSlug || !content) {
      return NextResponse.json(
        { error: 'Post slug and content are required' },
        { status: 400 }
      );
    }

    // Get user ID from session
    const userId = (session.user as any).id;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const comment = await createComment({
      post_slug: postSlug,
      user_id: userId,
      content: content.trim(),
      parent_id: parentId || null,
    });

    return NextResponse.json({ data: comment }, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

// PUT /api/comments - Update comment visibility (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const adminEmails = process.env.ADMIN_EMAIL?.split(',') || [];
    if (!adminEmails.includes(session.user.email)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { commentId, isHidden } = body;

    if (!commentId || typeof isHidden !== 'boolean') {
      return NextResponse.json(
        { error: 'Comment ID and visibility status are required' },
        { status: 400 }
      );
    }

    await toggleCommentVisibility(commentId, isHidden);
    
    return NextResponse.json({ 
      message: `Comment ${isHidden ? 'hidden' : 'shown'} successfully` 
    });
  } catch (error) {
    console.error('Error updating comment visibility:', error);
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    );
  }
} 