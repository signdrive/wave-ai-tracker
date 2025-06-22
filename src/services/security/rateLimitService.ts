
class RateLimitService {
  private rateLimitTracker = new Map<string, { count: number; windowStart: number }>();
  private readonly RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
  private readonly DEFAULT_RATE_LIMIT = 10;

  async checkRateLimit(identifier: string, action: string, limit: number = this.DEFAULT_RATE_LIMIT): Promise<boolean> {
    const key = `${identifier}:${action}`;
    const now = Date.now();
    const record = this.rateLimitTracker.get(key);

    if (!record || now - record.windowStart > this.RATE_LIMIT_WINDOW) {
      this.rateLimitTracker.set(key, { count: 1, windowStart: now });
      return true;
    }

    if (record.count >= limit) {
      return false;
    }

    record.count++;
    return true;
  }

  async cleanupOldRateLimits(): Promise<void> {
    const now = Date.now();
    for (const [key, record] of this.rateLimitTracker.entries()) {
      if (now - record.windowStart > this.RATE_LIMIT_WINDOW) {
        this.rateLimitTracker.delete(key);
      }
    }
  }
}

export const rateLimitService = new RateLimitService();
