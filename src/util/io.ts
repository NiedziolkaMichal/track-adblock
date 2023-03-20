export async function fetchAbortable(input: RequestInfo | URL, init?: RequestInit, abortMillis = 10000) {
  const controller = new AbortController();

  try {
    const timeoutId = setTimeout(() => controller.abort(), abortMillis);
    const response = await fetch(input, {
      ...init,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (e) {
    return Promise.reject(e);
  }
}
