import { NextRequest, NextResponse } from 'next/server';
import { discoverProjects } from '@/lib/project-discovery';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customPaths = searchParams.get('paths');

    // Parse custom search paths if provided
    const searchPaths = customPaths ? customPaths.split(',').map(p => p.trim()) : [];

    const projects = await discoverProjects(searchPaths);

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Failed to discover projects:', error);
    return NextResponse.json(
      { error: 'Failed to discover projects' },
      { status: 500 }
    );
  }
}
