import { NextResponse } from 'next/server';
import { listLocalOutputStyles } from '@/lib/customization-manager';

export async function GET() {
  try {
    const styles = await listLocalOutputStyles();
    return NextResponse.json(styles);
  } catch (error) {
    console.error('Failed to list local output styles:', error);
    return NextResponse.json(
      { error: 'Failed to list local output styles' },
      { status: 500 }
    );
  }
}
