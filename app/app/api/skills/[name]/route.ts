import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getConfig } from '@/lib/config';

// DELETE - Remove skill completely
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const config = await getConfig();
    const localPath = config.localSkillsPath.replace('~', require('os').homedir());
    const skillPath = path.join(localPath, name);

    // Check if skill exists
    try {
      await fs.access(skillPath);
    } catch {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }

    // Delete the skill directory
    await fs.rm(skillPath, { recursive: true, force: true });

    return NextResponse.json({ success: true, message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Failed to delete skill:', error);
    return NextResponse.json(
      { error: 'Failed to delete skill' },
      { status: 500 }
    );
  }
}

// POST - Archive skill
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
    const localPath = config.localSkillsPath.replace('~', require('os').homedir());
    const skillPath = path.join(localPath, name);
    const archivePath = path.join(localPath, '.archived', name);

    if (action === 'archive') {
      // Move to .archived
      await fs.mkdir(path.join(localPath, '.archived'), { recursive: true });
      await fs.rename(skillPath, archivePath);
      return NextResponse.json({ success: true, message: 'Skill archived successfully' });
    } else {
      // Unarchive - move back
      await fs.rename(archivePath, skillPath);
      return NextResponse.json({ success: true, message: 'Skill restored successfully' });
    }
  } catch (error) {
    console.error('Failed to archive skill:', error);
    return NextResponse.json(
      { error: 'Failed to archive skill' },
      { status: 500 }
    );
  }
}
