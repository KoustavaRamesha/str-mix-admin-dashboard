export const ADMIN_GEMINI_API_KEY_STORAGE_KEY = 'admin.geminiApiKey';

export function getStoredAdminGeminiApiKey(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  try {
    return window.localStorage.getItem(ADMIN_GEMINI_API_KEY_STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

export function setStoredAdminGeminiApiKey(apiKey: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  const trimmedKey = apiKey.trim();

  try {
    if (!trimmedKey) {
      window.localStorage.removeItem(ADMIN_GEMINI_API_KEY_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(ADMIN_GEMINI_API_KEY_STORAGE_KEY, trimmedKey);
  } catch {
    // Ignore storage failures so the dashboard remains usable.
  }
}

export function maskAdminGeminiApiKey(apiKey: string): string {
  if (!apiKey) {
    return '';
  }

  if (apiKey.length <= 8) {
    return 'Saved';
  }

  return `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`;
}
