'use client';

import { useEffect, useState } from 'react';
import { DEFAULT_PROGRESS, PROGRESS_VERSION } from './progressEngine';

const STORAGE_KEY = 'my-dose-progress-v1';

export default function usePersistentProgress() {
  const [progress, setProgress] = useState(DEFAULT_PROGRESS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.version === PROGRESS_VERSION) setProgress({ ...DEFAULT_PROGRESS, ...parsed });
      }
    } catch (error) {
      console.warn('Unable to restore prototype progress', error);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.warn('Unable to persist prototype progress', error);
    }
  }, [progress, hydrated]);

  const resetProgress = () => {
    setProgress(DEFAULT_PROGRESS);
    try { window.localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  return { progress, setProgress, resetProgress, hydrated };
}
