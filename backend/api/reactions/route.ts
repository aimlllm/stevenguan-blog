import { NextRequest, NextResponse } from 'next/server';
import { 
  getPostReactions, 
  upsertPostReaction, 
  removePostReaction 
} from '@/lib/supabase';

// GET /api/reactions - Get reactions for a post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postSlug = searchParams.get('postSlug');
    const userId = searchParams.get('userId');

    if (!postSlug) {
      return NextResponse.json(
        { error: 'Post slug is required' },
        { status: 400 }
      );
    }

    const reactions = await getPostReactions(postSlug, userId || undefined);
    return NextResponse.json({ data: reactions });
  } catch (error) {
    console.error('Error fetching reactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reactions' },
      { status: 500 }
    );
  }
}

// POST /api/reactions - Add or update reaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postSlug, userId, reactionType } = body;

    if (!postSlug || !userId || !reactionType) {
      return NextResponse.json(
        { error: 'Post slug, user ID, and reaction type are required' },
        { status: 400 }
      );
    }

    if (!['like', 'dislike'].includes(reactionType)) {
      return NextResponse.json(
        { error: 'Invalid reaction type' },
        { status: 400 }
      );
    }

    await upsertPostReaction(postSlug, userId, reactionType);
    const updatedReactions = await getPostReactions(postSlug, userId);
    
    return NextResponse.json({ data: updatedReactions });
  } catch (error) {
    console.error('Error updating reaction:', error);
    return NextResponse.json(
      { error: 'Failed to update reaction' },
      { status: 500 }
    );
  }
}

// DELETE /api/reactions - Remove reaction
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postSlug = searchParams.get('postSlug');
    const userId = searchParams.get('userId');

    if (!postSlug || !userId) {
      return NextResponse.json(
        { error: 'Post slug and user ID are required' },
        { status: 400 }
      );
    }

    await removePostReaction(postSlug, userId);
    const updatedReactions = await getPostReactions(postSlug, userId);
    
    return NextResponse.json({ data: updatedReactions });
  } catch (error) {
    console.error('Error removing reaction:', error);
    return NextResponse.json(
      { error: 'Failed to remove reaction' },
      { status: 500 }
    );
  }
} 