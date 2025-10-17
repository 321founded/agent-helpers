import { NextResponse } from 'next/server';
import { listLocalAgents } from '@/lib/customization-manager';

export async function GET() {
  try {
    const agents = await listLocalAgents();
    return NextResponse.json(agents);
  } catch (error) {
    console.error('Failed to list local agents:', error);
    return NextResponse.json(
      { error: 'Failed to list local agents' },
      { status: 500 }
    );
  }
}
