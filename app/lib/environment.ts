/**
 * Detect if the app is running in a deployed environment (Vercel, etc.)
 * vs running locally with access to the filesystem
 */
export function isDeployedEnvironment(): boolean {
  // Check if we're in Vercel
  if (process.env.VERCEL) {
    return true;
  }

  // Check if NODE_ENV is production (but not if we're explicitly local)
  if (process.env.NODE_ENV === 'production' && !process.env.LOCAL_DEV) {
    return true;
  }

  return false;
}

/**
 * Check if we can access local filesystem
 */
export function hasFilesystemAccess(): boolean {
  return !isDeployedEnvironment();
}
