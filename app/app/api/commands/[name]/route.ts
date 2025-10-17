import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getConfig } from '@/lib/config';

// DELETE - Remove command completely
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const config = await getConfig();
    const localPath = config.localCommandsPath.replace('~', require('os').homedir());
    const commandPath = path.join(localPath, `${name}.md`);

    // Check if command exists
    try {
      await fs.access(commandPath);
    } catch {
      return NextResponse.json(
        { error: 'Command not found' },
        { status: 404 }
      );
    }

    // Delete the command file
    await fs.rm(commandPath, { force: true });

    return NextResponse.json({ success: true, message: 'Command deleted successfully' });
  } catch (error) {
    console.error('Failed to delete command:', error);
    return NextResponse.json(
      { error: 'Failed to delete command' },
      { status: 500 }
    );
  }
}

// POST - Archive command
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
    const localPath = config.localCommandsPath.replace('~', require('os').homedir());
    const commandPath = path.join(localPath, `${name}.md`);
    const archivePath = path.join(localPath, '.archived', `${name}.md`);

    if (action === 'archive') {
      // Move to .archived
      await fs.mkdir(path.join(localPath, '.archived'), { recursive: true });
      await fs.rename(commandPath, archivePath);
      return NextResponse.json({ success: true, message: 'Command archived successfully' });
    } else {
      // Unarchive - move back
      await fs.rename(archivePath, commandPath);
      return NextResponse.json({ success: true, message: 'Command restored successfully' });
    }
  } catch (error) {
    console.error('Failed to archive command:', error);
    return NextResponse.json(
      { error: 'Failed to archive command' },
      { status: 500 }
    );
  }
}
