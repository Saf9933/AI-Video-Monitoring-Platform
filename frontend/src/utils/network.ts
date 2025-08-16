// src/utils/network.ts
// Network utilities for timeout and retry logic

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffType: 'linear' | 'exponential';
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 2,
  baseDelay: 500,
  maxDelay: 3000,
  backoffType: 'exponential'
};

/**
 * Calculate delay for retry attempt
 */
export function calculateRetryDelay(attempt: number, config: RetryConfig): number {
  const { baseDelay, maxDelay, backoffType } = config;
  
  let delay: number;
  if (backoffType === 'exponential') {
    delay = baseDelay * Math.pow(2, attempt);
  } else {
    delay = baseDelay * (attempt + 1);
  }
  
  return Math.min(delay, maxDelay);
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetch with timeout support
 */
export async function fetchWithTimeout(
  url: string, 
  options: RequestInit = {}, 
  timeoutMs: number = 3000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeoutMs}ms`);
    }
    throw error;
  }
}

/**
 * Retry logic with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === config.maxRetries) {
        break;
      }
      
      const delay = calculateRetryDelay(attempt, config);
      await sleep(delay);
    }
  }
  
  throw lastError!;
}

/**
 * Combined fetch with timeout and retry
 */
export async function robustFetch(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 3000,
  retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<Response> {
  return retryWithBackoff(
    () => fetchWithTimeout(url, options, timeoutMs),
    retryConfig
  );
}