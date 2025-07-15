// API utility functions
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new ApiError(
      `API request failed: ${response.statusText}`,
      response.status,
      response.statusText
    );
  }

  return response.json();
}

export async function apiGet<T>(url: string): Promise<T> {
  return apiRequest<T>(url, { method: 'GET' });
}

export async function apiPost<T>(url: string, data: any): Promise<T> {
  return apiRequest<T>(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiPut<T>(url: string, data: any): Promise<T> {
  return apiRequest<T>(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function apiDelete<T>(url: string): Promise<T> {
  return apiRequest<T>(url, { method: 'DELETE' });
}

export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item.toString()));
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });
  
  return searchParams.toString();
}

export function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  return new Promise((resolve, reject) => {
    let retries = 0;
    
    const attempt = async () => {
      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        retries++;
        if (retries >= maxRetries) {
          reject(error);
        } else {
          setTimeout(attempt, delay * retries);
        }
      }
    };
    
    attempt();
  });
} 