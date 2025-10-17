import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getConfig } from '@/lib/config';

// DELETE - Remove agent completely
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const config = await getConfig();
    const localPath = config.localAgentsPath.replace('~', require('os').homedir());
    const agentPath = path.join(localPath, `${name}.md`);

    // Check if agent exists
    try {
      await fs.access(agentPath);
    } catch {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Delete the agent file
    await fs.rm(agentPath, { force: true });

    return NextResponse.json({ success: true, message: 'Agent deleted successfully' });
  } catch (error) {
    console.error('Failed to delete agent:', error);
    return NextResponse.json(
      { error: 'Failed to delete agent' },
      { status: 500 }
    );
  }
}

// POST - Archive agent
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
    const localPath = config.localAgentsPath.replace('~', require('os').homedir());
    const agentPath = path.join(localPath, `${name}.md`);
    const archivePath = path.join(localPath, '.archived', `${name}.md`);

    if (action === 'archive') {
      // Move to .archived
      await fs.mkdir(path.join(localPath, '.archived'), { recursive: true });
      await fs.rename(agentPath, archivePath);
      return NextResponse.json({ success: true, message: 'Agent archived successfully' });
    } else {
      // Unarchive - move back
      await fs.rename(archivePath, agentPath);
      return NextResponse.json({ success: true, message: 'Agent restored successfully' });
    }
  } catch (error) {
    console.error('Failed to archive agent:', error);
    return NextResponse.json(
      { error: 'Failed to archive agent' },
      { status: 500 }
    );
  }
}
