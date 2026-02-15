/**
 * Draft Request Hook
 *
 * Manages autosave of request form drafts to sessionStorage.
 * Automatically expires drafts after 30 minutes (PII safety).
 * Clears draft on successful submission.
 *
 * Usage:
 * const { draft, saveDraft, clearDraft, isExpired } = useDraftRequest();
 */

import { useState, useEffect, useCallback } from 'react';

const DRAFT_KEY = 'request_form_draft';
const DRAFT_EXPIRY_MINUTES = 30;

export interface RequestDraft {
  data: Record<string, unknown>;
  savedAt: number; // Timestamp in ms
}

/**
 * Check if draft has expired (default: 30 minutes)
 */
function isDraftExpired(draft: RequestDraft | null, expiryMinutes = DRAFT_EXPIRY_MINUTES): boolean {
  if (!draft) return true;

  const now = Date.now();
  const ageMinutes = (now - draft.savedAt) / (1000 * 60);
  return ageMinutes > expiryMinutes;
}

/**
 * Load draft from sessionStorage
 */
function loadDraft(): RequestDraft | null {
  try {
    const stored = sessionStorage.getItem(DRAFT_KEY);
    if (!stored) return null;

    const draft = JSON.parse(stored) as RequestDraft;

    // Check expiry
    if (isDraftExpired(draft)) {
      sessionStorage.removeItem(DRAFT_KEY);
      return null;
    }

    return draft;
  } catch (err) {
    console.warn('[Draft] Failed to load draft:', err);
    return null;
  }
}

/**
 * Save draft to sessionStorage
 */
function saveDraftToStorage(data: Record<string, unknown>): void {
  try {
    const draft: RequestDraft = {
      data,
      savedAt: Date.now(),
    };
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch (err) {
    console.warn('[Draft] Failed to save draft:', err);
  }
}

/**
 * Clear draft from sessionStorage
 */
function clearDraftFromStorage(): void {
  sessionStorage.removeItem(DRAFT_KEY);
}

// ============================================================================
// HOOK
// ============================================================================

export function useDraftRequest() {
  const [draft, setDraft] = useState<RequestDraft | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  // Load draft on mount
  useEffect(() => {
    const loaded = loadDraft();
    setDraft(loaded);
    setIsExpired(isDraftExpired(loaded));

    if (loaded && !isDraftExpired(loaded)) {
      console.log('[Draft] Loaded auto-saved form draft');
    }
  }, []);

  // Check expiry periodically
  useEffect(() => {
    const timer = setInterval(() => {
      if (draft && isDraftExpired(draft)) {
        setIsExpired(true);
        setDraft(null);
        console.log('[Draft] Draft expired, cleared from memory');
      }
    }, 60000); // Check every minute

    return () => clearInterval(timer);
  }, [draft]);

  const saveDraft = useCallback((data: Record<string, unknown>) => {
    saveDraftToStorage(data);
    setDraft({ data, savedAt: Date.now() });
    setIsExpired(false);
  }, []);

  const clearDraft = useCallback(() => {
    clearDraftFromStorage();
    setDraft(null);
    setIsExpired(false);
  }, []);

  return {
    draft: draft?.data || null,
    saveDraft,
    clearDraft,
    isExpired,
    isDraftAvailable: !isExpired && draft !== null,
  };
}
