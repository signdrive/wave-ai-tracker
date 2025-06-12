
// Secure API key management service
import { supabase } from '@/integrations/supabase/client';
import { securityService } from './securityService';

interface ApiKeyConfig {
  service: string;
  key: string;
  encrypted: boolean;
  last_used?: string;
}

class SecureApiKeyManager {
  private keyCache = new Map<string, string>();
  private cacheExpiry = new Map<string, number>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async getApiKey(service: string): Promise<string | null> {
    try {
      // Check cache first
      const cachedKey = this.getCachedKey(service);
      if (cachedKey) {
        return cachedKey;
      }

      // Validate session before accessing keys
      const isValidSession = await securityService.validateSession();
      if (!isValidSession) {
        await securityService.logSecurityEvent({
          event_type: 'unauthorized_api_key_access',
          severity: 'high',
          details: { service }
        });
        return null;
      }

      // Fetch from database
      const { data, error } = await supabase
        .from('api_keys')
        .select('key')
        .eq('service', service)
        .eq('active', true)
        .single();

      if (error || !data) {
        console.warn(`API key not found for service: ${service}`);
        return null;
      }

      // Cache the key
      this.setCachedKey(service, data.key);
      
      // Update last used timestamp
      await this.updateLastUsed(service);

      return data.key;
    } catch (error) {
      console.error('Error fetching API key:', error);
      await securityService.logSecurityEvent({
        event_type: 'api_key_fetch_error',
        severity: 'medium',
        details: { service, error: error instanceof Error ? error.message : 'Unknown error' }
      });
      return null;
    }
  }

  async setApiKey(service: string, key: string): Promise<boolean> {
    try {
      // Validate admin role
      const isAdmin = await securityService.checkUserRole('admin');
      if (!isAdmin) {
        await securityService.logSecurityEvent({
          event_type: 'unauthorized_api_key_modification',
          severity: 'critical',
          details: { service }
        });
        return false;
      }

      // Validate key format (basic check)
      if (!key || key.length < 10) {
        throw new Error('Invalid API key format');
      }

      // Sanitize service name
      const sanitizedService = service.replace(/[^a-zA-Z0-9_-]/g, '');

      const { error } = await supabase
        .from('api_keys')
        .upsert({
          service: sanitizedService,
          key: key,
          encrypted: false, // In production, this should be encrypted
          active: true,
          updated_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      // Clear cache for this service
      this.clearCachedKey(service);

      await securityService.logSecurityEvent({
        event_type: 'api_key_updated',
        severity: 'medium',
        details: { service: sanitizedService }
      });

      return true;
    } catch (error) {
      console.error('Error setting API key:', error);
      await securityService.logSecurityEvent({
        event_type: 'api_key_update_error',
        severity: 'high',
        details: { service, error: error instanceof Error ? error.message : 'Unknown error' }
      });
      return false;
    }
  }

  private getCachedKey(service: string): string | null {
    const expiry = this.cacheExpiry.get(service);
    if (!expiry || Date.now() > expiry) {
      this.clearCachedKey(service);
      return null;
    }
    return this.keyCache.get(service) || null;
  }

  private setCachedKey(service: string, key: string): void {
    this.keyCache.set(service, key);
    this.cacheExpiry.set(service, Date.now() + this.CACHE_DURATION);
  }

  private clearCachedKey(service: string): void {
    this.keyCache.delete(service);
    this.cacheExpiry.delete(service);
  }

  private async updateLastUsed(service: string): Promise<void> {
    try {
      await supabase
        .from('api_keys')
        .update({ last_used: new Date().toISOString() })
        .eq('service', service);
    } catch (error) {
      // Non-critical error, just log it
      console.warn('Failed to update last_used timestamp:', error);
    }
  }

  clearAllCache(): void {
    this.keyCache.clear();
    this.cacheExpiry.clear();
  }
}

export const secureApiKeyManager = new SecureApiKeyManager();
