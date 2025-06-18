
// Centralized error handling and fallback system
class ErrorHandlingService {
  private fallbackKeys: Record<string, string> = {};
  private errorCounts: Map<string, number> = new Map();
  private maxRetries = 3;

  // Safe number conversion with toFixed protection
  safeToFixed(value: any, digits: number = 2): string {
    if (value === null || value === undefined || value === '') {
      return '0.00';
    }
    
    const num = Number(value);
    if (Number.isNaN(num) || !Number.isFinite(num)) {
      return '0.00';
    }
    
    try {
      return num.toFixed(digits);
    } catch (error) {
      console.warn('toFixed error caught:', error);
      return '0.00';
    }
  }

  // Safe API call wrapper with fallbacks
  async safeApiCall<T>(
    apiCall: () => Promise<T>,
    fallback: T,
    context: string = 'unknown'
  ): Promise<T> {
    const errorKey = `api_error_${context}`;
    const currentErrors = this.errorCounts.get(errorKey) || 0;

    if (currentErrors >= this.maxRetries) {
      console.warn(`Max retries exceeded for ${context}, using fallback`);
      return fallback;
    }

    try {
      const result = await apiCall();
      // Reset error count on success
      this.errorCounts.delete(errorKey);
      return result;
    } catch (error) {
      this.errorCounts.set(errorKey, currentErrors + 1);
      console.error(`API call failed for ${context}:`, error);
      
      // Log to console for debugging
      console.warn(`Using fallback for ${context} due to error:`, error.message);
      
      return fallback;
    }
  }

  // Store fallback keys in localStorage
  setFallbackKey(service: string, key: string): void {
    if (key && key.trim()) {
      this.fallbackKeys[service] = key;
      localStorage.setItem(`fallback_${service}_key`, key);
    }
  }

  // Get fallback key
  getFallbackKey(service: string): string | null {
    return this.fallbackKeys[service] || localStorage.getItem(`fallback_${service}_key`);
  }

  // Reset error counts (useful for manual retry)
  resetErrorCounts(): void {
    this.errorCounts.clear();
  }
}

export const errorHandlingService = new ErrorHandlingService();

// Global toFixed protection - monkey patch for safety
const originalToFixed = Number.prototype.toFixed;
Number.prototype.toFixed = function(digits?: number) {
  if (typeof this !== 'number' || !Number.isFinite(this)) {
    console.warn('toFixed called on invalid number:', this);
    return '0';
  }
  return originalToFixed.call(this, digits);
};
