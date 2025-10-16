
export function formatDatabaseUrl(url: string): string {
  if (!url) {
    throw new Error('Database URL is required');
  }

  // Handle special characters in password
  try {
    const urlObj = new URL(url);
    
    // If password contains special characters, ensure it's properly encoded
    if (urlObj.password && /[!@#$%^&*()+=\[\]{}|\\:";'<>?,./]/.test(urlObj.password)) {
      urlObj.password = encodeURIComponent(urlObj.password);
    }
    
    return urlObj.toString();
  } catch (error) {
    console.warn('⚠️ Could not parse database URL, using as-is');
    return url;
  }
}

export function isDatabaseUrlValid(url: string): boolean {
  try {
    new URL(url);
    return url.startsWith('postgresql://') || url.startsWith('postgres://');
  } catch {
    return false;
  }
}
