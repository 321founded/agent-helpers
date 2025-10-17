import { NextResponse } from 'next/server';
import { listLocalSkills } from '@/lib/skills-manager';

export async function GET() {
  try {
    const skills = await listLocalSkills();
    return NextResponse.json(skills);
  } catch (error) {
    console.error('Failed to list local skills:', error);
    return NextResponse.json(
      { error: 'Failed to load local skills' },
      { status: 500 }
    );
  }
}
