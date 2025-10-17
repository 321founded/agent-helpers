import { NextResponse } from 'next/server';
import { listLocalCommands } from '@/lib/customization-manager';

export async function GET() {
  try {
    const commands = await listLocalCommands();
    return NextResponse.json(commands);
  } catch (error) {
    console.error('Failed to list local commands:', error);
    return NextResponse.json(
      { error: 'Failed to list local commands' },
      { status: 500 }
    );
  }
}
