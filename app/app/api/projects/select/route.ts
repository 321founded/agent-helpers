import { NextRequest, NextResponse } from 'next/server';
import { getConfig, saveConfig } from '@/lib/config';
import path from 'path';

// POST - Select a project (update config to point to its .claude directory)
export async function POST(request: NextRequest) {
  try {
    const { claudePath } = await request.json();

    if (!claudePath) {
      return NextResponse.json(
        { error: 'claudePath is required' },
        { status: 400 }
      );
    }

    const config = await getConfig();

    // Update claudeBasePath and recalculate all paths
    const basePath = claudePath.replace('~', require('os').homedir());

    const updatedConfig = {
      ...config,
      claudeBasePath: claudePath,
      localSkillsPath: path.join(basePath, 'skills'),
      localCommandsPath: path.join(basePath, 'commands'),
      localAgentsPath: path.join(basePath, 'agents'),
      localOutputStylesPath: path.join(basePath, 'output-styles'),
    };

    await saveConfig(updatedConfig);

    return NextResponse.json({
      success: true,
      message: 'Project selected successfully',
      config: updatedConfig
    });
  } catch (error) {
    console.error('Failed to select project:', error);
    return NextResponse.json(
      { error: 'Failed to select project' },
      { status: 500 }
    );
  }
}
