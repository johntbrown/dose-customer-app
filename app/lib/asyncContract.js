export const ASYNC_CONTRACT_VERSION = 'async-v1';

export const asyncStatus = {
  idle: 'idle',
  loading: 'loading',
  success: 'success',
  empty: 'empty',
  stale: 'stale',
  error: 'error',
};

export function success(data, meta = {}) {
  return { ok: true, status: asyncStatus.success, data, error: null, meta };
}

export function empty(meta = {}) {
  return { ok: true, status: asyncStatus.empty, data: null, error: null, meta };
}

export function stale(data, meta = {}) {
  return { ok: true, status: asyncStatus.stale, data, error: null, meta: { ...meta, stale: true } };
}

export function failure(error, meta = {}) {
  const safeError = error instanceof Error ? error : new Error(String(error || 'Something went wrong'));
  return { ok: false, status: asyncStatus.error, data: null, error: safeError, meta };
}

export function withTimeout(promise, timeoutMs = 8000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      const id = setTimeout(() => reject(new Error('Request timed out')), timeoutMs);
      promise.finally(() => clearTimeout(id)).catch(() => {});
    }),
  ]);
}

export async function runWithPolicy(task, {
  retries = 1,
  timeoutMs = 8000,
  retryDelayMs = 350,
  fallbackData,
  metadata = {},
} = {}) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const data = await withTimeout(Promise.resolve().then(task), timeoutMs);
      if (data == null || (Array.isArray(data) && data.length === 0)) {
        return empty({ ...metadata, attempt });
      }
      return success(data, { ...metadata, attempt });
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, retryDelayMs * (attempt + 1)));
      }
    }
  }

  if (fallbackData !== undefined && fallbackData !== null) {
    return stale(fallbackData, { ...metadata, fallback: 'last_known_good', cause: lastError?.message });
  }

  return failure(lastError, metadata);
}

export function emitDoseToast(detail) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('dose:toast', {
    detail: {
      tone: 'success',
      title: 'Saved',
      message: '',
      duration: 3200,
      ...detail,
    },
  }));
}
