
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

      // Fetch from database using correct column names
      const { data, error } = await supabase
        .from('api_keys')
        .select('key_value')
        .eq('service_name', service)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        console.warn(`API key not found for service: ${service}`);
        return null;
      }

      // Cache the key
      this.setCachedKey(service, data.key_value);

      // Update last used timestamp
      await this.updateLastUsed(service);

      return data.key_value;
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

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No authenticated user');
      }

      // Sanitize service name
      const sanitizedService = service.replace(/[^a-zA-Z0-9_-]/g, '');

      const { error } = await supabase
        .from('api_keys')
        .upsert({
          service_name: sanitizedService,
          key_name: `${sanitizedService}_api_key`,
          key_value: key,
          user_id: user.id,
          is_active: true,
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

  async storeApiKey(service: string, keyName: string, keyValue: string): Promise<boolean> {
    return this.setApiKey(service, keyValue);
  }

  async deactivateApiKey(service: string): Promise<boolean> {
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

      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('service_name', service);

      if (error) {
        throw error;
      }

      // Clear cache for this service
      this.clearCachedKey(service);

      await securityService.logSecurityEvent({
        event_type: 'api_key_deactivated',
        severity: 'medium',
        details: { service }
      });

      return true;
    } catch (error) {
      console.error('Error deactivating API key:', error);
      await securityService.logSecurityEvent({
        event_type: 'api_key_deactivation_error',
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
        .update({ updated_at: new Date().toISOString() })
        .eq('service_name', service);
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
