
import { supabase } from '@/integrations/supabase/client';
import { securityEventLogger } from './securityEventLogger';

class RateLimitService {
  private rateLimitCache = new Map<string, { count: number; windowStart: number }>();
  private readonly RATE_LIMIT_WINDOW = 60000; // 1 minute

  async checkRateLimit(identifier: string, action: string, limit: number = 10): Promise<boolean> {
    const key = `${identifier}:${action}`;
    const now = Date.now();
    const windowStart = Math.floor(now / this.RATE_LIMIT_WINDOW) * this.RATE_LIMIT_WINDOW;

    try {
      // Try to check database rate limits first, but fall back to memory if table doesn't exist
      try {
        const { data, error } = await (supabase as any)
          .from('rate_limits')
          .select('count')
          .eq('identifier', identifier)
          .eq('action', action)
          .gte('window_start', new Date(windowStart).toISOString())
          .single();

        let currentCount = 0;
        if (!error && data) {
          currentCount = data.count;
        }

        if (currentCount >= limit) {
          await securityEventLogger.logSecurityEvent({
            event_type: 'rate_limit_exceeded',
            severity: 'medium',
            details: { identifier, action, current: currentCount, limit }
          });
          return false;
        }

        // Update rate limit in database
        await (supabase as any)
          .from('rate_limits')
          .upsert({
            identifier,
            action,
            count: currentCount + 1,
            window_start: new Date(windowStart).toISOString()
          });

        return true;
      } catch (dbError) {
        // Fall back to memory-based rate limiting
        return this.checkMemoryRateLimit(key, limit);
      }
    } catch (error) {
      console.error('Rate limit check failed:', error);
      // Fallback to memory-based rate limiting
      return this.checkMemoryRateLimit(key, limit);
    }
  }

  private checkMemoryRateLimit(key: string, limit: number): boolean {
    const now = Date.now();
    const windowStart = Math.floor(now / this.RATE_LIMIT_WINDOW) * this.RATE_LIMIT_WINDOW;
    
    const cached = this.rateLimitCache.get(key);
    
    if (!cached || cached.windowStart < windowStart) {
      this.rateLimitCache.set(key, { count: 1, windowStart });
      return true;
    }
    
    if (cached.count >= limit) {
      return false;
    }
    
    cached.count++;
    return true;
  }

  async cleanupOldRateLimits(): Promise<void> {
    try {
      // Try to call the cleanup function, but don't fail if it doesn't exist
      try {
        await (supabase as any).rpc('cleanup_rate_limits');
      } catch (rpcError) {
        // Function doesn't exist yet, clean up memory cache instead
        const now = Date.now();
        const oneHourAgo = now - (60 * 60 * 1000);
        
        for (const [key, data] of this.rateLimitCache.entries()) {
          if (data.windowStart < oneHourAgo) {
            this.rateLimitCache.delete(key);
          }
        }
      }
    } catch (error) {
      console.error('Failed to cleanup old rate limits:', error);
    }
  }
}

export const rateLimitService = new RateLimitService();
