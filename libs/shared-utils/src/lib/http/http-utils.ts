export function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
  
  return query ? `?${query}` : '';
}

export function parseQueryString(queryString: string): Record<string, string> {
  const params: Record<string, string> = {};
  const query = queryString.startsWith('?') ? queryString.slice(1) : queryString;
  
  if (!query) return params;
  
  query.split('&').forEach((param) => {
    const [key, value] = param.split('=').map(decodeURIComponent);
    if (key) {
      params[key] = value || '';
    }
  });
  
  return params;
}

export function buildUrl(baseUrl: string, path: string, params?: Record<string, string | number | boolean | undefined>): string {
  const url = baseUrl.replace(/\/$/, '') + '/' + path.replace(/^\//, '');
  const queryString = params ? buildQueryString(params) : '';
  return url + queryString;
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function retry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delayMs = 1000
): Promise<T> {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const attempt = async () => {
      attempts++;
      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        if (attempts >= maxAttempts) {
          reject(error);
        } else {
          setTimeout(attempt, delayMs);
        }
      }
    };

    attempt();
  });
}
