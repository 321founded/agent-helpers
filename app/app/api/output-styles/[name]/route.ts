import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getConfig } from '@/lib/config';

// DELETE - Remove output style completely
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const config = await getConfig();
    const localPath = config.localOutputStylesPath.replace('~', require('os').homedir());
    const stylePath = path.join(localPath, `${name}.md`);

    // Check if style exists
    try {
      await fs.access(stylePath);
    } catch {
      return NextResponse.json(
        { error: 'Output style not found' },
        { status: 404 }
      );
    }

    // Delete the style file
    await fs.rm(stylePath, { force: true });

    return NextResponse.json({ success: true, message: 'Output style deleted successfully' });
  } catch (error) {
    console.error('Failed to delete output style:', error);
    return NextResponse.json(
      { error: 'Failed to delete output style' },
      { status: 500 }
    );
  }
}

// POST - Archive output style
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const { action } = await request.json();

    if (action !== 'archive' && action !== 'unarchive') {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    const config = await getConfig();
    const localPath = config.localOutputStylesPath.replace('~', require('os').homedir());
    const stylePath = path.join(localPath, `${name}.md`);
    const archivePath = path.join(localPath, '.archived', `${name}.md`);

    if (action === 'archive') {
      // Move to .archived
      await fs.mkdir(path.join(localPath, '.archived'), { recursive: true });
      await fs.rename(stylePath, archivePath);
      return NextResponse.json({ success: true, message: 'Output style archived successfully' });
    } else {
      // Unarchive - move back
      await fs.rename(archivePath, stylePath);
      return NextResponse.json({ success: true, message: 'Output style restored successfully' });
    }
  } catch (error) {
    console.error('Failed to archive output style:', error);
    return NextResponse.json(
      { error: 'Failed to archive output style' },
      { status: 500 }
    );
  }
}
