import { NextRequest, NextResponse } from 'next/server';
import { getProjectBySlug } from '@/backend/lib/database';
import { processMediaContent } from '@/shared/utils/content';
import { Project } from '@/shared/types';

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

    let project: Project | null = null;
    
    try {
      project = await getProjectBySlug(slug) as unknown as Project;
    } catch (error) {
      // Project not found or other database error
    }
    
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Process the content for multimedia (YouTube videos, etc.)
    const processedContent = processMediaContent(project.content);
    
    return NextResponse.json({
      success: true,
      data: {
        ...project,
        content: processedContent,
      },
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch project' 
      },
      { status: 500 }
    );
  }
} 